import java.util.*;
public class testRunner
{
	public static void main(String[] args)
	{
		User_Reviews test = new User_Reviews("234,Steven,0,,1992,3,Milk,2");
		System.out.println("Test 1 :" + doubEquals(test.diff(test),0)); //should be 0 since they are the same person
		
		User_Reviews person1 = new User_Reviews("123,Zach,0,,1992,3,Milk,2");
		System.out.println("Test 2: " + doubEquals(test.diff(person1),4.0)); 
			//should be 4 because the only diff is the review of sandwich (3-1)^2 = 4

		User_Reviews person2 = new User_Reviews("234,Christine,1,,1992,3,Milk,5,Ice Cream,2");
		System.out.println("Test 3: " + doubEquals(test.diff(person2),10.0)); 
			//should be (10 for gender) + 0 because all commonly reviewed items are ranked identically

		User_Reviews person3 = new User_Reviews("345,Raymond,0,,1992,3,Milk,3,Ice Cream,2");

		ArrayList<String> foods = new ArrayList<String>();
		foods.add("Chobani");
		foods.add("Sandwich");
		foods.add("Falafel");
		foods.add("Ice Cream");
		foods.add("Milk");
		foods.add("Tuna");
		ML_Client client1 = new ML_Client(foods);
		client1.addUser(person1);
		client1.addUser(person2);
		client1.addUser(person3);
		System.out.println(client1);



		client1.updateReview(345,"Chobani",5);
		client1.updateReview(345,"Falafel",4);
		client1.updateReview(123,"Falafel",1);
		client1.updateReview(123,"Sandwich",2);
		client1.updateReview(234,"Tuna",1);
 
		System.out.println(client1);

		System.out.print("The guess for Falafel for user 234 is: ");
		System.out.println(client1.getReviewGuess("Falafel",1,234));

		System.out.print("Some recommendations for user 234 are: ");
		String[] recs = client1.getRec(234,1,2);
		for(String s : recs)
		{
			System.out.print(" " + s);
		}
	}

	//double near equivalence test. Because sometimes rounding errors are sad. 
	private static boolean doubEquals(double a,double b)
	{
		double tol = .000000001;
		return (a - b) < tol;
	}
}
