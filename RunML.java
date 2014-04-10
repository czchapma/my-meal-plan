import java.util.*;
import java.io.*;
public class RunML
{
	//Saves a MLClient instance via Java Serialization for use later
	public static void saveClient(ML_Client client)
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

	public static void main(String[] args)
	{
		//input should be COMMAND [optional specifier] USER INPUT
		ML_Client client;
		try {
			//Load from file
			client = loadClient();
			System.out.println("loading client from file!");
		} catch(IOException e){
			//if file not found (or corrupted), create new
			System.out.println("no client serialization found, creating new");
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
			System.out.println("Class ML_Client not found, creating new");
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

		if(args[0] == "ADD")
		{
			//input of type ADD "[id#],[name],[GENDER],[desc],[year],[month],[food],[review],[food],[review]..."
			User_Reviews person = new User_Reviews(args[1]);
			client.addUser(person);
		}
		else if(args[0] == "MODIFY")
		{
			if(args[1] == "NAME")
			{
				//input of type MODIFY NAME [id#] [newName]
				int arg2 = Integer.parseInt(args[2]);
				client.updateUserName(arg2,args[3]);
			}
			else if(args[1] == "GENDER")
			{
				//input of type MODIFY NAME [id#] [newGender]
				int arg2 = Integer.parseInt(args[2]);
				User_Reviews.Gender arg3 = User_Reviews.Gender.fromString(args[3]);
				client.updateIdentity(arg2,arg3);
			}
			else if(args[1] == "DESC")
			{
				int arg2 = Integer.parseInt(args[2]);
				client.updateIdDescription(arg2,args[3]);
				//input of type MODIFY NAME [id#] [newDesc]
			}
			else if(args[1] == "YEAR")
			{
				int arg2 = Integer.parseInt(args[2]);
				int arg3 = Integer.parseInt(args[3]);
				client.updateBirthYear(arg2,arg3);
				//input of type MODIFY NAME [id#] [newYear]
			}
			else if(args[1] == "MONTH")
			{
				int arg2 = Integer.parseInt(args[2]);
				int arg3 = Integer.parseInt(args[3]);
				client.updateBirthMonth(arg2,arg3);
				//input of type MODIFY NAME [id#] [newMonth]
			}
			else if(args[1] == "REVIEW")
			{
				int arg2 = Integer.parseInt(args[2]);
				int arg4 = Integer.parseInt(args[4]);
				client.updateReview(arg2, args[3], arg4);
				//input of type MODIFY NAME [id#] [newFood] [newReview]
			}
		}
		else if(args[0] == "PING")
		{
			if(args[1] == "SUGGEST")
			{
				//input of type PING SUGGEST [id#] [numWant] [k (how many nearest neighbors you want)]
				int arg2 = Integer.parseInt(args[2]);
				int arg3 = Integer.parseInt(args[3]);
				int arg4 = Integer.parseInt(args[4]);
				client.getRec(arg2,arg4,arg3);

			}
			else if(args[1] == "GUESS")
			{
				//input of type PING SUGGEST [id#] [foodName] [k]
				int arg2 = Integer.parseInt(args[2]);
				int arg4 = Integer.parseInt(args[4]);
				client.getReviewGuess(args[3], arg4, arg2);
			}
		}

		//Finally, serialize client
		saveClient(client);
	}
}
