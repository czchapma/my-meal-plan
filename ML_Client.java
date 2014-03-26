import java.util.*;
public class ML_Client
{
	private ArrayList<User_Reviews> users; // N users maintained sorted by id number ascending (0,1,2,3)
	private ArrayList<ArrayList<Double>> dists; //an N by N matrix, where (i,j) is the distance between users i and j, according to the dist function of User_Reviews. Inherently should be symmetric with zeros on the diagonal. 

	//eventually add a weights vector for age, gender etc.
	//also weights for each food (doing KNN right now, so don't need weights, but it makes sense that how much two people like milk is less important than say, if two people like a very random, specific flavor of yogurt)

	public ML_Client()
	{
		users = new ArrayList<User_Reviews>();
		dists = new ArrayList<ArrayList<Double>>();
	}

	//TODO: make a constructor that can open a saved users array and a saved dists matrix
	public ML_Client(String fileNameUsers, String fileNameDists)
	{
		//TODO: fetch actual data from fileNameUsers, and fileNameDists
		users = new ArrayList<User_Reviews>();
		dists = new ArrayList<ArrayList<Double>>();
	}

	//TODO: make a method that will save the current state of users and dists somehow to the given locations
	//returns true if successful, false otherwise
	public boolean saveState(String fileNameUsers, String fileNameDists)
	{
		//TODO: implement saving
		return false;
	}

	//TODO: add newUser into users, maintaining the sort by id number ascending. If id number already exists, should instead call updateUser, and issue a warning that the user already existed. 
	//Then update dists so that there is a new column and row for that user. 
	public void addUser(User_Reviews newUser)
	{
	}

	//TODO: should go to the user in users indicated by the curId (j) and update the name
	public void updateUserName(int curId, String newName)
	{
	}

	//TODO: should go to the user in users indicated by the curId (j) and update the genderId
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateGenderId(int curId, int genderId)
	{
	}

	//TODO: should go to the user in users indicated by the curId (j) and update the genderDescriptions
	public void updateGenderDescription(int curId, String genderDescription)
	{
	}

	//TODO: should go to the user in users indicated by the curId (j) and update the birthYear
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateBirthYear(int curId, int birthYear)
	{
	}

	//TODO: should go to the user in users indicated by the curId (j) and update the birthMonth
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateBirthMonth(int curId, int birthMonth)
	{
	}

	//TODO: should go to the user in users indicated by the curId (j) and add the given review if it doesn't exist, or modify it if it does. A review value of -1 means the review should be removed. 
	//Then update dists with this info. (Only need to look at jth row and col)
	public void updateReview(int curId, String food, int review)
	{
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
		

}
		
