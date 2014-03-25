public class testRunner
{
	public static void main(String[] args)
	{
		User_Reviews test = new User_Reviews("234,Steven,0,,1992,3,Sandwich,3,Falafel,3,Milk,4,Something,1");
		System.out.println(test.diff(test)); //should be 0 since they are the same person

	}
}
