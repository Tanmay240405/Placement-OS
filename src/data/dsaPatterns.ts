export interface Pattern {
  id: string;
  name: string;
  category: string;
}

export const DSA_PATTERNS: Pattern[] = [
  // FOUNDATIONAL
  { id: 'pat_1', name: 'Brute Force to Optimization', category: 'FOUNDATIONAL' },
  { id: 'pat_2', name: 'Frequency Counting', category: 'FOUNDATIONAL' },
  { id: 'pat_3', name: 'Hash Map / Hash Set', category: 'FOUNDATIONAL' },
  { id: 'pat_4', name: 'Sorting + Processing', category: 'FOUNDATIONAL' },
  { id: 'pat_5', name: 'Prefix Sum', category: 'FOUNDATIONAL' },
  { id: 'pat_6', name: 'Difference Array', category: 'FOUNDATIONAL' },

  // TWO POINTERS
  { id: 'pat_7', name: 'Opposite Direction Two Pointers', category: 'TWO POINTERS' },
  { id: 'pat_8', name: 'Same Direction Two Pointers', category: 'TWO POINTERS' },
  { id: 'pat_9', name: 'Fast and Slow Pointers', category: 'TWO POINTERS' },
  { id: 'pat_10', name: 'Partitioning', category: 'TWO POINTERS' },

  // SLIDING WINDOW
  { id: 'pat_11', name: 'Fixed Size Window', category: 'SLIDING WINDOW' },
  { id: 'pat_12', name: 'Variable Size Window', category: 'SLIDING WINDOW' },
  { id: 'pat_13', name: 'Longest Window', category: 'SLIDING WINDOW' },
  { id: 'pat_14', name: 'Minimum Window', category: 'SLIDING WINDOW' },
  { id: 'pat_15', name: 'Frequency-based Window', category: 'SLIDING WINDOW' },

  // BINARY SEARCH
  { id: 'pat_16', name: 'Classic Binary Search', category: 'BINARY SEARCH' },
  { id: 'pat_17', name: 'First / Last Occurrence', category: 'BINARY SEARCH' },
  { id: 'pat_18', name: 'Lower / Upper Bound', category: 'BINARY SEARCH' },
  { id: 'pat_19', name: 'Search in Rotated Array', category: 'BINARY SEARCH' },
  { id: 'pat_20', name: 'Binary Search on Answer', category: 'BINARY SEARCH' },
  { id: 'pat_21', name: 'Binary Search on Monotonic Function', category: 'BINARY SEARCH' },

  // LINKED LIST
  { id: 'pat_22', name: 'Fast & Slow Pointer', category: 'LINKED LIST' },
  { id: 'pat_23', name: 'Linked List Reversal', category: 'LINKED LIST' },
  { id: 'pat_24', name: 'Merge Linked Lists', category: 'LINKED LIST' },
  { id: 'pat_25', name: 'Dummy Node', category: 'LINKED LIST' },
  { id: 'pat_26', name: 'Cycle Detection', category: 'LINKED LIST' },

  // STACK
  { id: 'pat_27', name: 'Monotonic Increasing Stack', category: 'STACK' },
  { id: 'pat_28', name: 'Monotonic Decreasing Stack', category: 'STACK' },
  { id: 'pat_29', name: 'Next Greater Element', category: 'STACK' },
  { id: 'pat_30', name: 'Next Smaller Element', category: 'STACK' },
  { id: 'pat_31', name: 'Parentheses Matching', category: 'STACK' },
  { id: 'pat_32', name: 'Expression Processing', category: 'STACK' },

  // QUEUE / DEQUE
  { id: 'pat_33', name: 'Monotonic Queue', category: 'QUEUE / DEQUE' },
  { id: 'pat_34', name: 'BFS Queue', category: 'QUEUE / DEQUE' },
  { id: 'pat_35', name: 'Sliding Window Maximum', category: 'QUEUE / DEQUE' },

  // TREES
  { id: 'pat_36', name: 'Tree DFS', category: 'TREES' },
  { id: 'pat_37', name: 'Tree BFS', category: 'TREES' },
  { id: 'pat_38', name: 'Recursive Tree Problems', category: 'TREES' },
  { id: 'pat_39', name: 'Path-based Problems', category: 'TREES' },
  { id: 'pat_40', name: 'Subtree Problems', category: 'TREES' },
  { id: 'pat_41', name: 'Lowest Common Ancestor', category: 'TREES' },
  { id: 'pat_42', name: 'Tree Construction', category: 'TREES' },

  // GRAPHS
  { id: 'pat_43', name: 'Graph BFS', category: 'GRAPHS' },
  { id: 'pat_44', name: 'Graph DFS', category: 'GRAPHS' },
  { id: 'pat_45', name: 'Connected Components', category: 'GRAPHS' },
  { id: 'pat_46', name: 'Cycle Detection', category: 'GRAPHS' },
  { id: 'pat_47', name: 'Topological Sorting', category: 'GRAPHS' },
  { id: 'pat_48', name: 'Shortest Path', category: 'GRAPHS' },
  { id: 'pat_49', name: 'Dijkstra', category: 'GRAPHS' },
  { id: 'pat_50', name: 'Bellman-Ford', category: 'GRAPHS' },
  { id: 'pat_51', name: 'Minimum Spanning Tree', category: 'GRAPHS' },
  { id: 'pat_52', name: 'Union Find / DSU', category: 'GRAPHS' },
  { id: 'pat_53', name: 'Multi-source BFS', category: 'GRAPHS' },
  { id: 'pat_54', name: 'Grid Traversal', category: 'GRAPHS' },

  // BACKTRACKING
  { id: 'pat_55', name: 'Decision Tree', category: 'BACKTRACKING' },
  { id: 'pat_56', name: 'Choose / Explore / Unchoose', category: 'BACKTRACKING' },
  { id: 'pat_57', name: 'Subsets', category: 'BACKTRACKING' },
  { id: 'pat_58', name: 'Permutations', category: 'BACKTRACKING' },
  { id: 'pat_59', name: 'Combinations', category: 'BACKTRACKING' },
  { id: 'pat_60', name: 'Constraint Satisfaction', category: 'BACKTRACKING' },
  { id: 'pat_61', name: 'Grid Backtracking', category: 'BACKTRACKING' },
  { id: 'pat_62', name: 'Pruning', category: 'BACKTRACKING' },

  // GREEDY
  { id: 'pat_63', name: 'Sorting by Criteria', category: 'GREEDY' },
  { id: 'pat_64', name: 'Interval Scheduling', category: 'GREEDY' },
  { id: 'pat_65', name: 'Greedy Choice', category: 'GREEDY' },
  { id: 'pat_66', name: 'Jump / Reachability', category: 'GREEDY' },
  { id: 'pat_67', name: 'Resource Allocation', category: 'GREEDY' },

  // INTERVALS
  { id: 'pat_68', name: 'Merge Intervals', category: 'INTERVALS' },
  { id: 'pat_69', name: 'Insert Interval', category: 'INTERVALS' },
  { id: 'pat_70', name: 'Meeting Rooms', category: 'INTERVALS' },
  { id: 'pat_71', name: 'Interval Scheduling', category: 'INTERVALS' }, // Duplicate from Greedy, but fits here
  { id: 'pat_72', name: 'Sweep Line', category: 'INTERVALS' },

  // HEAPS
  { id: 'pat_73', name: 'Top K Elements', category: 'HEAPS' },
  { id: 'pat_74', name: 'Kth Largest / Smallest', category: 'HEAPS' },
  { id: 'pat_75', name: 'Two Heaps', category: 'HEAPS' },
  { id: 'pat_76', name: 'Merge K Sorted Structures', category: 'HEAPS' },
  { id: 'pat_77', name: 'Priority-based Processing', category: 'HEAPS' },

  // DYNAMIC PROGRAMMING
  { id: 'pat_78', name: '1D DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_79', name: '2D DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_80', name: 'Fibonacci Pattern', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_81', name: 'Take / Not Take', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_82', name: 'Knapsack', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_83', name: 'Subsequence DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_84', name: 'String DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_85', name: 'Grid DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_86', name: 'Partition DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_87', name: 'Interval DP', category: 'DYNAMIC PROGRAMMING' },
  { id: 'pat_88', name: 'State Machine DP Basics', category: 'DYNAMIC PROGRAMMING' },
];
