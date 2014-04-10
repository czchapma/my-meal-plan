import java.util.*;
public class Knapsack
{
	public static void main(String[] args)
	{
		String[] foods = new String[5]; //fill me in actually though
		int numFoods = foods.length;
		int maxPrice = 680;
		int[] values = new int[numFoods];
		int[] costs = new int[numFoods]; 
		
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
		while(backw != 0 || backi != 0)
		{
			if(dpTable[backi][backw] == dpTable[backi-1][backw])
			{
				backi--;
			}
			else
			{
				foodInclude.add(foods[backi-1]);
				backi--;
				backw-=costs[backi-1];
			}
		}

		for(String s : foodInclude)
		{
			System.out.println(s);
		}
	}	
}
