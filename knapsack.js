/* A Naive recursive implementation of
    0-1 Knapsack problem */

var knapsackTestData = [
    { priority: 100, minutes: 15 },
    { priority: 75, minutes: 20 },
    { priority: 50, minutes: 5 },
    { priority: 25, minutes: 5 },
    { priority: 12.5, minutes: 30 }
]
var knapsackData = [];
// A utility function that returns
// maximum of two integers
/* A Naive recursive implementation of
0-1 Knapsack problem */
    
// A utility function that returns
// maximum of two integers
function max(a, b)
{
        return (a > b) ? a : b;
}

// Returns the maximum value that can
// be put in a knapsack of capacity W
function knapSack(W, wt, val, n)
{

    // Base Case
    if (n == 0 || W == 0)
        return 0;

    // If weight of the nth item is
    // more than Knapsack capacity W,
    // then this item cannot be
    // included in the optimal solution
    if (wt[n - 1] > W)
        return knapSack(W, wt, val, n - 1);

    // Return the maximum of two cases:
    // (1) nth item included
    // (2) not included
    else
        return max(val[n - 1] +
        knapSack(W - wt[n - 1], wt, val, n - 1),
        knapSack(W, wt, val, n - 1));
}
    
let profit = [ 60, 100, 120 ];
let weight = [ 10, 20, 30 ];
let W = 50;
let n = profit.length;

console.log(knapSack(W, weight, profit, n));

console.log(knapsackData);