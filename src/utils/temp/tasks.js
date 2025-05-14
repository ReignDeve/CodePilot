export const tasks = [
  {
    status: 'Not Started',
    title: '1. For Loop with Arrays',
    difficulty: 'Easy',
    solution: 'Use a standard for loop to iterate and push items.',
    code: `public int[] IncrementArray(int[] nums) {
        // TODO: implement increment logic
    }`,
    description: `Given an array of numbers, return a new array where each element is incremented by 1.

    You may assume:
    - The input array nums contains at least one element.

    Example 1
    Input: nums = [1, 2, 3]
    Output: [2, 3, 4]

    Example 2
    Input: nums = [0, -1, -2]
    Output: [1, 0, -1]

    Example 3
    Input: nums = [5]
    Output: [6]

    Constraints:
    - 1 ≤ nums.length ≤ 10⁴
    - -10⁹ ≤ nums[i] ≤ 10⁹`
  },
  {
    status: 'In Progress',
    title: '2. Filter Array Elements',
    difficulty: 'Medium',
    solution: 'Use Array.filter() with a condition function.',
    code: `public int[] FilterArray(int[] nums, string criterion, int x = 0, int A = 0, int B = 0) {
        // TODO: implement filter logic based on criterion
    }`,
    description: `Given an array of integers nums and a filter criterion, return a new array containing only those elements that satisfy the criterion.

    You may assume:
    - The input array nums contains at least one element.
    - Exactly one of the following criteria is specified per call:
      1. "even" numbers
      2. Greater than a given value x
      3. Within an inclusive range [A, B]

    You must not modify the order of elements, and you may use each element only once.

    Example 1
    Input: nums = [3, 12, 7, 20, 5, 8, 33], criterion = "even"
    Output: [12, 20, 8]

    Example 2
    Input: nums = [3, 12, 7, 20, 5, 8, 33], criterion = "greater", x = 10
    Output: [12, 20, 33]

    Example 3
    Input: nums = [3, 12, 7, 20, 5, 8, 33], criterion = "range", A = 7, B = 20
    Output: [7, 12, 20, 8]

    Constraints:
    - 1 ≤ nums.length ≤ 10⁴
    - -10⁹ ≤ nums[i], x, A, B ≤ 10⁹`
  },
  {
    status: 'Completed',
    title: '3. Map Array to New Values',
    difficulty: 'Easy',
    solution: 'Use Array.map() to return transformed items.',
    code: `public string[] MapToUpper(string[] arr) {
        // TODO: implement mapping to uppercase
    }`,
    description: `Given an array of strings, return a new array where each string is converted to uppercase.

    You may assume:
    - The input array contains at least one string.

    Example 1
    Input: arr = ["hello", "world"]
    Output: ["HELLO", "WORLD"]

    Example 2
    Input: arr = ["Test", "Case"]
    Output: ["TEST", "CASE"]

    Example 3
    Input: arr = ["a", "b", "c"]
    Output: ["A", "B", "C"]

    Constraints:
    - 1 ≤ arr.length ≤ 10⁴
    - 1 ≤ arr[i].length ≤ 100`
  },
  {
    status: 'Not Started',
    title: '4. Reduce Array to Single Value',
    difficulty: 'Hard',
    solution: 'Use Array.reduce() with accumulator logic.',
    code: `public int SumArray(int[] nums) {
        // TODO: implement summation logic
    }`,
    description: `Given an array of numbers, return the sum of all elements using reduce.

    You may assume:
    - The input array contains at least one number.

    Example 1
    Input: nums = [5, 10, 15]
    Output: 30

    Example 2
    Input: nums = [1, 1, 1, 1]
    Output: 4

    Example 3
    Input: nums = [-5, 5]
    Output: 0

    Constraints:
    - 1 ≤ nums.length ≤ 10⁴
    - -10⁹ ≤ nums[i] ≤ 10⁹`
  },
  {
    status: 'In Progress',
    title: '5. Nested Loops for Matrix',
    difficulty: 'Medium',
    solution: 'Use two nested for loops to access matrix elements.',
    code: `public int[] FlattenMatrix(int[][] matrix) {
        // TODO: implement flatten logic
    }`,
    description: `Given a 2D array (matrix), return a flat array of all elements in row-major order using nested loops.

    You may assume:
    - The matrix contains at least one row.

    Example 1
    Input: matrix = [[1, 2], [3, 4]]
    Output: [1, 2, 3, 4]

    Example 2
    Input: matrix = [[5]]
    Output: [5]

    Example 3
    Input: matrix = [[1, 2, 3], [4, 5, 6]]
    Output: [1, 2, 3, 4, 5, 6]

    Constraints:
    - 1 ≤ matrix.length, matrix[i].length ≤ 10³
    - -10⁹ ≤ matrix[i][j] ≤ 10⁹`
  }
]
