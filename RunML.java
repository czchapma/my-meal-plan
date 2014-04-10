import java.util.*;
public class RunML
{
	public static void main(String[] args)
	{
		//input should be COMMAND [optional specifier] USER INPUT
		//
		ML_Client client = new ML_CLient() ; //TODO Load me from memory
		if(args[0] == "ADD")
		{
			//input of type ADD "[id#],[name],[GENDER],[desc],[year],[month],[food],[review],[food],[review]..."
			User_Reviews person = new User_Reviews(args[1]);
			client.addUser(person1);
		}
		else if(args[0] == "MODIFY")
		{
			if(args[1] == "NAME")
			{
				//input of type MODIFY NAME [id#] [newName]
				client.updateUserName(args[2],args[3]);
			}
			else if(args[1] == "GENDER")
			{
				//input of type MODIFY NAME [id#] [newGender]
				client.updateIdentity(args[2],args[3]);
			}
			else if(args[1] == "DESC")
			{
				client.updateIdDescription(args[2],args[3]);
				//input of type MODIFY NAME [id#] [newDesc]
			}
			else if(args[1] == "YEAR")
			{
				client.updateBirthYear(args[2],args[3]);
				//input of type MODIFY NAME [id#] [newYear]
			}
			else if(args[1] == "MONTH")
			{
				client.updateBirthMonth(args[2],args[3]);
				//input of type MODIFY NAME [id#] [newMonth]
			}
			else if(args[1] == "REVIEW")
			{
				client.updateReview(args[2],args[3],args[4]);
				//input of type MODIFY NAME [id#] [newFood] [newReview]
			}
		}
		else if(args[0] == "PING")
		{
			if(args[1] == "SUGGEST")
			{
				//input of type PING SUGGEST [id#] [numWant] [k (how many nearest neighbors you want)]
				client.getRec(args[2],args[4],args[3]);

			}
			else if(args[1] == "GUESS")
			{
				//input of type PING SUGGEST [id#] [foodName] [k]
				client.getReviewGuess(args[3], args[4], args[2]);
			}
		}
	}
}
