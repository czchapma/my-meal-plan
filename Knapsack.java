import java.util.*;

public class Knapsack {
	public static void main(String[] args) {
		// get in in args[0] food1, price1,food2,price2....

		String[] arr = args[0].split(",");

		int numFoods = arr.length / 2;
		String[] foods = new String[numFoods];
		int[] costs = new int[numFoods];
		int maxPrice = Integer.parseInt(args[1]);
		int[] values = new int[numFoods];
		int[] inds = new int[numFoods];
		for (int i = 0; i < numFoods; i++)
			inds[i] = i;

		// fisher-yates shuffle : source wikipedia
		for (int i = numFoods - 1; i > 0; i--) {
			int j = (int) Math.floor(Math.random() * (i + 1));
			int temp = inds[i];
			inds[i] = inds[j];
			inds[j] = temp;
		}
		for (int i = 0; i < numFoods; i++) {
			int idx = i * 2;
			if (!(arr[idx].equals("") || arr[idx + 1] == null)) {
				foods[inds[i]] = arr[idx];
				costs[inds[i]] = Integer.parseInt(arr[idx + 1]);
			}
		}

		// to fill knapsack as much as possible:
		values = costs;

		int[][] dpTable = new int[numFoods + 1][maxPrice + 1];

		for (int w = 0; w <= maxPrice; w++)
			dpTable[0][w] = 0;

		for (int i = 1; i <= numFoods; i++) {
			dpTable[i][0] = 0;
			for (int w = 1; w <= maxPrice; w++) {
				if (costs[i - 1] <= w) {
					if (values[i - 1] + dpTable[i - 1][w - costs[i - 1]] > dpTable[i - 1][w]) {
						dpTable[i][w] = values[i - 1]
								+ dpTable[i - 1][w - costs[i - 1]];
					} else {
						dpTable[i][w] = dpTable[i - 1][w];
					}

				} else {
					dpTable[i][w] = dpTable[i - 1][w];
				}
			}
		}

		int backw = maxPrice;
		int backi = numFoods;
		ArrayList<String> foodInclude = new ArrayList<String>();
		while (backi != 0) {
			if (dpTable[backi][backw] == dpTable[backi - 1][backw]) {
				backi--;
			} else {
				foodInclude.add(foods[backi - 1]);
				backi--;
				backw -= costs[backi];
			}
		}

		for (String s : foodInclude) {
			System.out.println(s);
		}
	}
}