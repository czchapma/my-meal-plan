import java.util.*;
public class ML_Client
{
	private HashMap<Integer, User_Reviews> users; // N users pointed to by their userId
	private HashMap<Integer, HashMap<Integer,Double>> dists; //distances hashmap. So the hashmap provides a hashmap of distances. as in user number 3 points to a map wherein each other user will then point to a double. essentially a matrix, but done this way in case id numbers arent sequential

	//eventually add a weights vector for age, gender etc.
	//also weights for each food (doing KNN right now, so don't need weights, but it makes sense that how much two people like milk is less important than say, if two people like a very random, specific flavor of yogurt)

	public ML_Client()
	{
		users = new HashMap<Integer,User_Reviews>();
		dists = new HashMap<Integer, HashMap<Integer,Double>>();
	}

	//TODO: make a constructor that can open a saved users array and a saved dists matrix
	public ML_Client(String fileNameUsers, String fileNameDists)
	{
		//TODO: fetch actual data from fileNameUsers, and fileNameDists
		users = new HashMap<Integer,User_Reviews>();
		dists = new HashMap<Integer, HashMap<Integer,Double>>();
	}

	//TODO: make a method that will save the current state of users and dists somehow to the given locations
	//returns true if successful, false otherwise
	public boolean saveState(String fileNameUsers, String fileNameDists)
	{
		//TODO: implement saving
		return false;
	}

	
	public void addUser(User_Reviews newUser)
	{
		if(users.containsKey(newUser.getUserId()))
		{
			System.out.println("Warning: users already contains this userId. Aborting.");
			return;
		}
		else
		{
			users.put(newUser.getUserId(),newUser); //add the new user to the map of users.
			updateDists(newUser);	
		}
			
	}

	private void updateDists(User_Reviews existentUser)
	{
		//TODO: Issue warning if user does not already exist in client
		HashMap<Integer, Double> newDist = new HashMap<Integer,Double>();
		for(User_Reviews user : users.values()) //now go through each user
		{
			newDist.put(user.getUserId(), user.diff(existentUser)); //add their dist to newUser to the newDist
			if(user.getUserId() != existentUser.getUserId())	
				dists.get(user.getUserId()).put(existentUser.getUserId(),user.diff(existentUser)); //and add the dist to the other user's dists.
			
		}
		dists.put(existentUser.getUserId(),newDist);//and add the newDist into dists.			

	}
	//TODO: test to make sure this works:  should go to the user in users indicated by the curId (j) and update the name
	public void updateUserName(int curId, String newName)
	{
		User_Reviews theUser = users.get(curId);
		if(theUser == null)
		{
			System.out.println("Warning: this update process attempted to a user who does not exist. Aborting. ");
			return;
		}
		theUser.setUserName(newName);
		users.put(curId,theUser);
		
	}

	//TODO: test to make sure this works:  should go to the user in users indicated by the curId (j) and update the genderId
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateIdentity(int curId, int genderId)
	{
		User_Reviews theUser = users.get(curId);
		if(theUser == null)
		{
			System.out.println("Warning: this update process attempted to a user who does not exist. Aborting. ");
			return;
		}
		
		theUser.setIdentity(genderId);
		users.put(curId,theUser);
		updateDists(theUser);
		
	}

	//TODO: test to make sure this works:  should go to the user in users indicated by the curId (j) and update the genderDescriptions
	public void updateIdDescription(int curId, String genderDescription)
	{
		User_Reviews theUser = users.get(curId);
		if(theUser == null)
		{
			System.out.println("Warning: this update process attempted to a user who does not exist. Aborting. ");
			return;
		}
		
		theUser.setIdDescription(genderDescription);
		users.put(curId,theUser);
		
	}

	//TODO: test to make sure this works:  should go to the user in users indicated by the curId (j) and update the birthYear
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateBirthYear(int curId, int birthYear)
	{
		User_Reviews theUser = users.get(curId);
		if(theUser == null)
		{
			System.out.println("Warning: this update process attempted to a user who does not exist. Aborting. ");
			return;
		}
		
		theUser.setBirthYear(birthYear);
		users.put(curId,theUser);
		updateDists(theUser);
		
	}

	//TODO: test to make sure this works:  should go to the user in users indicated by the curId (j) and update the birthMonth
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateBirthMonth(int curId, int birthMonth)
	{
		User_Reviews theUser = users.get(curId);
		if(theUser == null)
		{
			System.out.println("Warning: this update process attempted to a user who does not exist. Aborting. ");
			return;
		}
		
		theUser.setBirthMonth(birthMonth);
		users.put(curId,theUser);
		updateDists(theUser);
	}

	//TODO: test to make sure this works:  should go to the user in users indicated by the curId (j) and add the given review if it doesn't exist, or modify it if it does. A review value of -1 means the review should be removed. 
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateReview(int curId, String food, int review)
	{

		User_Reviews theUser = users.get(curId);
		if(theUser == null)
		{
			System.out.println("Warning: this update process attempted to a user who does not exist. Aborting. ");
			return;
		}
		
		theUser.addFood(food, review);
		users.put(curId,theUser);
		updateDists(theUser);
	}

	//TODO: Get the k nearest neighbors to user indicated by curId that have reviewed item food, then average or majority rule (we can decide this later) their reviews, and return this number. Return -1 if there are not enough neighbors who have reviewed item food. 
	public double getReviewGuess(String food, int k, int curId)
	{
		return -1;
	}
	
	//TODO: Look at the k nearest neighbors for foods the user of curId might like. Return the numWanted best foods. 
	public String[] getRec(int curId, int k, int numWanted)
	{
		String[] suggestions = new String[numWanted];
		return suggestions;
	}
	
	public String toString()
	{
		String output = "";
		for(User_Reviews user : users.values()) //now go through each user
		{
			output += user.getUserId();
			output += " is the following distance from each user id:\n";
			System.out.println(dists.keySet());
			for(Integer userId : dists.get(user.getUserId()).keySet())
			{
				output += userId;
				output += " Is this distance away: ";
				output += dists.get(user.getUserId()).get(userId);
				output += '\n';
			}
		}
		return output;
	}	

}
		