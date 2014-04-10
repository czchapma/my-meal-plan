import java.util.*;
public class Knapsack
{
	public static void main(String[] args)
	{
		//get in in args[0] food1, price1,food2,price2....
		//TODO: parse so that you get String[] of food, and give that to foods.
		//TODO: parse and convert so that you get int[] of costs, and give to costs

		//args[1] has the max price;
		String[] foods = //fill me in //new String[10]; //fill me in actually though


		int numFoods = foods.length;
		int maxPrice = Integer.parseInt(args[1]);
		int[] values = new int[numFoods];
		int[] costs = //fill me in
		//foods[0] = "Chobani"; costs[0] = 280;
		//foods[1] = "Spicy"; costs[1] = 450;
		//foods[2] = "Apple"; costs[2] = 75;
		//foods[3] = "Banana"; costs[3] = 100;
		//foods[4] = "Odwalla"; costs[4] = 275;
		//foods[5] = "Salad"; costs[5] = 500;
		//foods[6] = "Drink?"; costs[6] = 150;
		//foods[7] = "Gnocchi"; costs[7] = 575;
		//foods[8] = "Cookie"; costs[8] = 65;
		//foods[9] = "orange"; costs[9] = 50;

		
		//to fill napsack as much as possible:
		values = costs;
		
		int[][] dpTable = new int[numFoods+1][maxPrice+1];

		for(int w = 0; w <= maxPrice; w ++)
			dpTable[0][w] = 0;

		for(int i = 1; i <= numFoods; i++)
		{
			dpTable[i][0] = 0;
			for(int w = 1; w <= maxPrice; w++)
			{
				if(costs[i-1] <= w)
				{
					if(values[i-1] + dpTable[i-1][w - costs[i-1]] > dpTable[i-1][w])
					{
						dpTable[i][w] = values[i-1] + dpTable[i-1][w - costs[i-1]];
					}
					else
					{
						dpTable[i][w] = dpTable[i-1][w];
					}

				}
				else
				{
					dpTable[i][w] = dpTable[i-1][w];
				}
			}
		}

		int backw = maxPrice;
		int backi = numFoods;
		ArrayList<String> foodInclude = new ArrayList<String>();
		while(backi != 0)
		{
			if(dpTable[backi][backw] == dpTable[backi-1][backw])
			{
				backi--;
			}
			else
			{
				foodInclude.add(foods[backi-1]);
				backi--;
				backw-=costs[backi];
			}
		}

		for(String s : foodInclude)
		{
			System.out.println(s);
		}
	}	
}
