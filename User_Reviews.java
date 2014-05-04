import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
public class User_Reviews implements Serializable {
		
	private int userId; //NOTE: UserIds should be COMPLETELY unique. In MySQL should do autoincrement thingy to ensure. start at 1 or 0, whichever that does, then increment by 1. This'll help with the distances matrix in ML_Client
	private String userName;
	private Gender genderIdentity; //Male, Female, or Other
	private String other; //if gender is Male or Female, this should be '', otherwise it has the individual's gender identity
	private int birthYear;  // -1 if not given
	private int birthMonth; // -1 if not given
	private Map<String,Integer> reviews; //Hash map of all items the user has reviewed.
	
	//default user constructor
	public User_Reviews(){
		userId = 0;
		userName = "";
		genderIdentity = Gender.OTHER;
		other = "";
		birthYear = -1;
		birthMonth = -1;
		reviews = new ConcurrentHashMap<String,Integer>();
	}
	

	//user constructor with a CSV row containing all the data (probably the easiest input from node)
	public User_Reviews(String myCSV)
	{
		System.out.println(myCSV);
		String[] vals = myCSV.split(","); //stick the csv into a buffer
		userId = Integer.parseInt(vals[0]);
		userName = vals[1];
		genderIdentity = Gender.fromString(vals[2]);
		other = vals[3];
		birthYear = Integer.parseInt(vals[4]);
		birthMonth = Integer.parseInt(vals[5]);
		reviews = new HashMap<String,Integer>();
		for (int i = 6; i < vals.length; i++)
		{
			reviews.put(vals[i], Integer.parseInt(vals[++i]));
		}
	}
	
	public Map<String,Integer> getReviews()
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
	public Gender getIdentity()
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
	public void setIdentity(Gender gender)
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

		//got rid of all other user criteria in dist except reviews
		/*if(otherUser.getIdentity() != genderIdentity)
			diff += 10;//later make this scalable so training phase can pick best parameter*/
		/*diff += Math.pow(((birthMonth/ 12.0 + birthYear)
			 - (otherUser.getBirthMonth()/ 12.0 + otherUser.getBirthYear())),2);*/ //later add in scalable parameter for training phase
		Set<String> myreviewed = reviews.keySet();
		Set<String> theirReviewed = otherUser.getReviews().keySet();
		
		for(String s: myreviewed)
		{
			if(theirReviewed.contains(s))
			{
				diff += Math.pow((reviews.get(s) - otherUser.getReviews().get(s)),2) - 1; //subtracting 1 so that people who have more reviews in common can be closer
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
	
	public static enum Gender {
		MALE, FEMALE, OTHER;
		public static Gender fromString(String type){
			if (type.equalsIgnoreCase("Male")){
				return MALE;
			} else if(type.equalsIgnoreCase("Female")){
				return FEMALE;
			} else{
				return OTHER;
			}
		}
	}
}
