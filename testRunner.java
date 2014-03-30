public class testRunner
{
	public static void main(String[] args)
	{
		User_Reviews test = new User_Reviews("234,Steven,0,,1992,3,Sandwich,3,Falafel,3,Milk,4,Something,1");
		System.out.println("Test 1 :" + doubEquals(test.diff(test),0)); //should be 0 since they are the same person
		
		User_Reviews person1 = new User_Reviews("123,Steven,0,,1992,3,Sandwich,1,Falafel,3");
		System.out.println("Test 2: " + doubEquals(test.diff(person1),4.0)); 
			//should be 4 because the only diff is the review of sandwich (3-1)^2 = 4

		User_Reviews person2 = new User_Reviews("234,Steven,2,,1992,3,Sandwich,3,Falafel,3");
		System.out.println("Test 3: " + doubEquals(test.diff(person2),10.0)); 
			//should be (10 for gender) + 0 because all commonly reviewed items are ranked identically

		User_Reviews person3 = new User_Reviews("345,Something,0,,1992,3,Sandwich,2,Falafel,1,Milk,4");
		ML_Client client1 = new ML_Client();
		client1.addUser(person1);
		client1.addUser(person2);
		client1.addUser(person3);
		System.out.println(client1);

		client1.updateReview(234,"Chobani",2);
		client1.updateReview(345,"Chobani",5);
		//users 234 and 345 should now be farther away. 
		System.out.println(client1);
	}

	//double near equivalence test. Because sometimes rounding errors are sad. 
	private static boolean doubEquals(double a,double b)
	{
		double tol = .000000001;
		return (a - b) < tol;
	}
}
