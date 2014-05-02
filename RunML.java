import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.net.UnknownHostException;


public class RunML {

	/**
	 * @param args
	 */
	//TODO: Handle exceptions with default return values
	public static void main(String[] args) {

		StringBuilder sb = new StringBuilder();
		for (String arg: args){
			sb.append(arg).append(';');
		}
		sb.deleteCharAt(sb.length()-1).append('\n');
		String request = sb.toString();
		
		try {
			sendRequest(request);
		} catch (IOException e){
			e.printStackTrace();
			System.err.println("An error occurred while sending request");
			//TODO: Possible resiliency against the server shutting down
			/*
			try {
				//Runtime.getRuntime().exec("java ML_Request_Handler");
				sendRequest(request);
			} catch (IOException f){
				e.printStackTrace();
				System.err.println("An error occurred while sending request");
			}
			*/
		}
		
	}
	
	public static void sendRequest(String request) throws IOException {
			Socket s = new Socket("localhost", 8800);
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(s.getOutputStream()));
			BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
			bw.write(request);
			bw.flush();
			StringBuilder sb = new StringBuilder();
			int i;
			while((i = br.read()) != -1){
				char c = (char) i;
				sb.append(c);
			}
			bw.close();
			br.close();
			System.out.print(sb.toString()); 
	}
	
	

}