import java.util.*;

public class User_Reviews {
	private int userId;
	private String userName;
	private int genderIdentity; //not a boolean because gender is a spectrum. 0 for male, 1 for female, 2 for other
	private String other; //if gender id is 0 or 1, this should be '', otherwise it has the individual's gender identity
	private int birthYear;  // -1 if not given
	private int birthMonth; // -1 if not given
	private HashMap<String,Integer> reviews; //Hash map of all items the user has reviewed.
	
	//default user constructor
	public User_Reviews(){
		userId = 0;
		userName = "";
		genderIdentity = 2;
		other = "";
		birthYear = -1;
		birthMonth = -1;
		reviews = new HashMap<String,Integer>();
	}
	
	//user constructor with a CSV containing all the data (probably the easiest input from node)
	public User_Reviews(String myCSV)
	{
		String buffer = myCSV; //stick the csv into a buffer
		String prevOutput;
		String curOutput = "";
		int nextComma;
		int whichField = 0;//keep track of what fields we have filled already
		boolean isKey = true; //to alternate between values and keys once we get there
		reviews = new HashMap<String,Integer>();
		while(!buffer.equals("")) //until there is nothing left in the buffer
		{
			nextComma = buffer.indexOf(','); //find the next comma
			prevOutput = curOutput; //save the previous word
			if(nextComma != -1)
			{
				curOutput = buffer.substring(0,nextComma); //and take everything up to that comma
				buffer = buffer.substring(nextComma + 1); //leaving the rest of the string in buffer
			}
			else
			{
				curOutput = buffer;
				buffer = "";
			}
			//figure out which field to fill in, then do so
			if(whichField == 0)
			{
				userId = Integer.parseInt(curOutput);
			}
			else if(whichField == 1)
			{
				userName = curOutput;
			}
			else if(whichField == 2)
			{
				genderIdentity = Integer.parseInt(curOutput);
			}
			else if(whichField == 3)
			{
				other = curOutput;
			}
			else if(whichField == 4)
			{
				birthYear = Integer.parseInt(curOutput);
			}
			else if(whichField == 5)
			{
				birthMonth = Integer.parseInt(curOutput);
			}
			else 
			{
				//alternate between keys and values, only filling when you have all the data
				if(isKey)
				{
					isKey = false;
				}
				else
				{
					reviews.put(prevOutput, Integer.parseInt(curOutput));
					isKey = true;
				}
			}
			whichField ++; //increment the field counter
		}
		System.out.println("User Id" + userId);
		System.out.println("Name" + userName);
		System.out.println("birth year" + birthYear);
	}
}
