import java.util.*;
import java.io.*;
public class RunML
{
	//This is a comment
	//Saves a MLClient instance via Java Serialization for use later
	public static void saveClient(ML_Client client) throws IOException
	{
		try {
			ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("savedClient.ser"));
			out.writeObject(client);
			out.close();
		} catch(IOException e){
			e.printStackTrace();
			System.out.println("Error saving the Client: " + e.getMessage());
		}
	}

	//Loads the MLClient via Java Serialization
	public static ML_Client loadClient() throws IOException, ClassNotFoundException
	{
		ML_Client client;
        ObjectInputStream in = new ObjectInputStream(new FileInputStream("savedClient.ser"));
        client = (ML_Client) in.readObject();
        in.close();
        return client;
	}

	public static void lockFile(){
		//System.out.println("Locking file!");
		try {
			File f = new File("locked.txt");
			f.createNewFile();
		} catch(IOException e) {
			e.printStackTrace();
		}
	}

	public static void unlockFile() throws IOException{
		//System.out.println("Unlocking File!");
		File f = new File("locked.txt");
		f.delete();
	}

	public static boolean isLocked() throws IOException{
		File f = new File("locked.txt");
		return f.exists();
	}

	public static void main(String[] args)
	{
		//input should be COMMAND [optional specifier] USER INPUT
		ML_Client client;
		try {
			//LOCK!
			if(isLocked()) {
				//System.out.println("started waiting for lock");
			}
			while (isLocked()){
				//Wait until Client is unlocked
			}
			//System.out.println("acquired lock!");
			lockFile();			

			//Load from file
			client = loadClient();
		} catch(IOException e){
			//if file not found (or corrupted), create new
			//TODO: need to change this initial list
			ArrayList<String> foods = new ArrayList<String>();
			foods.add("Chobani");
			foods.add("Sandwich");
			foods.add("Falafel");
			foods.add("Ice Cream");
			foods.add("Milk");
			foods.add("Tuna");
			client = new ML_Client(foods);
		} catch (ClassNotFoundException e){
			//if file not found (or corrupted), create new
			//TODO: need to change this initial list
			ArrayList<String> foods = new ArrayList<String>();
			foods.add("Chobani");
			foods.add("Sandwich");
			foods.add("Falafel");
			foods.add("Ice Cream");
			foods.add("Milk");
			foods.add("Tuna");
			client = new ML_Client(foods);
		}
		//for debugging purposes:
		try {
			if(args[0].equals("ADD"))
			{
				System.out.println(args);
				//input of type ADD "[id#],[name],[GENDER],[desc],[year],[month],[food],[review],[food],[review]..."
				User_Reviews person = new User_Reviews(args[1]);
				client.addUser(person);
				System.out.println(client);
				
			}
			else if(args[0].equals("MODIFY"))
			{
				if(args[1].equals("NAME"))
				{
					//input of type MODIFY NAME [id#] [newName]
					int arg2 = Integer.parseInt(args[2]);
					client.updateUserName(arg2,args[3]);
				}
				else if(args[1].equals("GENDER"))
				{
					//input of type MODIFY NAME [id#] [newGender]
					int arg2 = Integer.parseInt(args[2]);
					User_Reviews.Gender arg3 = User_Reviews.Gender.fromString(args[3]);
					client.updateIdentity(arg2,arg3);
				}
				else if(args[1].equals("DESC"))
				{
					int arg2 = Integer.parseInt(args[2]);
					client.updateIdDescription(arg2,args[3]);
					//input of type MODIFY NAME [id#] [newDesc]
				}
				else if(args[1].equals("YEAR"))
				{
					int arg2 = Integer.parseInt(args[2]);
					int arg3 = Integer.parseInt(args[3]);
					client.updateBirthYear(arg2,arg3);
					//input of type MODIFY NAME [id#] [newYear]
				}
				else if(args[1].equals("MONTH"))
				{
					int arg2 = Integer.parseInt(args[2]);
					int arg3 = Integer.parseInt(args[3]);
					client.updateBirthMonth(arg2,arg3);
					//input of type MODIFY NAME [id#] [newMonth]
				}
				else if(args[1].equals("REVIEW"))
				{
					int arg2 = Integer.parseInt(args[2]);
					int arg4 = Integer.parseInt(args[4]);
					client.updateReview(arg2, args[3], arg4);
					//input of type MODIFY NAME [id#] [newFood] [newReview]
				}
				
			}
			else if(args[0].equals("PING"))
			{
				if(args[1].equals("SUGGEST"))
				{
					//input of type PING SUGGEST [id#] [numWant] [k (how many nearest neighbors you want)]
					int arg2 = Integer.parseInt(args[2]);
					int arg3 = Integer.parseInt(args[3]);
					int arg4 = Integer.parseInt(args[4]);
					String[] recs = client.getRec(arg2,arg4,arg3);
					System.out.print("Foods Suggested:");
					for(int i = 0; i < recs.length - 1; i++)
					{
						
						System.out.print(recs[i] + ",");
					}
					System.out.println(recs[recs.length-1]);	

				}
				else if(args[1].equals("GUESS"))
				{
					//input of type PING SUGGEST [id#] [foodName] [k]
					int arg2 = Integer.parseInt(args[2]);
					int arg4 = Integer.parseInt(args[4]);
					double guess = client.getReviewGuess(args[3], arg4, arg2);
					System.out.println(guess);
				}	

			}
			else if(args[0].equals("PRINT"))
				{
					System.out.println("PRINTING:");
					System.out.println(client);
				}

			else if(args[0].equals("FOODLIST"))
			{
				client.addToFoodList(args[1]);
			}
			
			//Finally, serialize client
			saveClient(client);
		} catch(Exception e){
			e.printStackTrace();
		}
		try {
			unlockFile();
		} catch(IOException ex) {
				System.out.println("Everything died. Give up now.");
		}
	}
}