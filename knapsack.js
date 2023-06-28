function knapsackWithItems(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const included = Array(n).fill(false);

  for (let i = 1; i <= n; i++) {
    const weight = weights[i - 1];
    const value = values[i - 1];

    for (let j = 1; j <= capacity; j++) {
      if (weight > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        const includeItemValue = value + dp[i - 1][j - weight];
        const excludeItemValue = dp[i - 1][j];
        dp[i][j] = Math.max(includeItemValue, excludeItemValue);
      }
    }
  }

  let i = n;
  let j = capacity;

  while (i > 0 && j > 0) {
    if (dp[i][j] !== dp[i - 1][j]) {
      included[i - 1] = true;
      j -= weights[i - 1];
    }
    i--;
  }

  const selectedItems = [];
  for (let k = 0; k < n; k++) {
    if (included[k]) {
      selectedItems.push(k);
    }
  }
    let selectedValues = [];
    for (let m = 0; m < selectedItems.length; m++) {
        selectedValues.push(values[m]);
    }
  return {
    maxValue: dp[n][capacity],
    selectedItems: selectedItems,
    selectedValues: selectedValues
  };
}

let dummyData = [
    {
        minutes: 5,
        points: 100,
        taskName: "Take out trash."
    },
    {
        minutes: 15,
        points: 200,
        taskName: "Do dishes."
    },
    {
        minutes: 600,
        points: 1000,
        taskName: "Read a book."
    },
    {
        minutes: 1,
        points: 50,
        taskName: "Check email."
    },
    {
        minutes: 60,
        points: 250,
        taskName: "Wash car."
    }
]

let minutes = [];
let points = [];

dummyData.forEach(item => {
  minutes.push(item.minutes);
  points.push(item.points);
});

const timeLimit = 60;

const result = knapsackWithItems(minutes, points, timeLimit);
console.log("Max Points Gained:", result.maxValue);
console.log("Selected Items:", result.selectedItems);
console.log("Selected Values:", result.selectedValues);
