
java RunML ADD "234,Steven,MALE,,1992,3,Milk,2"
java RunML ADD "123,Zach,MALE,,1992,3,Milk,2"
java RunML ADD "245,Christine,FEMALE,,1992,3,Milk,5,Ice Cream,2"
java RunML ADD "345,Raymond,MALE,,1992,3,Milk,3,Ice Cream,2"
java RunML MODIFY REVIEW 345 Chobani 5
java RunML MODIFY REVIEW 123 Falafel 1
java RunML MODIFY REVIEW 123 Sandwich 2
java RunML MODIFY REVIEW 345 Falafel 4
java RunML MODIFY REVIEW 234 Tuna 1

echo "The guess for Falafel for user 234 is: "

java RunML PING GUESS 234 Falafel 1

echo "Some recommendations for user 234 are: "
java RunML PING SUGGEST 234 2 1

echo "Knapsack Guess"
java RunML PING KNAPSACKGUESS 245 1 Milk 234

echo "Printing client"
java RunML PRINT