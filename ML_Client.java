import java.util.*;
import java.io.Serializable;

public class ML_Client implements Serializable
{
	private HashMap<Integer, User_Reviews> users; // N users pointed to by their userId
	private HashMap<Integer, HashMap<Integer,Double>> dists; //distances hashmap. So the hashmap provides a hashmap of distances. as in user number 3 points to a map wherein each other user will then point to a double. essentially a matrix, but done this way in case id numbers arent sequential
	private ArrayList<String> foods; //The list of all foods in the universe.

	//helper class to fasciliate sorting 
	private static class Tupleish implements Comparable<Tupleish>
	{
		private Integer userId;
		private Double distance;
		
		
		public Tupleish(int id, double d)
		{
			userId = id;
			distance = d;
		}

		public Integer getId()
		{
			return userId;
		}
		
		public Double getDist()
		{
			return distance;
		}
		
		@Override 
		public int compareTo(Tupleish other)
		{
			return 0 - other.getDist().compareTo(distance);
		}
		
	} 

	//helper class to fasciliate sorting 
	private static class TupleFood implements Comparable<TupleFood>
	{
		private String food;
		private Double rating;
		
		
		public TupleFood(String f, double r)
		{
			food = f;
			rating = r;
		}

		public String getFood()
		{
			return food;
		}
		
		public Double getRating()
		{
			return rating;
		}
		
		@Override 
		public int compareTo(TupleFood other)
		{
			return other.getRating().compareTo(rating);
		}
		
	} 
	//eventually add a weights vector for age, gender etc.
	//also weights for each food (doing KNN right now, so don't need weights, but it makes sense that how much two people like milk is less important than say, if two people like a very random, specific flavor of yogurt)

	public ML_Client(ArrayList<String> f)
	{
		users = new HashMap<Integer,User_Reviews>();
		dists = new HashMap<Integer, HashMap<Integer,Double>>();
		foods = f;
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
	public void updateIdentity(int curId, User_Reviews.Gender genderId)
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
		users.remove(curId);
		users.put(curId,theUser);
		updateDists(theUser);
		System.out.println("updated id:" + curId + " food: " + food + " successfully!");
	}

	//TODO: Get the k nearest neighbors to user indicated by curId that have reviewed item food, then average or majority rule (we can decide this later) their reviews, and return this number. Return -1 if there are not enough neighbors who have reviewed item food. 
	public double getReviewGuess(String food, int k, int curId)
	{
		HashMap<Integer,Double> neighbors = dists.get(curId);
		ArrayList<Tupleish> allNeighbors = new ArrayList<Tupleish>();
		for(int otherId : neighbors.keySet())
		{
			Tupleish t = new Tupleish(otherId, neighbors.get(otherId));
			if(users.get(otherId).getReviews().keySet().contains(food)) //If the user reviewed item food. 
				allNeighbors.add(t);
		}

		if(allNeighbors.size() < k)
			return -1; //not enough neighbors reviewed it yet. 
		Collections.sort(allNeighbors);
		
 		double reviewCumul = 0;
		for(int i = 0; i < k; i++)
		{
			
			reviewCumul += users.get(allNeighbors.get(i).getId()).getReviews().get(food);
		}

		return reviewCumul / k;			
			
		
	}
	
	//TODO: Look at the k nearest neighbors for foods the user of curId might like. Return the numWanted best foods. 
	public String[] getRec(int curId, int k, int numWanted)
	{
		HashMap<Integer,Double> neighbors = dists.get(curId);
		ArrayList<Tupleish> allNeighbors = new ArrayList<Tupleish>();
		String[] suggestions = new String[numWanted];
		for(int otherId : neighbors.keySet())
		{
			Tupleish t = new Tupleish(otherId, neighbors.get(otherId));
			allNeighbors.add(t);
		}

		if(allNeighbors.size() < k)
			return suggestions; //not enough neighbors reviewed it yet. 
		Collections.sort(allNeighbors);
		
 		
		ArrayList<TupleFood> allFoods = new ArrayList<TupleFood>();
		for(String food: foods)
		{
			if(! users.get(curId).getReviews().keySet().contains(food)) //only suggest foods the user hasn't reviewed.
			{
				int count = 0;
				double reviewsCumul = 0;
				for(Tupleish t: allNeighbors)
				{
					int otherId = t.getId();
					if(users.get(otherId).getReviews().keySet().contains(food))
					{
						reviewsCumul += users.get(otherId).getReviews().get(food);
						count = count + 1;
					}
					if(count == k)
						break;
				}
				if(count == k) //if there were enough reviews
				{
					reviewsCumul /= k;
					TupleFood t = new TupleFood(food,reviewsCumul);
					allFoods.add(t);
				}
			}
		}
		
		Collections.sort(allFoods);	
		for(int i = 0; i < numWanted; i++)
		{
			if(i < allFoods.size())
			{
				suggestions[i] = allFoods.get(i).getFood();
			}
		}
		return suggestions;
	}
	
	public String toString()
	{
		String output = "";
		for(User_Reviews user : users.values()) //now go through each user
		{
			output += user.toString();
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
		
