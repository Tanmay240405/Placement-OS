export const LEETCODE_TOPIC_MAPPING: Record<string, string> = {
  'array': 'Arrays',
  'string': 'Strings',
  'hash-table': 'Hashing',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'prefix-sum': 'Prefix Sum',
  'binary-search': 'Binary Search',
  'sorting': 'Sorting',
  'linked-list': 'Linked Lists',
  'stack': 'Stack',
  'queue': 'Queue / Deque',
  'deque': 'Queue / Deque',
  'recursion': 'Recursion',
  'backtracking': 'Backtracking',
  'tree': 'Trees',
  'binary-tree': 'Trees',
  'binary-search-tree': 'Trees',
  'heap-priority-queue': 'Heaps / Priority Queue',
  'graph': 'Graphs',
  'greedy': 'Greedy',
  'dynamic-programming': 'Dynamic Programming',
  'trie': 'Tries',
  'bit-manipulation': 'Bit Manipulation',
  'math': 'Math / Number Theory',
  'number-theory': 'Math / Number Theory',
  'combinatorics': 'Math / Number Theory',
  'geometry': 'Math / Number Theory',
};

// Returns the major category for a given LeetCode tag slug, or 'Other' if not mapped.
export function getMajorCategory(tagSlug: string): string {
  return LEETCODE_TOPIC_MAPPING[tagSlug] || 'Other';
}
