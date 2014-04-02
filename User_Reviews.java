import java.util.*;

public class User_Reviews {
	private int userId; //NOTE: UserIds should be COMPLETELY unique. In MySQL should do autoincrement thingy to ensure. start at 1 or 0, whichever that does, then increment by 1. This'll help with the distances matrix in ML_Client
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
	

	//TODO: Fix parsing here...csv parsing isn't working right
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
	}
	
	public HashMap<String,Integer> getReviews()
	{
		return reviews;
	}
	
	
	public int getUserId()
	{
		return userId;
	}
	public String getUserName()
	{
		return userName;
	}
	public int getIdentity()
	{
		return genderIdentity;
	}
	public String getIdDescription()
	{
		return other;
	}
	public int getBirthYear()
	{
		return birthYear;
	}
	public int getBirthMonth()
	{
		return birthMonth;
	}
	
	//NOTE: There is no userId mutator. Ids should NEVER be altered. 

	public void setUserName(String name)
	{
		userName = name;
	}
	public void setIdentity(int gender)
	{
		genderIdentity = gender;
	}
	public void setIdDescription(String identity)
	{
		other = identity;
	}
	public void setBirthYear(int year)
	{
		birthYear = year;
	}
	public void setBirthMonth(int month)
	{
		birthMonth = month;
	}

	public void addFood(String food, int review)
	{
		reviews.put(food,review);
	}

	public double diff(User_Reviews otherUser)
	{
		double diff = 0;
		if(otherUser.getIdentity() != genderIdentity)
			diff += 10;//later make this scalable so training phase can pick best parameter
		diff += Math.pow(((birthMonth/ 12.0 + birthYear)
			 - (otherUser.getBirthMonth()/ 12.0 + otherUser.getBirthYear())),2); //later add in scalable parameter for training phase
		Set<String> myreviewed = reviews.keySet();
		Set<String> theirReviewed = otherUser.getReviews().keySet();
		
		for(String s: myreviewed)
		{
			if(theirReviewed.contains(s))
			{
				diff += Math.pow((reviews.get(s) - otherUser.getReviews().get(s)),2);
			}
		}
		return diff;
	}

	public String toString()
	{

		String out = "";
		out+= userId;
		out+= ", ";
		out+= userName;
		out+= ", ";
		for(String food : reviews.keySet())
		{
			out += food + " " + reviews.get(food) + " ";
		}
		return out;
	}
}
