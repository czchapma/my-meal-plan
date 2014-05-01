import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ML_Request_Handler {

	private static final int CLIENT_SAVE_FREQUENCY = 5000;
	private static final File CLIENT_FILE = new File("savedClient.ser");
	private static final File TMP_FILE = new File("savedClient.ser.tmp");
	
	private ML_Client client;
	private ReadWriteLock lock;

	public ML_Request_Handler() {
		try {
			client = loadClient();
		} catch (IOException | ClassNotFoundException e) {
			ArrayList<String> foods = new ArrayList<String>();
			client = new ML_Client(foods);
		}
		lock = new ReentrantReadWriteLock();
	}
	
	public static void main(String[] args){
		ML_Request_Handler h = new ML_Request_Handler();
		h.periodicSave();
		try {
			h.accetpRequests();
			//Nothing below here should ever really be reached
		} catch (IOException e) {
			e.printStackTrace();
			h.saveClient();
		}
		System.exit(1);
	}
	
	public void periodicSave(){
		Runnable r = new Runnable(){
			public void run(){
				while (true){
					saveClient();
					try {
						Thread.sleep(CLIENT_SAVE_FREQUENCY);
					} catch (InterruptedException e) {
						System.err.println("Exception from Thread.sleep");
						System.err.println("This should never happen, but isn't a huge deal");
						e.printStackTrace();
					}
				}
			}
		};
		new Thread(r).start();
	}

	// This is a comment
	// Saves a MLClient instance via Java Serialization for use later
	public void saveClient() {
		lock.writeLock().lock();
		try {
			//tmp file used to prevent file corruption in case of write error
			ObjectOutputStream out = new ObjectOutputStream(
					new FileOutputStream(TMP_FILE));
			out.writeObject(client);
			out.close();
			Files.move(TMP_FILE.toPath(), CLIENT_FILE.toPath());
		} catch (IOException e) {
			e.printStackTrace();
			System.err.println("Error saving the Client: " + e.getMessage());
		} finally {
			lock.writeLock().unlock();
		}
	}

	// Loads the MLClient via Java Serialization
	public ML_Client loadClient() throws IOException, ClassNotFoundException {
		ML_Client client;
		ObjectInputStream in = new ObjectInputStream(new FileInputStream(
				"savedClient.ser"));
		client = (ML_Client) in.readObject();
		in.close();
		return client;
	}

	public void accetpRequests() throws IOException {
		ServerSocket ss = new ServerSocket(8800);
		int numCores = Runtime.getRuntime().availableProcessors();
		ExecutorService e = Executors.newFixedThreadPool(numCores);
		while (true) {
			final Socket s = ss.accept();
			Runnable r = new Runnable() {
				public void run() {
					lock.readLock().lock();
					try {
						BufferedReader br = new BufferedReader(
								new InputStreamReader(s.getInputStream()));
						BufferedWriter bw = new BufferedWriter(
								new OutputStreamWriter(s.getOutputStream()));
						String input = br.readLine();
						br.close();
						String[] args = input.split(",");
						String result = handleRequest(args);
						bw.write(result);
						bw.write('\n');
						bw.flush();
						bw.close();
					} catch (IOException e) {
						e.printStackTrace();
					} finally {
						lock.readLock().unlock();
					}
				}
			};
			e.execute(r);
		}
	}

	public String handleRequest(String[] args) {
		// Adapted from original RunML "main" method

		// for debugging purposes:
		if (args[0].equals("ADD")) {
			StringBuilder sb = new StringBuilder();
			sb.append(args.toString()).append('\n');
			// input of type ADD
			// "[id#],[name],[GENDER],[desc],[year],[month],[food],[review],[food],[review]..."
			User_Reviews person = new User_Reviews(args[1]);
			client.addUser(person);
			sb.append(client.toString());
			return sb.toString();
		} else if (args[0].equals("MODIFY")) {
			if (args[1].equals("NAME")) {
				// input of type MODIFY NAME [id#] [newName]
				int arg2 = Integer.parseInt(args[2]);
				client.updateUserName(arg2, args[3]);
			} else if (args[1].equals("GENDER")) {
				// input of type MODIFY NAME [id#] [newGender]
				int arg2 = Integer.parseInt(args[2]);
				User_Reviews.Gender arg3 = User_Reviews.Gender
						.fromString(args[3]);
				client.updateIdentity(arg2, arg3);
			} else if (args[1].equals("DESC")) {
				int arg2 = Integer.parseInt(args[2]);
				client.updateIdDescription(arg2, args[3]);
				// input of type MODIFY NAME [id#] [newDesc]
			} else if (args[1].equals("YEAR")) {
				int arg2 = Integer.parseInt(args[2]);
				int arg3 = Integer.parseInt(args[3]);
				client.updateBirthYear(arg2, arg3);
				// input of type MODIFY NAME [id#] [newYear]
			} else if (args[1].equals("MONTH")) {
				int arg2 = Integer.parseInt(args[2]);
				int arg3 = Integer.parseInt(args[3]);
				client.updateBirthMonth(arg2, arg3);
				// input of type MODIFY NAME [id#] [newMonth]
			} else if (args[1].equals("REVIEW")) {
				int arg2 = Integer.parseInt(args[2]);
				int arg4 = Integer.parseInt(args[4]);
				client.updateReview(arg2, args[3], arg4);
				// input of type MODIFY NAME [id#] [newFood] [newReview]
			}
		} else if (args[0].equals("PING")) {
			if (args[1].equals("SUGGEST")) {
				// input of type PING SUGGEST [id#] [numWant] [k (how many
				// nearest neighbors you want)]
				int arg2 = Integer.parseInt(args[2]);
				int arg3 = Integer.parseInt(args[3]);
				int arg4 = Integer.parseInt(args[4]);
				String[] recs = client.getRec(arg2, arg4, arg3);
				StringBuilder sb = new StringBuilder();
				sb.append("Foods Suggested:");
				for (int i = 0; i < recs.length - 1; i++) {
					sb.append(recs[i] + ",");
				}
				sb.append(recs[recs.length - 1]);
				return sb.toString();
			} else if (args[1].equals("GUESS")) {
				// input of type PING SUGGEST [id#] [foodName] [k]
				int arg2 = Integer.parseInt(args[2]);
				int arg4 = Integer.parseInt(args[4]);
				double guess = client.getReviewGuess(args[3], arg4, arg2);
				return "" + guess;
			}

		} else if (args[0].equals("PRINT")) {
			return "PRINTING:\n" + client.toString();
		} else if (args[0].equals("FOODLIST")) {
			client.addToFoodList(args[1]);
		}
		return "";
	}
}