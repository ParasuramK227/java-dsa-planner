-- DSA Planner curriculum seed: 20-week Java DSA roadmap.
-- Populates roadmap_weeks and roadmap_topics; safe to re-run via ON CONFLICT.

INSERT INTO roadmap_weeks (week_no, month_no, title, milestone) VALUES
  (1, 1, 'Complexity and Arrays', 'Independently solve basic and intermediate array and string problems.'),
  (2, 1, 'Strings and Hashing', 'Independently solve basic and intermediate array and string problems.'),
  (3, 1, 'Searching and Sorting', 'Independently solve basic and intermediate array and string problems.'),
  (4, 1, 'Array Problem-Solving Patterns', 'Independently solve basic and intermediate array and string problems.'),
  (5, 2, 'Recursion and Backtracking', 'Become comfortable with linear data structures and recursive problem-solving.'),
  (6, 2, 'Linked Lists', 'Become comfortable with linear data structures and recursive problem-solving.'),
  (7, 2, 'Stacks and Queues', 'Become comfortable with linear data structures and recursive problem-solving.'),
  (8, 2, 'Advanced Patterns', 'Become comfortable with linear data structures and recursive problem-solving.'),
  (9, 3, 'Binary Trees', 'Implement common tree and graph algorithms and solve related problems.'),
  (10, 3, 'Advanced Trees', 'Implement common tree and graph algorithms and solve related problems.'),
  (11, 3, 'Graph Fundamentals', 'Implement common tree and graph algorithms and solve related problems.'),
  (12, 3, 'Advanced Graphs', 'Implement common tree and graph algorithms and solve related problems.'),
  (13, 4, 'Greedy Algorithms', 'Understand common greedy and dynamic programming patterns.'),
  (14, 4, 'Dynamic Programming Fundamentals', 'Understand common greedy and dynamic programming patterns.'),
  (15, 4, 'Dynamic Programming Applications', 'Understand common greedy and dynamic programming patterns.'),
  (16, 4, 'Advanced DP and Bit Manipulation', 'Understand common greedy and dynamic programming patterns.'),
  (17, 5, 'Advanced Revision', 'Be prepared for common placement coding rounds and technical interviews.'),
  (18, 5, 'Complete DSA Revision', 'Be prepared for common placement coding rounds and technical interviews.'),
  (19, 5, 'Coding Assessments', 'Be prepared for common placement coding rounds and technical interviews.'),
  (20, 5, 'Final Preparation', 'Be prepared for common placement coding rounds and technical interviews.')
ON CONFLICT (week_no) DO NOTHING;

INSERT INTO roadmap_topics (id, week_no, order_index, name, description, objectives, subtopics, java_requirements, recommended_problems, related_problems) VALUES
  (
    'w1-time-complexity', 1, 1, 'Time Complexity',
    'Time complexity measures how an algorithm runtime grows with input size using asymptotic analysis.',
    '["Define time complexity in terms of input size n.","Derive the runtime of single and nested loops.","Recognize O(1), O(log n), O(n), O(n log n) and O(n^2) growth.","Compare two Java solutions and justify the faster one."]'::jsonb,
    '["Counting primitive operations","Single and nested loops","Asymptotic growth classes","Best case versus worst case","Scaling to large inputs"]'::jsonb,
    'Implement Java methods over int[] that count loop iterations to observe runtime growth empirically.',
    4,
    '[{"title":"Two Sum","platform":"leetcode","url":"https://leetcode.com/problems/two-sum/","difficulty":"easy"},{"title":"Binary Search","platform":"leetcode","url":"https://leetcode.com/problems/binary-search/","difficulty":"easy"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-space-complexity', 1, 2, 'Space Complexity',
    'Space complexity measures the additional memory an algorithm needs relative to its input size.',
    '["Distinguish input space from auxiliary space.","Calculate auxiliary space for arrays and recursion.","Identify O(1), O(n) and O(n^2) memory usage.","Refactor a Java solution to reduce allocated memory."]'::jsonb,
    '["Auxiliary versus total space","Primitive versus object overhead","Arrays and temporary buffers","Call stack memory","In-place algorithms"]'::jsonb,
    'Use int[] buffers and java.util.ArrayList in small Java examples to compare allocations, then rewrite them in place.',
    4,
    '[{"title":"Move Zeroes","platform":"leetcode","url":"https://leetcode.com/problems/move-zeroes/","difficulty":"easy"},{"title":"Contains Duplicate","platform":"leetcode","url":"https://leetcode.com/problems/contains-duplicate/","difficulty":"easy"},{"title":"Array Left Rotation","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/array-left-rotation/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-big-o-notation', 1, 3, 'Big O notation',
    'Big O notation gives an upper bound on growth rate by dropping constants and lower-order terms.',
    '["Simplify runtime expressions to their dominant term.","Explain why constants are ignored in Big O.","Read Big O bounds for common DSA operations.","Classify nested loops and library calls."]'::jsonb,
    '["Dropping constants","Dominant terms","Upper bounds","Common complexity classes","Comparing algorithmic bounds"]'::jsonb,
    'Write Java helpers that time array operations and record measured growth alongside their Big O classification.',
    4,
    '[{"title":"Binary Search","platform":"leetcode","url":"https://leetcode.com/problems/binary-search/","difficulty":"easy"},{"title":"Two Sum II - Input Array Is Sorted","platform":"leetcode","url":"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/","difficulty":"medium"},{"title":"Search Insert Position","platform":"leetcode","url":"https://leetcode.com/problems/search-insert-position/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-best-average-worst-cases', 1, 4, 'Best, average and worst cases',
    'Algorithms can have different runtimes for favorable, typical and adversarial inputs of the same size.',
    '["Describe best, average and worst case inputs for an algorithm.","Explain why worst case bounds are used for guarantees.","Analyze linear search across its three cases.","Analyze quicksort pivot choices by case."]'::jsonb,
    '["Best case input","Average case analysis","Worst case input","Adversarial examples","Quicksort pivot behavior"]'::jsonb,
    'Implement linear search over int[] and count comparisons for sorted, reversed and random inputs.',
    4,
    '[{"title":"Search Insert Position","platform":"leetcode","url":"https://leetcode.com/problems/search-insert-position/","difficulty":"easy"},{"title":"Kth Largest Element in an Array","platform":"leetcode","url":"https://leetcode.com/problems/kth-largest-element-in-an-array/","difficulty":"medium"},{"title":"First Unique Character in a String","platform":"leetcode","url":"https://leetcode.com/problems/first-unique-character-in-a-string/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-array-traversal', 1, 5, 'Array traversal',
    'Array traversal visits every element with an indexed or enhanced loop and underpins most array algorithms.',
    '["Traverse int[] with index-based and enhanced for loops.","Access elements safely within bounds.","Track running totals and indices during a pass.","Avoid off-by-one errors in traversal code."]'::jsonb,
    '["Indexed iteration","Enhanced for loop","Bounds checking","Forward and backward passes","Accumulators"]'::jsonb,
    'Write Java methods using int[] and enhanced for loops to compute sums, counts and index-based results.',
    3,
    '[{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"},{"title":"Find All Numbers Disappeared in an Array","platform":"leetcode","url":"https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/","difficulty":"easy"},{"title":"Third Maximum Number","platform":"leetcode","url":"https://leetcode.com/problems/third-maximum-number/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-minimum-and-maximum', 1, 6, 'Minimum and maximum',
    'Finding extrema requires a single pass that maintains the best candidate seen so far.',
    '["Implement min and max scans in O(n) time.","Initialize sentinels safely for arbitrary inputs.","Return both extrema in one pass.","Handle empty and single-element arrays."]'::jsonb,
    '["Sentinel initialization","Single-pass scan","Tracking indices","Empty input handling","Multiple extrema"]'::jsonb,
    'Implement static Java methods taking int[] that return extrema or their indices without extra collections.',
    3,
    '[{"title":"Maximum Product of Three Numbers","platform":"leetcode","url":"https://leetcode.com/problems/maximum-product-of-three-numbers/","difficulty":"medium"},{"title":"Largest Number At Least Twice of Others","platform":"leetcode","url":"https://leetcode.com/problems/largest-number-at-least-twice-of-others/","difficulty":"easy"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-second-largest-element', 1, 7, 'Second largest element',
    'The second largest element can be found by keeping the two best values during one traversal.',
    '["Track largest and second largest in one pass.","Handle duplicates and equal values correctly.","Return a sentinel when no second largest exists.","Explain why sorting is less efficient."]'::jsonb,
    '["Two-variable tracking","Duplicate handling","Sentinel return values","Single pass versus sorting","Edge cases"]'::jsonb,
    'Implement an int[] scan with two tracking variables and return Integer.MIN_VALUE when none exists.',
    3,
    '[{"title":"Third Maximum Number","platform":"leetcode","url":"https://leetcode.com/problems/third-maximum-number/","difficulty":"easy"},{"title":"Kth Largest Element in an Array","platform":"leetcode","url":"https://leetcode.com/problems/kth-largest-element-in-an-array/","difficulty":"medium"},{"title":"Second Minimum Node In a Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/second-minimum-node-in-a-binary-tree/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-array-reversal', 1, 8, 'Array reversal',
    'Reversal rearranges elements so the first becomes last, typically using two pointers in O(1) extra space.',
    '["Reverse int[] in place with two pointers.","Prove correctness for even and odd lengths.","Reverse subranges using start and end indices.","Compare in-place and copy-based reversal."]'::jsonb,
    '["Two-pointer swap","In-place algorithm","Even and odd lengths","Subarray reversal","Copy versus in place"]'::jsonb,
    'Write a Java method that swaps elements of int[] in place and a variant that reverses a specified range.',
    3,
    '[{"title":"Reverse String","platform":"leetcode","url":"https://leetcode.com/problems/reverse-string/","difficulty":"easy"},{"title":"Rotate Array","platform":"leetcode","url":"https://leetcode.com/problems/rotate-array/","difficulty":"medium"},{"title":"Array Left Rotation","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/array-left-rotation/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w1-basic-array-manipulation', 1, 9, 'Basic array manipulation',
    'Common manipulations include inserting, deleting, filtering and compacting elements while preserving order.',
    '["Remove duplicates from a sorted int[] in place.","Move zeroes to the end while keeping relative order.","Apply an arithmetic transformation to every element.","Return the new logical length after mutation."]'::jsonb,
    '["In-place compaction","Stable reordering","Write pointer technique","Logical length","Element transformation"]'::jsonb,
    'Implement Java methods that mutate int[] using a write index and return the resulting logical length.',
    4,
    '[{"title":"Remove Duplicates from Sorted Array","platform":"leetcode","url":"https://leetcode.com/problems/remove-duplicates-from-sorted-array/","difficulty":"easy"},{"title":"Move Zeroes","platform":"leetcode","url":"https://leetcode.com/problems/move-zeroes/","difficulty":"easy"},{"title":"Plus One","platform":"leetcode","url":"https://leetcode.com/problems/plus-one/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w2-strings', 2, 1, 'Strings',
    'Strings in Java are immutable UTF-16 sequences, so algorithms must account for character access and object creation.',
    '["Use charAt and length to inspect strings.","Compare strings with equals rather than reference equality.","Explain immutability and its cost in loops.","Process ASCII characters with simple loops."]'::jsonb,
    '["Immutability","charAt and length","String equality","Character codes","Iteration over characters"]'::jsonb,
    'Write Java methods using String, charAt and toCharArray to analyze and transform character sequences.',
    4,
    '[{"title":"Length of Last Word","platform":"leetcode","url":"https://leetcode.com/problems/length-of-last-word/","difficulty":"easy"},{"title":"Valid Palindrome","platform":"leetcode","url":"https://leetcode.com/problems/valid-palindrome/","difficulty":"easy"},{"title":"Strong Password","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/strong-password/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w2-string-builder', 2, 2, 'StringBuilder',
    'StringBuilder provides a mutable character buffer that avoids creating many temporary String objects.',
    '["Build strings efficiently inside loops.","Use append, insert, delete and reverse correctly.","Choose StringBuilder over repeated concatenation.","Convert between StringBuilder and String."]'::jsonb,
    '["Mutable buffer","append and insert","reverse and delete","Capacity and performance","Conversion to String"]'::jsonb,
    'Implement Java transformations using StringBuilder and compare them with repeated String concatenation.',
    3,
    '[{"title":"Reverse String","platform":"leetcode","url":"https://leetcode.com/problems/reverse-string/","difficulty":"easy"},{"title":"Reverse Words in a String III","platform":"leetcode","url":"https://leetcode.com/problems/reverse-words-in-a-string-iii/","difficulty":"easy"},{"title":"Count and Say","platform":"leetcode","url":"https://leetcode.com/problems/count-and-say/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w2-character-frequency', 2, 3, 'Character frequency',
    'Character frequency counting maps each character to its occurrence count in linear time.',
    '["Build a frequency table for a string.","Use a fixed-size int[] for ASCII data.","Find the most frequent character.","Compare character counts between two strings."]'::jsonb,
    '["Fixed-size frequency arrays","Character to index mapping","Maximum frequency","Comparing frequency tables","Unicode considerations"]'::jsonb,
    'Implement frequency counting with int[] indexed by char and optionally with java.util.Map<Character,Integer>.',
    3,
    '[{"title":"First Unique Character in a String","platform":"leetcode","url":"https://leetcode.com/problems/first-unique-character-in-a-string/","difficulty":"easy"},{"title":"Top K Frequent Elements","platform":"leetcode","url":"https://leetcode.com/problems/top-k-frequent-elements/","difficulty":"medium"},{"title":"Funny String","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/funny-string/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w2-palindromes', 2, 4, 'Palindromes',
    'A palindrome reads the same forward and backward and is usually checked with two pointers from both ends.',
    '["Check palindromes using two pointers.","Ignore spaces, punctuation and case when required.","Validate integer palindromes without full conversion.","Find the longest palindromic substring."]'::jsonb,
    '["Two-pointer comparison","Ignoring non-alphanumeric characters","Case normalization","Numeric palindromes","Longest palindromic substring"]'::jsonb,
    'Implement isPalindrome with String and StringBuilder, plus a two-pointer version without extra allocation.',
    4,
    '[{"title":"Valid Palindrome","platform":"leetcode","url":"https://leetcode.com/problems/valid-palindrome/","difficulty":"easy"},{"title":"Palindrome Number","platform":"leetcode","url":"https://leetcode.com/problems/palindrome-number/","difficulty":"easy"},{"title":"Longest Palindromic Substring","platform":"leetcode","url":"https://leetcode.com/problems/longest-palindromic-substring/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w2-anagrams', 2, 5, 'Anagrams',
    'Anagrams contain the same characters with the same frequencies in a different order.',
    '["Compare two strings by sorted characters.","Compare two strings by frequency counts.","Group anagrams using canonical keys.","Find anagram windows inside a larger string."]'::jsonb,
    '["Sorted signature","Frequency vector","Canonical hash key","Grouping anagrams","Sliding window anagrams"]'::jsonb,
    'Use int[] frequency arrays and java.util.HashMap<String,List<String>> to detect and group anagrams.',
    4,
    '[{"title":"Valid Anagram","platform":"leetcode","url":"https://leetcode.com/problems/valid-anagram/","difficulty":"easy"},{"title":"Group Anagrams","platform":"leetcode","url":"https://leetcode.com/problems/group-anagrams/","difficulty":"medium"},{"title":"Find All Anagrams in a String","platform":"leetcode","url":"https://leetcode.com/problems/find-all-anagrams-in-a-string/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w2-hash-map', 2, 6, 'HashMap',
    'HashMap stores key-value pairs with average constant-time lookup and is central to frequency and pairing problems.',
    '["Insert, update and query entries with getOrDefault.","Handle missing keys safely.","Count frequencies with Map<Integer,Integer>.","Explain hashing, collisions and average complexity."]'::jsonb,
    '["Hashing and buckets","put, get and getOrDefault","containsKey checks","Collision handling","Iteration over entries"]'::jsonb,
    'Implement solutions with java.util.HashMap, using getOrDefault and map entries to build frequency tables.',
    5,
    '[{"title":"Two Sum","platform":"leetcode","url":"https://leetcode.com/problems/two-sum/","difficulty":"easy"},{"title":"Group Anagrams","platform":"leetcode","url":"https://leetcode.com/problems/group-anagrams/","difficulty":"medium"},{"title":"Top K Frequent Elements","platform":"leetcode","url":"https://leetcode.com/problems/top-k-frequent-elements/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w2-hash-set', 2, 7, 'HashSet',
    'HashSet stores unique elements with average constant-time membership tests and is ideal for duplicate detection.',
    '["Detect duplicates using the return value of add.","Use contains for membership tests.","Compute set union, intersection and difference.","Explain why HashSet rejects duplicates."]'::jsonb,
    '["Uniqueness guarantee","add and contains","Set operations","Hashing internals","When to prefer HashSet"]'::jsonb,
    'Use java.util.HashSet<T> and generics to remove duplicates and compute intersections of collections.',
    4,
    '[{"title":"Contains Duplicate","platform":"leetcode","url":"https://leetcode.com/problems/contains-duplicate/","difficulty":"easy"},{"title":"Single Number","platform":"leetcode","url":"https://leetcode.com/problems/single-number/","difficulty":"easy"},{"title":"Intersection of Two Arrays","platform":"leetcode","url":"https://leetcode.com/problems/intersection-of-two-arrays/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w2-frequency-counting', 2, 8, 'Frequency counting',
    'Frequency counting turns element occurrences into a compact map used for ranking, top-k and pattern matching.',
    '["Count occurrences in one pass.","Retrieve the k most frequent elements.","Reconstruct order from frequency data.","Choose array versus map for counting."]'::jsonb,
    '["One-pass counting","Top-k selection","Bucketing by frequency","Array versus map counters","Tie handling"]'::jsonb,
    'Implement counting with java.util.HashMap and with int[] where the domain is small, then bucket results.',
    4,
    '[{"title":"Top K Frequent Elements","platform":"leetcode","url":"https://leetcode.com/problems/top-k-frequent-elements/","difficulty":"medium"},{"title":"Most Common Word","platform":"leetcode","url":"https://leetcode.com/problems/most-common-word/","difficulty":"easy"},{"title":"Sort Characters By Frequency","platform":"leetcode","url":"https://leetcode.com/problems/sort-characters-by-frequency/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w3-linear-search', 3, 1, 'Linear Search',
    'Linear search checks elements sequentially until a target is found or the array ends, costing linear time.',
    '["Implement iterative linear search returning an index.","Return a sentinel when the target is absent.","Count comparisons for best and worst cases.","Recognize when linear search is appropriate."]'::jsonb,
    '["Sequential scan","Early termination","Sentinel result","Unsorted data","Comparison counting"]'::jsonb,
    'Write a generic Java linearSearch method over List<T> using equals for element comparisons.',
    3,
    '[{"title":"Search Insert Position","platform":"leetcode","url":"https://leetcode.com/problems/search-insert-position/","difficulty":"easy"},{"title":"Binary Search","platform":"neetcode","url":"https://neetcode.io/practice","difficulty":"easy"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w3-binary-search', 3, 2, 'Binary Search',
    'Binary search halves the search interval each step and runs in logarithmic time on sorted data.',
    '["Implement binary search with inclusive bounds.","Avoid integer overflow when computing mid.","Handle empty and single-element arrays.","Find first and last occurrences with variants."]'::jsonb,
    '["Sorted precondition","Low and high pointers","Midpoint calculation","Invariant maintenance","Boundary variants"]'::jsonb,
    'Implement iterative and recursive Java binary search over int[] using low + (high - low) / 2.',
    6,
    '[{"title":"Binary Search","platform":"leetcode","url":"https://leetcode.com/problems/binary-search/","difficulty":"easy"},{"title":"Search in Rotated Sorted Array","platform":"leetcode","url":"https://leetcode.com/problems/search-in-rotated-sorted-array/","difficulty":"medium"},{"title":"Find Peak Element","platform":"leetcode","url":"https://leetcode.com/problems/find-peak-element/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w3-binary-search-on-answer', 3, 3, 'Binary Search on Answer',
    'Binary search on answer searches the value space for the smallest feasible or largest valid result.',
    '["Define a monotonic feasibility predicate.","Search the answer range instead of indices.","Prove monotonicity before applying the technique.","Return the minimal feasible value."]'::jsonb,
    '["Monotonic predicate","Feasibility check","Value-space bounds","Minimal feasible answer","Common templates"]'::jsonb,
    'Implement a Java helper with a boolean canAchieve(int value) predicate and binary search over integer bounds.',
    4,
    '[{"title":"Find the Smallest Divisor Given a Threshold","platform":"leetcode","url":"https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/","difficulty":"medium"},{"title":"Magnetic Force Between Two Balls","platform":"leetcode","url":"https://leetcode.com/problems/magnetic-force-between-two-balls/","difficulty":"medium"},{"title":"Capacity To Ship Packages Within D Days","platform":"leetcode","url":"https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w3-bubble-sort', 3, 4, 'Bubble Sort',
    'Bubble sort repeatedly swaps adjacent out-of-order elements, growing a sorted suffix one position per pass.',
    '["Implement bubble sort with adjacent swaps.","Add an early-exit flag for already sorted data.","Count comparisons and swaps.","Explain quadratic worst case and linear best case."]'::jsonb,
    '["Adjacent swaps","Pass structure","Early termination","Stable sorting","Quadratic cost"]'::jsonb,
    'Write a Java sort method for int[] using nested loops, a swapped flag and a helper to swap values.',
    3,
    '[{"title":"Sort Array By Parity","platform":"leetcode","url":"https://leetcode.com/problems/sort-array-by-parity/","difficulty":"easy"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"},{"title":"Sort Colors","platform":"leetcode","url":"https://leetcode.com/problems/sort-colors/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w3-selection-sort', 3, 5, 'Selection Sort',
    'Selection sort repeatedly picks the smallest remaining element and swaps it into place using constant extra space.',
    '["Implement selection sort with a min-index scan.","Limit swaps to one per pass.","Compare swap counts with bubble sort.","Explain why selection sort is not stable by default."]'::jsonb,
    '["Minimum selection","Min index tracking","Swap count","In-place sorting","Stability considerations"]'::jsonb,
    'Implement Java selection sort over int[] using a running minimum index and a swap helper.',
    3,
    '[{"title":"Sort Colors","platform":"leetcode","url":"https://leetcode.com/problems/sort-colors/","difficulty":"medium"},{"title":"Largest Number","platform":"leetcode","url":"https://leetcode.com/problems/largest-number/","difficulty":"medium"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w3-insertion-sort', 3, 6, 'Insertion Sort',
    'Insertion sort builds a sorted prefix by shifting larger elements right to make room for each new value.',
    '["Implement insertion sort with shifting.","Recognize linear best case for nearly sorted data.","Explain stability and online behavior.","Sort a linked list with insertion sort."]'::jsonb,
    '["Sorted prefix","Shift versus swap","Insertion point","Nearly sorted input","Linked list variant"]'::jsonb,
    'Implement insertion sort on int[] and on a simple singly linked node class using Java references.',
    3,
    '[{"title":"Insertion Sort List","platform":"leetcode","url":"https://leetcode.com/problems/insertion-sort-list/","difficulty":"medium"},{"title":"Sort List","platform":"leetcode","url":"https://leetcode.com/problems/sort-list/","difficulty":"medium"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w3-merge-sort', 3, 7, 'Merge Sort',
    'Merge sort recursively splits the array and merges sorted halves in O(n log n) time with O(n) extra space.',
    '["Implement recursive split and merge.","Allocate a single auxiliary buffer.","Explain O(n log n) time and O(n) space.","Recognize merge sort stability."]'::jsonb,
    '["Divide and conquer","Recursive splitting","Two-finger merge","Auxiliary buffer","Stability"]'::jsonb,
    'Write Java merge sort for int[] using one shared temp array and a recursive helper with index ranges.',
    5,
    '[{"title":"Sort List","platform":"leetcode","url":"https://leetcode.com/problems/sort-list/","difficulty":"medium"},{"title":"Merge Sorted Array","platform":"leetcode","url":"https://leetcode.com/problems/merge-sorted-array/","difficulty":"easy"},{"title":"Merge Intervals","platform":"leetcode","url":"https://leetcode.com/problems/merge-intervals/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w3-quick-sort', 3, 8, 'Quick Sort',
    'Quick sort partitions around a pivot and recurses on the resulting subarrays, averaging O(n log n) time.',
    '["Implement Lomuto or Hoare partitioning.","Choose pivots to avoid worst-case imbalance.","Explain average and worst-case complexity.","Compare quick sort with merge sort trade-offs."]'::jsonb,
    '["Pivot selection","Partition scheme","Recursive subproblems","Worst-case degradation","In-place sorting"]'::jsonb,
    'Implement Java quickSort with a partition method over int[] and randomized pivot selection.',
    5,
    '[{"title":"Kth Largest Element in an Array","platform":"leetcode","url":"https://leetcode.com/problems/kth-largest-element-in-an-array/","difficulty":"medium"},{"title":"Top K Frequent Elements","platform":"leetcode","url":"https://leetcode.com/problems/top-k-frequent-elements/","difficulty":"medium"},{"title":"Sort Colors","platform":"leetcode","url":"https://leetcode.com/problems/sort-colors/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w4-two-pointers', 4, 1, 'Two Pointers',
    'The two-pointer technique uses two indices that move toward or past each other to solve array problems efficiently.',
    '["Apply converging pointers on sorted arrays.","Use fast and slow pointers for in-place compaction.","Prove why each pointer step is safe.","Solve pair-sum problems in linear time."]'::jsonb,
    '["Converging pointers","Fast and slow pointers","Sorted precondition","Pair search","In-place compaction"]'::jsonb,
    'Implement Java methods with low and high indices over int[] to find pairs and compact values.',
    5,
    '[{"title":"Two Sum II - Input Array Is Sorted","platform":"leetcode","url":"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/","difficulty":"medium"},{"title":"Valid Palindrome","platform":"leetcode","url":"https://leetcode.com/problems/valid-palindrome/","difficulty":"easy"},{"title":"3Sum","platform":"leetcode","url":"https://leetcode.com/problems/3sum/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w4-sliding-window', 4, 2, 'Sliding Window',
    'A sliding window maintains a contiguous range with left and right bounds and updates its state incrementally.',
    '["Maintain a window sum or count in constant time per move.","Shrink the left side until a constraint holds.","Expand the right side one element at a time.","Track maximum or minimum window length."]'::jsonb,
    '["Fixed versus variable window","Expand and shrink steps","Window invariant","Running aggregates","Common templates"]'::jsonb,
    'Implement Java sliding-window loops over int[] or String with running sums and character counts.',
    6,
    '[{"title":"Longest Substring Without Repeating Characters","platform":"leetcode","url":"https://leetcode.com/problems/longest-substring-without-repeating-characters/","difficulty":"medium"},{"title":"Best Time to Buy and Sell Stock","platform":"leetcode","url":"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/","difficulty":"easy"},{"title":"Minimum Size Subarray Sum","platform":"leetcode","url":"https://leetcode.com/problems/minimum-size-subarray-sum/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w4-prefix-sum', 4, 3, 'Prefix Sum',
    'A prefix sum array stores cumulative totals so any range sum is answered in constant time after linear preprocessing.',
    '["Build a prefix sum array from int[].","Answer range queries with prefix[r] - prefix[l-1].","Use prefix sums for equilibrium indices.","Extend the idea to two-dimensional grids."]'::jsonb,
    '["Cumulative totals","Range sum queries","Zero-based indexing","Subarray sums","2D prefix sums"]'::jsonb,
    'Build a long[] prefix array in Java and answer range queries with constant-time arithmetic.',
    4,
    '[{"title":"Range Sum Query - Immutable","platform":"leetcode","url":"https://leetcode.com/problems/range-sum-query-immutable/","difficulty":"easy"},{"title":"Subarray Sum Equals K","platform":"leetcode","url":"https://leetcode.com/problems/subarray-sum-equals-k/","difficulty":"medium"},{"title":"Product of Array Except Self","platform":"leetcode","url":"https://leetcode.com/problems/product-of-array-except-self/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w4-difference-arrays', 4, 4, 'Difference Arrays',
    'A difference array records range updates so applying all updates takes O(n + k) instead of O(n*k).',
    '["Build a difference array for range additions.","Apply k updates with two boundary changes.","Recover final values with a prefix pass.","Choose difference arrays over repeated loops."]'::jsonb,
    '["Range update encoding","Boundary increments","Prefix reconstruction","Batch updates","When to use"]'::jsonb,
    'Implement Java rangeAdd and build methods with long[] diff arrays and verify against naive updates.',
    3,
    '[{"title":"Corporate Flight Bookings","platform":"leetcode","url":"https://leetcode.com/problems/corporate-flight-bookings/","difficulty":"medium"},{"title":"Car Pooling","platform":"leetcode","url":"https://leetcode.com/problems/car-pooling/","difficulty":"medium"},{"title":"Range Sum Query 2D - Immutable","platform":"leetcode","url":"https://leetcode.com/problems/range-sum-query-2d-immutable/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w4-mixed-array-string-problems', 4, 5, 'Mixed array and string problems',
    'Combined array and string practice reinforces choosing the right pattern for unfamiliar problem statements.',
    '["Identify which pattern fits a new problem.","Combine hashing with two pointers.","Translate string inputs into arrays of counts.","Explain the complexity of the chosen approach."]'::jsonb,
    '["Pattern selection","Hash plus pointers","Frequency arrays","Transformation steps","Complexity justification"]'::jsonb,
    'Solve mixed Java exercises using int[], String, StringBuilder and java.util.HashMap in one method each.',
    5,
    '[{"title":"Group Anagrams","platform":"leetcode","url":"https://leetcode.com/problems/group-anagrams/","difficulty":"medium"},{"title":"Trapping Rain Water","platform":"leetcode","url":"https://leetcode.com/problems/trapping-rain-water/","difficulty":"hard"},{"title":"Container With Most Water","platform":"leetcode","url":"https://leetcode.com/problems/container-with-most-water/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w5-recursion-fundamentals', 5, 1, 'Recursion fundamentals',
    'Recursion solves a problem by having a method call itself on a smaller instance until a base case stops it.',
    '["Trace a recursive Java method step by step.","Identify the recursive case and base case.","Write a recursive solution for factorial and power.","Relate recursion depth to input size."]'::jsonb,
    '["Self-similar subproblems","Base case","Recursive case","Call chain","Depth"]'::jsonb,
    'Implement recursive Java methods for factorial and power with clear base cases and int or double returns.',
    4,
    '[{"title":"Pow(x, n)","platform":"leetcode","url":"https://leetcode.com/problems/powx-n/","difficulty":"medium"},{"title":"Reverse String","platform":"leetcode","url":"https://leetcode.com/problems/reverse-string/","difficulty":"easy"},{"title":"Merge Two Sorted Lists","platform":"leetcode","url":"https://leetcode.com/problems/merge-two-sorted-lists/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w5-base-cases', 5, 2, 'Base cases',
    'A base case is the smallest instance that returns directly, preventing infinite recursion.',
    '["Choose correct base conditions for numeric recursion.","Handle empty and single-node inputs.","Detect missing or unreachable base cases.","Verify termination for all inputs."]'::jsonb,
    '["Termination condition","Empty input","Single element","Infinite recursion risk","Validation"]'::jsonb,
    'Write Java recursive methods whose first statement checks the base case and returns directly.',
    4,
    '[{"title":"Fibonacci Number","platform":"leetcode","url":"https://leetcode.com/problems/fibonacci-number/","difficulty":"easy"},{"title":"Climbing Stairs","platform":"leetcode","url":"https://leetcode.com/problems/climbing-stairs/","difficulty":"easy"},{"title":"Pow(x, n)","platform":"leetcode","url":"https://leetcode.com/problems/powx-n/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w5-recursion-tree', 5, 3, 'Recursion tree',
    'A recursion tree visualizes repeated calls and helps compute how many subproblems an algorithm creates.',
    '["Draw recursion trees for small inputs.","Count nodes and depth of the tree.","Explain exponential blowup without memoization.","Relate tree shape to runtime."]'::jsonb,
    '["Call tree diagram","Branching factor","Tree depth","Repeated subproblems","Runtime from tree shape"]'::jsonb,
    'Instrument a recursive Java Fibonacci method with a call counter to observe tree growth.',
    4,
    '[{"title":"Fibonacci Number","platform":"leetcode","url":"https://leetcode.com/problems/fibonacci-number/","difficulty":"easy"},{"title":"Unique Paths","platform":"leetcode","url":"https://leetcode.com/problems/unique-paths/","difficulty":"medium"},{"title":"Generate Parentheses","platform":"leetcode","url":"https://leetcode.com/problems/generate-parentheses/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w5-recursion-stack', 5, 4, 'Recursion stack',
    'Each recursive call adds a frame to the call stack, so deep recursion can overflow Java stack memory.',
    '["Describe stack frame contents for a recursive call.","Predict maximum recursion depth.","Explain StackOverflowError causes.","Convert simple recursion to iteration."]'::jsonb,
    '["Call stack frames","Local state per call","Unwinding and returns","Stack overflow","Recursion versus iteration"]'::jsonb,
    'Implement recursive depth calculations with a depth parameter and rewrite a simple recursion as a loop.',
    3,
    '[{"title":"Maximum Depth of Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/maximum-depth-of-binary-tree/","difficulty":"easy"},{"title":"Invert Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/invert-binary-tree/","difficulty":"easy"},{"title":"Valid Parentheses","platform":"leetcode","url":"https://leetcode.com/problems/valid-parentheses/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w5-backtracking', 5, 5, 'Backtracking',
    'Backtracking builds candidate solutions step by step and abandons a branch as soon as it cannot succeed.',
    '["Implement choose-explore-undo templates.","Prune invalid branches early.","Generate all valid combinations.","Explain exponential output complexity."]'::jsonb,
    '["Choice and undo","Pruning","Partial solution","Depth-first exploration","Output size"]'::jsonb,
    'Implement backtracking in Java with mutable StringBuilder or List<Integer>, adding and removing choices.',
    5,
    '[{"title":"Generate Parentheses","platform":"leetcode","url":"https://leetcode.com/problems/generate-parentheses/","difficulty":"medium"},{"title":"Combination Sum","platform":"leetcode","url":"https://leetcode.com/problems/combination-sum/","difficulty":"medium"},{"title":"N-Queens","platform":"leetcode","url":"https://leetcode.com/problems/n-queens/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w5-subsets', 5, 6, 'Subsets',
    'Subset problems ask for all combinations of elements, typically generated by include or exclude decisions.',
    '["Generate all 2^n subsets recursively.","Handle duplicate inputs without duplicate results.","Use an index parameter to avoid repeats.","Iterate with bit masks as an alternative."]'::jsonb,
    '["Include/exclude recursion","Index progression","Duplicate handling","Power set size","Bit mask generation"]'::jsonb,
    'Implement Java subsets with a backtracking helper and List<List<Integer>>, sorting first to skip duplicates.',
    4,
    '[{"title":"Subsets","platform":"leetcode","url":"https://leetcode.com/problems/subsets/","difficulty":"medium"},{"title":"Subsets II","platform":"leetcode","url":"https://leetcode.com/problems/subsets-ii/","difficulty":"medium"},{"title":"Combination Sum","platform":"leetcode","url":"https://leetcode.com/problems/combination-sum/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w5-permutations', 5, 7, 'Permutations',
    'Permutations arrange all elements in every possible order using swaps or a used-array of choices.',
    '["Generate all n! permutations by swapping in place.","Track used elements to avoid repetition.","Skip duplicates for unique permutations.","Compute the next lexicographic permutation."]'::jsonb,
    '["In-place swapping","Used flags","Duplicate skipping","Factorial output size","Next permutation"]'::jsonb,
    'Implement Java permutations with int[] nums and a swap helper, plus a used boolean[] variant.',
    4,
    '[{"title":"Permutations","platform":"leetcode","url":"https://leetcode.com/problems/permutations/","difficulty":"medium"},{"title":"Permutations II","platform":"leetcode","url":"https://leetcode.com/problems/permutations-ii/","difficulty":"medium"},{"title":"Next Permutation","platform":"leetcode","url":"https://leetcode.com/problems/next-permutation/","difficulty":"medium"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO roadmap_topics (id, week_no, order_index, name, description, objectives, subtopics, java_requirements, recommended_problems, related_problems) VALUES
  (
    'w6-singly-linked-lists', 6, 1, 'Singly Linked Lists',
    'A singly linked list stores nodes with a value and a next reference, allowing constant-time insertion at a known node.',
    '["Define a generic Node<T> class with value and next fields.","Traverse a list and count nodes.","Insert at head, tail and a given position.","Delete a node using a previous pointer."]'::jsonb,
    '["Node structure","Head and tail pointers","Traversal","Insertion cases","Deletion cases"]'::jsonb,
    'Implement a generic singly linked list class in Java with Node<T>, add, remove and size methods.',
    4,
    '[{"title":"Reverse Linked List","platform":"leetcode","url":"https://leetcode.com/problems/reverse-linked-list/","difficulty":"easy"},{"title":"Merge Two Sorted Lists","platform":"leetcode","url":"https://leetcode.com/problems/merge-two-sorted-lists/","difficulty":"easy"},{"title":"Linked List Cycle","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w6-doubly-linked-lists', 6, 2, 'Doubly Linked Lists',
    'A doubly linked list keeps next and prev references so nodes can be traversed in both directions.',
    '["Implement a node with value, prev and next fields.","Insert and delete in O(1) given a node reference.","Traverse forward and backward.","Maintain head and tail invariants."]'::jsonb,
    '["Prev and next links","Head and tail sentinels","Bidirectional traversal","O(1) deletion","Invariant checks"]'::jsonb,
    'Write a Java doubly linked list with generics, sentinel nodes and addFirst/addLast/remove methods.',
    4,
    '[{"title":"Design Linked List","platform":"leetcode","url":"https://leetcode.com/problems/design-linked-list/","difficulty":"medium"},{"title":"Add Two Numbers","platform":"leetcode","url":"https://leetcode.com/problems/add-two-numbers/","difficulty":"medium"},{"title":"LRU Cache","platform":"leetcode","url":"https://leetcode.com/problems/lru-cache/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w6-circular-linked-lists', 6, 3, 'Circular Linked Lists',
    'In a circular linked list the last node points back to the head, which is useful for round-robin structures.',
    '["Build a circular list from an array.","Traverse exactly one full cycle.","Detect whether a list is circular.","Implement a circular queue with fixed capacity."]'::jsonb,
    '["Tail to head link","Cycle traversal","Termination condition","Circular queue","Round-robin style problems"]'::jsonb,
    'Implement a Java circular list using node references and a wrapper class similar to Design Circular Queue with generics.',
    3,
    '[{"title":"Linked List Cycle","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle/","difficulty":"easy"},{"title":"Linked List Cycle II","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle-ii/","difficulty":"medium"},{"title":"Design Circular Queue","platform":"leetcode","url":"https://leetcode.com/problems/design-circular-queue/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w6-reversal', 6, 4, 'Reversal',
    'Reversal rewires next pointers so a list reads backward, using three references in O(1) extra space.',
    '["Reverse a list iteratively with prev, curr and next.","Reverse a bounded sublist.","Reverse nodes in groups of k.","Prove pointer updates preserve all nodes."]'::jsonb,
    '["Three-pointer technique","Head update","Sublist reversal","Group reversal","Recursive reversal"]'::jsonb,
    'Implement Java methods reverse and reverseBetween on ListNode using only reference reassignment.',
    5,
    '[{"title":"Reverse Linked List","platform":"leetcode","url":"https://leetcode.com/problems/reverse-linked-list/","difficulty":"easy"},{"title":"Reverse Linked List II","platform":"leetcode","url":"https://leetcode.com/problems/reverse-linked-list-ii/","difficulty":"medium"},{"title":"Reverse Nodes in k-Group","platform":"leetcode","url":"https://leetcode.com/problems/reverse-nodes-in-k-group/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w6-cycle-detection', 6, 5, 'Cycle Detection',
    'Cycle detection determines whether a list contains a loop and can locate the cycle entry with fast and slow pointers.',
    '["Use Floyd fast and slow pointers to detect a cycle.","Explain why the pointers eventually meet.","Find the first node of the cycle.","Compute the cycle length."]'::jsonb,
    '["Floyd algorithm","Meeting point","Entry node derivation","Cycle length","Null checks"]'::jsonb,
    'Implement hasCycle and detectCycle in Java with ListNode references and careful null handling.',
    4,
    '[{"title":"Linked List Cycle","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle/","difficulty":"easy"},{"title":"Linked List Cycle II","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle-ii/","difficulty":"medium"},{"title":"Happy Number","platform":"leetcode","url":"https://leetcode.com/problems/happy-number/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w6-fast-and-slow-pointers', 6, 6, 'Fast and Slow Pointers',
    'Fast and slow pointers traverse at different speeds to find middles, cycles and offsets in linear time.',
    '["Find the middle of a list in one pass.","Remove the nth node from the end.","Detect cycles with different speeds.","Analyze why the speed difference works."]'::jsonb,
    '["Speed ratio","Middle finding","Nth from end","Cycle detection","Pointer invariants"]'::jsonb,
    'Implement Java helpers using two ListNode references advancing one and two steps per iteration.',
    4,
    '[{"title":"Middle of the Linked List","platform":"leetcode","url":"https://leetcode.com/problems/middle-of-the-linked-list/","difficulty":"easy"},{"title":"Linked List Cycle II","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle-ii/","difficulty":"medium"},{"title":"Remove Nth Node From End of List","platform":"leetcode","url":"https://leetcode.com/problems/remove-nth-node-from-end-of-list/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w7-stack-fundamentals', 7, 1, 'Stack fundamentals',
    'A stack is a last-in-first-out structure supporting push, pop and peek, all in constant time.',
    '["Implement push, pop, peek and isEmpty.","Trace stack state through a sequence of operations.","Explain LIFO ordering.","Detect underflow on pop."]'::jsonb,
    '["LIFO order","push and pop","peek","Underflow handling","Array-backed implementation"]'::jsonb,
    'Implement a Java stack with int[] or generics using an ArrayList and explicit size tracking.',
    4,
    '[{"title":"Valid Parentheses","platform":"leetcode","url":"https://leetcode.com/problems/valid-parentheses/","difficulty":"easy"},{"title":"Min Stack","platform":"leetcode","url":"https://leetcode.com/problems/min-stack/","difficulty":"easy"},{"title":"Evaluate Reverse Polish Notation","platform":"leetcode","url":"https://leetcode.com/problems/evaluate-reverse-polish-notation/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w7-queue-fundamentals', 7, 2, 'Queue fundamentals',
    'A queue is a first-in-first-out structure supporting enqueue and dequeue with constant-time operations.',
    '["Implement enqueue, dequeue and peek.","Explain FIFO ordering.","Avoid linear-time removal from an array front.","Trace queue state across operations."]'::jsonb,
    '["FIFO order","enqueue and dequeue","Front and rear indices","Circular buffering","Underflow handling"]'::jsonb,
    'Implement a Java queue with java.util.ArrayDeque and a second version using a circular int[] buffer.',
    4,
    '[{"title":"Implement Queue using Stacks","platform":"leetcode","url":"https://leetcode.com/problems/implement-queue-using-stacks/","difficulty":"easy"},{"title":"Number of Recent Calls","platform":"leetcode","url":"https://leetcode.com/problems/number-of-recent-calls/","difficulty":"easy"},{"title":"Design Circular Queue","platform":"leetcode","url":"https://leetcode.com/problems/design-circular-queue/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w7-deques', 7, 3, 'Deques',
    'A deque allows insertion and removal at both ends and generalizes stacks and queues.',
    '["Perform addFirst, addLast, removeFirst and removeLast.","Implement a deque with a circular buffer.","Use a deque for sliding window maxima.","Choose ArrayDeque over LinkedList in Java."]'::jsonb,
    '["Double-ended operations","Circular buffer resizing","ArrayDeque API","Sliding window usage","Stack and queue emulation"]'::jsonb,
    'Use java.util.ArrayDeque<T> and implement a simple generic circular-buffer deque with resizing.',
    4,
    '[{"title":"Sliding Window Maximum","platform":"leetcode","url":"https://leetcode.com/problems/sliding-window-maximum/","difficulty":"hard"},{"title":"Design Circular Deque","platform":"leetcode","url":"https://leetcode.com/problems/design-circular-deque/","difficulty":"medium"},{"title":"Moving Average from Data Stream","platform":"leetcode","url":"https://leetcode.com/problems/moving-average-from-data-stream/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w7-java-implementations', 7, 4, 'Java implementations',
    'Java provides ArrayDeque, Stack and LinkedList, and choosing the right implementation affects clarity and speed.',
    '["Use ArrayDeque<T> as the preferred stack and queue.","Build a stack from java.util.ArrayList<T>.","Implement a queue using two stacks.","Explain amortized O(1) behavior."]'::jsonb,
    '["java.util.ArrayDeque","java.util.Stack drawbacks","ArrayList backing store","Two-stack queue","Amortized analysis"]'::jsonb,
    'Implement MyStack and MyQueue classes in Java, one using ArrayDeque and one using two Deque instances.',
    4,
    '[{"title":"Min Stack","platform":"leetcode","url":"https://leetcode.com/problems/min-stack/","difficulty":"easy"},{"title":"Implement Stack using Queues","platform":"leetcode","url":"https://leetcode.com/problems/implement-stack-using-queues/","difficulty":"easy"},{"title":"Implement Queue using Stacks","platform":"leetcode","url":"https://leetcode.com/problems/implement-queue-using-stacks/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w7-common-stack-problems', 7, 5, 'Common stack problems',
    'Many problems become simple with a stack that tracks the next greater or smaller element.',
    '["Match brackets with a stack.","Compute next greater element indices.","Maintain a running minimum.","Solve histogram-style problems with index stacks."]'::jsonb,
    '["Bracket matching","Next greater element","Running minimum","Monotonic stack preview","Index-based stacks"]'::jsonb,
    'Implement Java solutions with Deque<Integer> storing indices rather than values where needed.',
    5,
    '[{"title":"Daily Temperatures","platform":"leetcode","url":"https://leetcode.com/problems/daily-temperatures/","difficulty":"medium"},{"title":"Largest Rectangle in Histogram","platform":"leetcode","url":"https://leetcode.com/problems/largest-rectangle-in-histogram/","difficulty":"hard"},{"title":"Valid Parentheses","platform":"leetcode","url":"https://leetcode.com/problems/valid-parentheses/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w7-common-queue-problems', 7, 6, 'Common queue problems',
    'Queues model level-order work, recent-event windows and breadth-first traversal tasks.',
    '["Process events in arrival order.","Maintain a sliding time window with a queue.","Generate binary numbers using a queue.","Use a queue for BFS-style expansion."]'::jsonb,
    '["Event ordering","Time-window pruning","Generating sequences","BFS foundation","ArrayDeque usage"]'::jsonb,
    'Implement Java event processing with ArrayDeque<int[]> pairs and remove expired entries from the front.',
    4,
    '[{"title":"First Unique Character in a String","platform":"leetcode","url":"https://leetcode.com/problems/first-unique-character-in-a-string/","difficulty":"easy"},{"title":"Number of Recent Calls","platform":"leetcode","url":"https://leetcode.com/problems/number-of-recent-calls/","difficulty":"easy"},{"title":"Sliding Window Maximum","platform":"leetcode","url":"https://leetcode.com/problems/sliding-window-maximum/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w8-advanced-sliding-window', 8, 1, 'Advanced Sliding Window',
    'Advanced sliding windows combine dynamic left and right movement with counts, hash maps or deques for harder constraints.',
    '["Track character counts while shrinking a window.","Handle at-most-k constraints.","Find the minimum window covering a target.","Maintain a window under multiple constraints."]'::jsonb,
    '["Count-based shrink","At-most-k patterns","Minimum window substring","Multiple constraints","Invariant restoration"]'::jsonb,
    'Implement Java solutions with int[] frequency arrays, HashMap<Character,Integer> and ArrayDeque where needed.',
    5,
    '[{"title":"Minimum Window Substring","platform":"leetcode","url":"https://leetcode.com/problems/minimum-window-substring/","difficulty":"hard"},{"title":"Longest Repeating Character Replacement","platform":"leetcode","url":"https://leetcode.com/problems/longest-repeating-character-replacement/","difficulty":"medium"},{"title":"Find All Anagrams in a String","platform":"leetcode","url":"https://leetcode.com/problems/find-all-anagrams-in-a-string/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w8-monotonic-stack', 8, 2, 'Monotonic Stack',
    'A monotonic stack keeps indices in increasing or decreasing value order so next greater or smaller elements are found in linear time.',
    '["Maintain an increasing or decreasing stack invariant.","Pop while the current value breaks the order.","Compute next greater and previous smaller elements.","Solve trapped-water style problems."]'::jsonb,
    '["Stack invariant","Pop-while loop","Next greater element","Previous smaller element","Trapping rain water"]'::jsonb,
    'Implement Java monotonic stack solutions with Deque<Integer> holding indices into int[].',
    5,
    '[{"title":"Daily Temperatures","platform":"leetcode","url":"https://leetcode.com/problems/daily-temperatures/","difficulty":"medium"},{"title":"Next Greater Element I","platform":"leetcode","url":"https://leetcode.com/problems/next-greater-element-i/","difficulty":"easy"},{"title":"Largest Rectangle in Histogram","platform":"leetcode","url":"https://leetcode.com/problems/largest-rectangle-in-histogram/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w8-monotonic-queue', 8, 3, 'Monotonic Queue',
    'A monotonic queue keeps candidates in decreasing order so the maximum of a moving window is available at the front.',
    '["Maintain a decreasing deque of indices.","Remove expired window elements from the front.","Return the window maximum in amortized constant time.","Contrast with a priority queue approach."]'::jsonb,
    '["Decreasing deque","Expiration handling","Amortized O(1)","Window maximum","Priority queue comparison"]'::jsonb,
    'Implement a Java monotonic queue with ArrayDeque<Integer> storing indices of int[] values.',
    3,
    '[{"title":"Sliding Window Maximum","platform":"leetcode","url":"https://leetcode.com/problems/sliding-window-maximum/","difficulty":"hard"},{"title":"Design Circular Deque","platform":"leetcode","url":"https://leetcode.com/problems/design-circular-deque/","difficulty":"medium"},{"title":"Shortest Subarray with Sum at Least K","platform":"leetcode","url":"https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w8-mixed-practice', 8, 4, 'Mixed practice',
    'Mixed practice combines two pointers, monotonic structures and hashing to build pattern-recognition skill.',
    '["Choose between two pointers and a monotonic stack.","Combine prefix data with a deque.","Explain complexity trade-offs before coding.","Solve unfamiliar problems within a time limit."]'::jsonb,
    '["Pattern recognition","Structure selection","Prefix plus deque","Trade-off analysis","Timed practice"]'::jsonb,
    'Write several Java solutions from scratch using int[], ArrayDeque<T> and java.util.HashMap.',
    5,
    '[{"title":"Trapping Rain Water","platform":"leetcode","url":"https://leetcode.com/problems/trapping-rain-water/","difficulty":"hard"},{"title":"Container With Most Water","platform":"leetcode","url":"https://leetcode.com/problems/container-with-most-water/","difficulty":"medium"},{"title":"Sum of Subarray Minimums","platform":"leetcode","url":"https://leetcode.com/problems/sum-of-subarray-minimums/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w9-binary-tree-fundamentals', 9, 1, 'Binary Tree fundamentals',
    'A binary tree node holds a value and up to two children, with recursive structure enabling most tree algorithms.',
    '["Define a Java TreeNode class with left and right fields.","Count nodes and compute depth recursively.","Distinguish root, leaf and internal nodes.","Explain complete versus full binary trees."]'::jsonb,
    '["TreeNode structure","Root and leaves","Depth and height terms","Full versus complete trees","Recursive shape"]'::jsonb,
    'Implement a generic Java TreeNode<T> and helper methods for counting nodes and computing depth.',
    4,
    '[{"title":"Maximum Depth of Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/maximum-depth-of-binary-tree/","difficulty":"easy"},{"title":"Invert Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/invert-binary-tree/","difficulty":"easy"},{"title":"Same Tree","platform":"leetcode","url":"https://leetcode.com/problems/same-tree/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w9-preorder', 9, 2, 'Preorder',
    'Preorder traversal visits root, then left subtree, then right subtree, which is useful for copying trees.',
    '["Implement recursive preorder traversal.","Implement iterative preorder with a stack.","Produce a serialized node order for a small tree.","Explain when preorder is the natural choice."]'::jsonb,
    '["Root-left-right order","Recursive implementation","Iterative stack version","Tree copying","Serialization use"]'::jsonb,
    'Write Java preorder helpers using List<Integer> output and Deque<TreeNode> for the iterative form.',
    4,
    '[{"title":"Binary Tree Preorder Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-preorder-traversal/","difficulty":"easy"},{"title":"Flatten Binary Tree to Linked List","platform":"leetcode","url":"https://leetcode.com/problems/flatten-binary-tree-to-linked-list/","difficulty":"medium"},{"title":"Validate Binary Search Tree","platform":"leetcode","url":"https://leetcode.com/problems/validate-binary-search-tree/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w9-inorder', 9, 3, 'Inorder',
    'Inorder traversal visits left subtree, root, then right subtree and yields sorted order for a valid BST.',
    '["Implement recursive inorder traversal.","Implement iterative inorder with a stack.","Use inorder order to validate a BST.","Find the kth smallest node in a BST."]'::jsonb,
    '["Left-root-right order","Recursive implementation","Iterative stack version","BST sorted property","Kth smallest element"]'::jsonb,
    'Implement Java inorder traversal with List<Integer> and a Deque<TreeNode> iterative loop.',
    4,
    '[{"title":"Binary Tree Inorder Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-inorder-traversal/","difficulty":"easy"},{"title":"Validate Binary Search Tree","platform":"leetcode","url":"https://leetcode.com/problems/validate-binary-search-tree/","difficulty":"medium"},{"title":"Kth Smallest Element in a BST","platform":"leetcode","url":"https://leetcode.com/problems/kth-smallest-element-in-a-bst/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w9-postorder', 9, 4, 'Postorder',
    'Postorder traversal visits left subtree, right subtree, then root, which is ideal for bottom-up computation.',
    '["Implement recursive postorder traversal.","Implement iterative postorder with one or two stacks.","Use postorder to compute tree height.","Rebuild a tree from inorder and postorder lists."]'::jsonb,
    '["Left-right-root order","Recursive implementation","Iterative variants","Bottom-up evaluation","Tree reconstruction"]'::jsonb,
    'Implement Java postorder traversal returning List<Integer> and a bottom-up height method on TreeNode.',
    4,
    '[{"title":"Binary Tree Postorder Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-postorder-traversal/","difficulty":"easy"},{"title":"Construct Binary Tree from Inorder and Postorder Traversal","platform":"leetcode","url":"https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/","difficulty":"medium"},{"title":"Sum of Left Leaves","platform":"leetcode","url":"https://leetcode.com/problems/sum-of-left-leaves/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w9-level-order-traversal', 9, 5, 'Level Order Traversal',
    'Level order traversal uses a queue to visit nodes breadth-first, one level at a time.',
    '["Implement BFS with ArrayDeque<TreeNode>.","Group results by level.","Handle null roots safely.","Produce zigzag order by reversing alternate levels."]'::jsonb,
    '["Breadth-first order","Queue driven traversal","Level grouping","Zigzag variant","Level averages"]'::jsonb,
    'Implement Java levelOrder with ArrayDeque<TreeNode> and List<List<Integer>> returning grouped levels.',
    4,
    '[{"title":"Binary Tree Level Order Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-level-order-traversal/","difficulty":"medium"},{"title":"Binary Tree Zigzag Level Order Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/","difficulty":"medium"},{"title":"Average of Levels in Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/average-of-levels-in-binary-tree/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w9-height', 9, 6, 'Height',
    'Tree height is the number of edges on the longest root-to-leaf path and is computed bottom-up with recursion.',
    '["Compute height with a recursive postorder pattern.","Distinguish height from depth.","Check whether a tree is balanced in one pass.","Handle empty trees consistently."]'::jsonb,
    '["Recursive height","Base case for null","Height versus depth","Balanced check","Single-pass optimization"]'::jsonb,
    'Implement Java height and isBalanced methods returning int and validating balance in one traversal.',
    4,
    '[{"title":"Maximum Depth of Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/maximum-depth-of-binary-tree/","difficulty":"easy"},{"title":"Balanced Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/balanced-binary-tree/","difficulty":"easy"},{"title":"Minimum Depth of Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/minimum-depth-of-binary-tree/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w9-diameter', 9, 7, 'Diameter',
    'The diameter of a binary tree is the longest path between any two nodes, computed from child heights at each node.',
    '["Define diameter in terms of left and right heights.","Compute diameter and height in one postorder pass.","Explain why diameter may not pass through the root.","Handle single-node and empty trees."]'::jsonb,
    '["Longest path definition","Left height plus right height","Global maximum tracking","Single DFS pass","Edge cases"]'::jsonb,
    'Implement a Java helper returning height while updating an int[] or field that stores the best diameter.',
    3,
    '[{"title":"Diameter of Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/diameter-of-binary-tree/","difficulty":"easy"},{"title":"Longest Univalue Path","platform":"leetcode","url":"https://leetcode.com/problems/longest-univalue-path/","difficulty":"easy"},{"title":"Maximum Depth of Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/maximum-depth-of-binary-tree/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w9-tree-recursion', 9, 8, 'Tree recursion',
    'Tree recursion applies the same operation to subtrees and combines their results at each node.',
    '["Write divide-and-conquer tree methods.","Combine left and right results correctly.","Check structural symmetry recursively.","Count nodes with pruning when possible."]'::jsonb,
    '["Recursive subtree calls","Result combination","Symmetry checks","Pruning","Complexity by node visits"]'::jsonb,
    'Implement Java recursive methods invertTree, isSymmetric and countNodes using TreeNode references.',
    4,
    '[{"title":"Invert Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/invert-binary-tree/","difficulty":"easy"},{"title":"Symmetric Tree","platform":"leetcode","url":"https://leetcode.com/problems/symmetric-tree/","difficulty":"easy"},{"title":"Count Complete Tree Nodes","platform":"leetcode","url":"https://leetcode.com/problems/count-complete-tree-nodes/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w10-binary-search-trees', 10, 1, 'Binary Search Trees',
    'A BST keeps left subtree keys smaller and right subtree keys larger than the node key, enabling ordered operations.',
    '["Validate BST ordering with bounded ranges.","Search for a key in O(h) time.","Insert a node while preserving order.","Delete nodes with zero, one or two children."]'::jsonb,
    '["Ordering invariant","Range-based validation","Search path","Insertion","Deletion cases"]'::jsonb,
    'Implement Java BST search, insert and validation methods using long bounds to avoid overflow.',
    5,
    '[{"title":"Validate Binary Search Tree","platform":"leetcode","url":"https://leetcode.com/problems/validate-binary-search-tree/","difficulty":"medium"},{"title":"Search in a Binary Search Tree","platform":"leetcode","url":"https://leetcode.com/problems/search-in-a-binary-search-tree/","difficulty":"easy"},{"title":"Delete Node in a BST","platform":"leetcode","url":"https://leetcode.com/problems/delete-node-in-a-bst/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w10-heaps', 10, 2, 'Heaps',
    'A binary heap is a complete tree that keeps the smallest or largest element at the root with logarithmic updates.',
    '["Map heap indices to parent and children.","Implement sift-up and sift-down.","Build a heap in linear time.","Explain min-heap versus max-heap use."]'::jsonb,
    '["Complete tree layout","Index arithmetic","Sift up and down","Heapify","Min versus max heap"]'::jsonb,
    'Implement a Java min-heap backed by ArrayList<Integer> with offer, poll and heapify operations.',
    4,
    '[{"title":"Kth Largest Element in an Array","platform":"leetcode","url":"https://leetcode.com/problems/kth-largest-element-in-an-array/","difficulty":"medium"},{"title":"Last Stone Weight","platform":"leetcode","url":"https://leetcode.com/problems/last-stone-weight/","difficulty":"easy"},{"title":"Find K Pairs with Smallest Sums","platform":"leetcode","url":"https://leetcode.com/problems/find-k-pairs-with-smallest-sums/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w10-priorityqueue-in-java', 10, 3, 'PriorityQueue in Java',
    'java.util.PriorityQueue is a min-heap by default and can be customized with a Comparator for top-k problems.',
    '["Use PriorityQueue<Integer> and custom Comparator<T>.","Maintain a heap of fixed size k.","Store arrays or records as queue elements.","Explain logarithmic offer and poll costs."]'::jsonb,
    '["Default min-heap","Comparator and reverse order","Fixed-size k heap","Composite elements","Complexity of operations"]'::jsonb,
    'Implement Java solutions with PriorityQueue<int[]> and record-based entries using Comparator.comparingInt.',
    5,
    '[{"title":"Merge K Sorted Lists","platform":"leetcode","url":"https://leetcode.com/problems/merge-k-sorted-lists/","difficulty":"hard"},{"title":"Top K Frequent Elements","platform":"leetcode","url":"https://leetcode.com/problems/top-k-frequent-elements/","difficulty":"medium"},{"title":"Task Scheduler","platform":"leetcode","url":"https://leetcode.com/problems/task-scheduler/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w10-tries', 10, 4, 'Tries',
    'A trie stores strings as paths of characters, making prefix searches efficient.',
    '["Build a trie with child arrays or maps.","Insert words and mark terminal nodes.","Search exact words and prefixes.","Implement wildcard search with backtracking."]'::jsonb,
    '["Trie node structure","Insert operation","Prefix lookup","Terminal markers","Wildcard search"]'::jsonb,
    'Implement a Java TrieNode with TrieNode[] children or Map<Character,TrieNode> and insert/search methods.',
    4,
    '[{"title":"Implement Trie (Prefix Tree)","platform":"leetcode","url":"https://leetcode.com/problems/implement-trie-prefix-tree/","difficulty":"medium"},{"title":"Add and Search Word - Data structure design","platform":"leetcode","url":"https://leetcode.com/problems/add-and-search-word-data-structure-design/","difficulty":"medium"},{"title":"Word Search II","platform":"leetcode","url":"https://leetcode.com/problems/word-search-ii/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w10-tree-based-problems', 10, 5, 'Tree-based problems',
    'Tree-based problems combine recursion, traversal and parent maps to answer relationship queries.',
    '["Find the lowest common ancestor of two nodes.","Serialize and deserialize a tree.","Compare two trees for structural equality.","Use a parent map for distance queries."]'::jsonb,
    '["Lowest common ancestor","Serialization format","Subtree comparison","Parent maps","Path queries"]'::jsonb,
    'Implement Java methods using TreeNode, HashMap<TreeNode,TreeNode> and StringBuilder serialization.',
    4,
    '[{"title":"Lowest Common Ancestor of a Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/","difficulty":"easy"},{"title":"Serialize and Deserialize Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/","difficulty":"hard"},{"title":"Subtree of Another Tree","platform":"leetcode","url":"https://leetcode.com/problems/subtree-of-another-tree/","difficulty":"easy"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO roadmap_topics (id, week_no, order_index, name, description, objectives, subtopics, java_requirements, recommended_problems, related_problems) VALUES
  (
    'w11-graph-representations', 11, 1, 'Graph representations',
    'Graphs model vertices and edges and can be stored as adjacency matrices, adjacency lists or edge lists.',
    '["Explain vertices, edges, directed and undirected graphs.","Choose a representation based on graph density.","Store weighted edges with a small Java record.","Convert between edge lists and adjacency lists."]'::jsonb,
    '["Vertices and edges","Directed versus undirected","Dense versus sparse","Edge list representation","Weighted edges"]'::jsonb,
    'Model edges with a Java record Edge(int from, int to, int weight) and build adjacency structures with List<Edge>[].',
    4,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Clone Graph","platform":"leetcode","url":"https://leetcode.com/problems/clone-graph/","difficulty":"medium"},{"title":"Roads and Libraries","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/roads-and-libraries/problem","difficulty":"medium"}]'::jsonb
  ),
  (
    'w11-adjacency-matrix', 11, 2, 'Adjacency Matrix',
    'An adjacency matrix uses a square array to record edge presence or weight, giving constant-time edge queries.',
    '["Build a boolean or int adjacency matrix.","Check edge existence in O(1).","Explain quadratic memory cost.","Choose matrix representation for dense graphs."]'::jsonb,
    '["Matrix indexing","Edge lookup","Memory cost","Dense graphs","Self loops"]'::jsonb,
    'Implement Java code using boolean[][] or int[][] with a large sentinel value for absent weighted edges.',
    3,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Minimum Number of Vertices to Reach All Nodes","platform":"leetcode","url":"https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/","difficulty":"medium"},{"title":"Find the Town Judge","platform":"leetcode","url":"https://leetcode.com/problems/find-the-town-judge/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w11-adjacency-list', 11, 3, 'Adjacency List',
    'An adjacency list stores each vertex with its neighbors, using O(V + E) space for sparse graphs.',
    '["Build adjacency lists from an edge array.","Iterate neighbors efficiently.","Add directed and undirected edges.","Compare memory with adjacency matrices."]'::jsonb,
    '["Per-vertex neighbor lists","Building from edges","Directed insertion","Space efficiency","Traversal patterns"]'::jsonb,
    'Implement Java adjacency lists with List<Integer>[] or Map<Integer,List<Integer>> and java.util.ArrayList.',
    4,
    '[{"title":"Clone Graph","platform":"leetcode","url":"https://leetcode.com/problems/clone-graph/","difficulty":"medium"},{"title":"Course Schedule","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule/","difficulty":"medium"},{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w11-bfs', 11, 4, 'BFS',
    'Breadth-first search explores neighbors level by level with a queue and finds shortest paths in unweighted graphs.',
    '["Implement BFS with ArrayDeque<Integer>.","Mark visited nodes before enqueueing.","Compute shortest unweighted distances.","Avoid infinite loops in cyclic graphs."]'::jsonb,
    '["Queue-driven exploration","Visited set","Level distances","Shortest path property","Cycle avoidance"]'::jsonb,
    'Implement Java BFS using ArrayDeque<Integer>, boolean[] visited and int[] distance arrays.',
    5,
    '[{"title":"Binary Tree Level Order Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-level-order-traversal/","difficulty":"medium"},{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Rotting Oranges","platform":"leetcode","url":"https://leetcode.com/problems/rotting-oranges/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w11-dfs', 11, 5, 'DFS',
    'Depth-first search explores as far as possible along one branch before backtracking, recursively or with a stack.',
    '["Implement recursive DFS on adjacency lists.","Use a visited array to prevent repeats.","Count reachable nodes from a start vertex.","Explain recursion depth and stack risks."]'::jsonb,
    '["Recursive exploration","Backtracking","Visited marking","Connected region counting","Iterative stack variant"]'::jsonb,
    'Implement Java dfs(int u, List<Integer>[] adj, boolean[] seen) both recursively and with Deque<Integer>.',
    5,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Path Sum","platform":"leetcode","url":"https://leetcode.com/problems/path-sum/","difficulty":"easy"},{"title":"Surrounded Regions","platform":"leetcode","url":"https://leetcode.com/problems/surrounded-regions/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w11-cycle-detection', 11, 6, 'Cycle Detection',
    'Cycle detection in graphs uses DFS colors or union-find to identify back edges and redundant connections.',
    '["Detect cycles in undirected graphs with parent tracking.","Detect cycles in directed graphs with recursion stack colors.","Explain the role of the parent pointer.","Apply cycle detection to dependency problems."]'::jsonb,
    '["Visiting and visited states","Parent tracking","Back edges","Directed recursion stack","Union-find alternative"]'::jsonb,
    'Implement Java cycle detection with int[] state values 0 unvisited, 1 visiting and 2 done over adjacency lists.',
    4,
    '[{"title":"Course Schedule","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule/","difficulty":"medium"},{"title":"Course Schedule II","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule-ii/","difficulty":"medium"},{"title":"Graph Valid Tree","platform":"leetcode","url":"https://leetcode.com/problems/graph-valid-tree/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w11-connected-components', 11, 7, 'Connected Components',
    'Connected components are maximal groups of vertices linked by paths and are found with repeated BFS or DFS.',
    '["Count components by launching DFS from each unvisited vertex.","Label each vertex with a component id.","Compute component sizes.","Handle disconnected and isolated vertices."]'::jsonb,
    '["Component definition","DFS from each root","Component labeling","Size tracking","Isolated vertices"]'::jsonb,
    'Implement Java component counting with boolean[] visited and an int[] componentId array.',
    4,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Max Area of Island","platform":"leetcode","url":"https://leetcode.com/problems/max-area-of-island/","difficulty":"medium"},{"title":"Number of Connected Components in an Undirected Graph","platform":"leetcode","url":"https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-topological-sorting', 12, 1, 'Topological Sorting',
    'Topological sorting orders vertices of a directed acyclic graph so every edge points forward in the order.',
    '["Compute indegrees for every vertex.","Implement Kahn algorithm with a queue.","Produce a DFS-based finishing-time order.","Detect cycles from an incomplete ordering."]'::jsonb,
    '["DAG requirement","Indegree counting","Kahn queue algorithm","DFS finishing times","Cycle detection"]'::jsonb,
    'Implement Java topologicalSort with ArrayDeque<Integer>, int[] indegree and List<Integer>[] adjacency.',
    5,
    '[{"title":"Course Schedule","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule/","difficulty":"medium"},{"title":"Course Schedule II","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule-ii/","difficulty":"medium"},{"title":"Alien Dictionary","platform":"leetcode","url":"https://leetcode.com/problems/alien-dictionary/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w12-shortest-path-algorithms', 12, 2, 'Shortest Path Algorithms',
    'Shortest path algorithms find minimum-cost paths and differ by edge weights, cycles and graph size.',
    '["Distinguish unweighted from weighted shortest paths.","Choose BFS, Dijkstra or Bellman-Ford appropriately.","Relax edges and update distances.","Reconstruct a path from parent pointers."]'::jsonb,
    '["Path cost definition","Edge relaxation","Algorithm selection","Negative weights","Path reconstruction"]'::jsonb,
    'Implement Java distance tracking with long[] dist and int[] parent arrays plus a PriorityQueue for weighted graphs.',
    5,
    '[{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"},{"title":"Path with Minimum Effort","platform":"leetcode","url":"https://leetcode.com/problems/path-with-minimum-effort/","difficulty":"medium"},{"title":"Cheapest Flights Within K Stops","platform":"leetcode","url":"https://leetcode.com/problems/cheapest-flights-within-k-stops/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-dijkstra', 12, 3, 'Dijkstra',
    'Dijkstra algorithm greedily settles the nearest unvisited vertex and works with non-negative edge weights.',
    '["Implement Dijkstra with a min-heap.","Explain why non-negative weights are required.","Track settled vertices.","Compute distances from one source to all nodes."]'::jsonb,
    '["Priority queue frontier","Greedy vertex selection","Non-negative requirement","Distance updates","Single-source shortest path"]'::jsonb,
    'Implement Java Dijkstra with PriorityQueue<long[]> or a record Entry and long[][] adjacency.',
    5,
    '[{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"},{"title":"Path with Minimum Effort","platform":"leetcode","url":"https://leetcode.com/problems/path-with-minimum-effort/","difficulty":"medium"},{"title":"Find the City With the Smallest Number of Neighbors at a Threshold Distance","platform":"leetcode","url":"https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-bellman-ford', 12, 4, 'Bellman-Ford',
    'Bellman-Ford relaxes every edge V-1 times, supporting negative edges and bounded-hop shortest paths.',
    '["Run V-1 full relaxation passes.","Detect negative cycles with one extra pass.","Limit paths to k stops.","Compare complexity with Dijkstra."]'::jsonb,
    '["Full edge relaxation","Negative edges","Negative cycle detection","K-hop constraint","Complexity comparison"]'::jsonb,
    'Implement Java Bellman-Ford with Edge records and int[] or long[] distance arrays copied each pass.',
    4,
    '[{"title":"Cheapest Flights Within K Stops","platform":"leetcode","url":"https://leetcode.com/problems/cheapest-flights-within-k-stops/","difficulty":"medium"},{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"},{"title":"Find the City With the Smallest Number of Neighbors at a Threshold Distance","platform":"leetcode","url":"https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-floyd-warshall', 12, 5, 'Floyd-Warshall',
    'Floyd-Warshall computes all-pairs shortest paths by considering each vertex as an intermediate point.',
    '["Initialize a distance matrix from edge weights.","Apply the triple-loop DP recurrence.","Read shortest paths for any source and target.","Identify when all-pairs computation is worthwhile."]'::jsonb,
    '["Distance matrix","Intermediate vertex DP","Triple nested loops","All-pairs result","When to use"]'::jsonb,
    'Implement Java Floyd-Warshall with long[][] dist and a large INF constant to avoid overflow.',
    3,
    '[{"title":"Find the City With the Smallest Number of Neighbors at a Threshold Distance","platform":"leetcode","url":"https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/","difficulty":"medium"},{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"},{"title":"Cheapest Flights Within K Stops","platform":"leetcode","url":"https://leetcode.com/problems/cheapest-flights-within-k-stops/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-disjoint-set-union', 12, 6, 'Disjoint Set Union',
    'Disjoint Set Union maintains groups with union and find operations and detects cycles or connectivity efficiently.',
    '["Implement parent and rank arrays.","Apply path compression in find.","Union components by rank or size.","Use DSU for connectivity queries."]'::jsonb,
    '["Parent array","Find with compression","Union by rank","Cycle detection","Connectivity queries"]'::jsonb,
    'Implement Java DSU with int[] parent and int[] rank, plus find and union methods.',
    5,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Graph Valid Tree","platform":"leetcode","url":"https://leetcode.com/problems/graph-valid-tree/","difficulty":"medium"},{"title":"Redundant Connection","platform":"leetcode","url":"https://leetcode.com/problems/redundant-connection/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-minimum-spanning-trees', 12, 7, 'Minimum Spanning Trees',
    'A minimum spanning tree connects all vertices with the least total edge weight and contains no cycles.',
    '["Define spanning tree and total weight.","Apply Kruskal or Prim to build an MST.","Explain why the result has V-1 edges.","Recognize cut and cycle properties."]'::jsonb,
    '["Spanning tree definition","Total edge weight","Cut property","Cycle property","V-1 edges"]'::jsonb,
    'Implement Java MST helpers with Edge records, PriorityQueue<Edge> and a DSU class.',
    4,
    '[{"title":"Min Cost to Connect All Points","platform":"leetcode","url":"https://leetcode.com/problems/min-cost-to-connect-all-points/","difficulty":"medium"},{"title":"Graph Valid Tree","platform":"leetcode","url":"https://leetcode.com/problems/graph-valid-tree/","difficulty":"medium"},{"title":"Roads and Libraries","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/roads-and-libraries/problem","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-kruskal', 12, 8, 'Kruskal',
    'Kruskal algorithm sorts edges by weight and adds them with a disjoint set union whenever they connect new components.',
    '["Sort edges in nondecreasing weight order.","Use DSU to skip cycle-forming edges.","Stop after V-1 selected edges.","Compute the total MST weight."]'::jsonb,
    '["Edge sorting","DSU integration","Cycle avoidance","Termination condition","Total weight"]'::jsonb,
    'Implement Java Kruskal with List<Edge>, a Comparator and a DSU instance.',
    4,
    '[{"title":"Min Cost to Connect All Points","platform":"leetcode","url":"https://leetcode.com/problems/min-cost-to-connect-all-points/","difficulty":"medium"},{"title":"Redundant Connection","platform":"leetcode","url":"https://leetcode.com/problems/redundant-connection/","difficulty":"medium"},{"title":"Roads and Libraries","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/roads-and-libraries/problem","difficulty":"medium"}]'::jsonb
  ),
  (
    'w12-prim', 12, 9, 'Prim',
    'Prim algorithm grows a single tree from a start vertex by repeatedly adding the cheapest crossing edge.',
    '["Maintain a priority queue of frontier edges.","Add the cheapest edge to a new vertex.","Avoid revisiting included vertices.","Compare Prim with Kruskal on dense graphs."]'::jsonb,
    '["Single-tree growth","Frontier priority queue","Visited tracking","Dense graph behavior","Kruskal comparison"]'::jsonb,
    'Implement Java Prim with PriorityQueue<int[]> holding weight and vertex pairs plus boolean[] inTree.',
    4,
    '[{"title":"Min Cost to Connect All Points","platform":"leetcode","url":"https://leetcode.com/problems/min-cost-to-connect-all-points/","difficulty":"medium"},{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"},{"title":"Graph Valid Tree","platform":"leetcode","url":"https://leetcode.com/problems/graph-valid-tree/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w13-greedy-fundamentals', 13, 1, 'Greedy fundamentals',
    'Greedy algorithms make the locally best choice at each step and are correct only when that choice is safe.',
    '["Identify greedy-choice and optimal-substructure properties.","Prove exchange arguments for simple cases.","Compare greedy with dynamic programming.","Recognize counterexamples to greedy."]'::jsonb,
    '["Locally optimal choice","Greedy-choice property","Exchange argument","Correctness proof","When greedy fails"]'::jsonb,
    'Implement Java greedy solutions that sort inputs with Comparator and scan once to build a result.',
    5,
    '[{"title":"Assign Cookies","platform":"leetcode","url":"https://leetcode.com/problems/assign-cookies/","difficulty":"easy"},{"title":"Maximum Subarray","platform":"leetcode","url":"https://leetcode.com/problems/maximum-subarray/","difficulty":"medium"},{"title":"Best Time to Buy and Sell Stock II","platform":"leetcode","url":"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w13-activity-selection', 13, 2, 'Activity Selection',
    'Activity selection chooses the largest set of non-overlapping activities by always picking the earliest finishing one.',
    '["Sort activities by finish time.","Select compatible activities greedily.","Prove the earliest-finish choice is safe.","Return the selected count or list."]'::jsonb,
    '["Finish-time sorting","Compatibility check","Greedy selection","Proof sketch","Count versus list"]'::jsonb,
    'Implement Java activity selection with a record Activity(int start, int end) and Comparator.comparingInt.',
    4,
    '[{"title":"Non-overlapping Intervals","platform":"leetcode","url":"https://leetcode.com/problems/non-overlapping-intervals/","difficulty":"medium"},{"title":"Meeting Rooms","platform":"leetcode","url":"https://leetcode.com/problems/meeting-rooms/","difficulty":"easy"},{"title":"Maximum Number of Events That Can Be Attended","platform":"leetcode","url":"https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w13-interval-problems', 13, 3, 'Interval problems',
    'Interval problems require merging, inserting or counting overlapping ranges using sorting and a running boundary.',
    '["Merge overlapping intervals in one sorted pass.","Insert a new interval into a sorted list.","Count intersections of two interval lists.","Detect conflicts with a min-heap of end times."]'::jsonb,
    '["Interval sorting","Merge condition","Running end boundary","Intersection two pointers","Conflict detection"]'::jsonb,
    'Implement Java interval algorithms with int[][] arrays, Arrays.sort and ArrayDeque<int[]> or PriorityQueue.',
    5,
    '[{"title":"Merge Intervals","platform":"leetcode","url":"https://leetcode.com/problems/merge-intervals/","difficulty":"medium"},{"title":"Insert Interval","platform":"leetcode","url":"https://leetcode.com/problems/insert-interval/","difficulty":"medium"},{"title":"Interval List Intersections","platform":"leetcode","url":"https://leetcode.com/problems/interval-list-intersections/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w13-scheduling-problems', 13, 4, 'Scheduling problems',
    'Scheduling problems assign limited time or resources to tasks and often combine greedy choices with heaps.',
    '["Maximize courses completed under deadlines.","Schedule tasks with cooling gaps.","Assign meeting rooms using end-time heaps.","Explain the greedy invariant used."]'::jsonb,
    '["Deadline scheduling","Course selection","Task scheduler","Room allocation","Heap use"]'::jsonb,
    'Implement Java scheduling with PriorityQueue<Integer> for deadlines or end times and long accumulators.',
    4,
    '[{"title":"Course Schedule III","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule-iii/","difficulty":"hard"},{"title":"Task Scheduler","platform":"leetcode","url":"https://leetcode.com/problems/task-scheduler/","difficulty":"medium"},{"title":"Meeting Rooms II","platform":"leetcode","url":"https://leetcode.com/problems/meeting-rooms-ii/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w14-overlapping-subproblems', 14, 1, 'Overlapping Subproblems',
    'A problem has overlapping subproblems when the same smaller state is recomputed many times.',
    '["Identify repeated states in recursive calls.","Count redundant computations for Fibonacci.","Draw a recursion tree with repeated nodes.","Explain when caching changes complexity."]'::jsonb,
    '["Repeated states","Recursion tree overlap","Fibonacci example","Memoization need","Complexity improvement"]'::jsonb,
    'Implement Java Fibonacci recursively with a call counter and then with an int[] or HashMap cache.',
    4,
    '[{"title":"Fibonacci Number","platform":"leetcode","url":"https://leetcode.com/problems/fibonacci-number/","difficulty":"easy"},{"title":"Climbing Stairs","platform":"leetcode","url":"https://leetcode.com/problems/climbing-stairs/","difficulty":"easy"},{"title":"Tribonacci Sequence","platform":"leetcode","url":"https://leetcode.com/problems/tribonacci-sequence/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w14-optimal-substructure', 14, 2, 'Optimal Substructure',
    'Optimal substructure means an optimal solution can be built from optimal solutions to smaller subproblems.',
    '["State the recurrence for a small DP problem.","Combine optimal child results correctly.","Verify the recurrence on examples.","Distinguish optimal substructure from greedy choice."]'::jsonb,
    '["Subproblem definition","Recurrence relation","Combining child results","Proof by induction","Greedy versus DP"]'::jsonb,
    'Implement Java methods for maximum subarray and house robber using explicit recurrence formulas.',
    4,
    '[{"title":"Maximum Subarray","platform":"leetcode","url":"https://leetcode.com/problems/maximum-subarray/","difficulty":"medium"},{"title":"House Robber","platform":"leetcode","url":"https://leetcode.com/problems/house-robber/","difficulty":"medium"},{"title":"Unique Paths","platform":"leetcode","url":"https://leetcode.com/problems/unique-paths/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w14-memoization', 14, 3, 'Memoization',
    'Memoization caches the result of each subproblem so a recursive DP solves every distinct state once.',
    '["Add a cache array or map to recursive DP.","Use a sentinel for uncomputed states.","Explain the resulting time and space complexity.","Handle multi-dimensional state keys."]'::jsonb,
    '["Top-down DP","Cache initialization","Sentinel values","State keys","Complexity analysis"]'::jsonb,
    'Implement Java memoization with int[] filled by Arrays.fill and HashMap<String,Integer> for string states.',
    5,
    '[{"title":"Fibonacci Number","platform":"leetcode","url":"https://leetcode.com/problems/fibonacci-number/","difficulty":"easy"},{"title":"House Robber","platform":"leetcode","url":"https://leetcode.com/problems/house-robber/","difficulty":"medium"},{"title":"Decode Ways","platform":"leetcode","url":"https://leetcode.com/problems/decode-ways/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w14-tabulation', 14, 4, 'Tabulation',
    'Tabulation fills a DP table bottom-up so each state is computed from previously solved entries.',
    '["Define table dimensions and base cases.","Fill entries in a valid order.","Reduce space with rolling variables when possible.","Compare tabulation with memoization."]'::jsonb,
    '["Bottom-up order","Base case initialization","DP table layout","Space optimization","Top-down comparison"]'::jsonb,
    'Implement Java tabulation with int[] arrays and rolling variables for one-dimensional recurrences.',
    4,
    '[{"title":"Climbing Stairs","platform":"leetcode","url":"https://leetcode.com/problems/climbing-stairs/","difficulty":"easy"},{"title":"Min Cost Climbing Stairs","platform":"leetcode","url":"https://leetcode.com/problems/min-cost-climbing-stairs/","difficulty":"easy"},{"title":"House Robber","platform":"leetcode","url":"https://leetcode.com/problems/house-robber/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w14-state-transitions', 14, 5, 'State transitions',
    'State transitions describe how each DP entry is derived from earlier entries, usually as a min or max over choices.',
    '["Write transition equations from a problem statement.","Include all valid predecessor states.","Handle obstacles or constraints in transitions.","Test transitions against small examples."]'::jsonb,
    '["Transition formula","Predecessor states","Choice enumeration","Constraint handling","Manual verification"]'::jsonb,
    'Implement Java transition loops over int[] or int[][] tables with careful boundary checks.',
    5,
    '[{"title":"House Robber II","platform":"leetcode","url":"https://leetcode.com/problems/house-robber-ii/","difficulty":"medium"},{"title":"Decode Ways","platform":"leetcode","url":"https://leetcode.com/problems/decode-ways/","difficulty":"medium"},{"title":"Unique Paths II","platform":"leetcode","url":"https://leetcode.com/problems/unique-paths-ii/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w14-identifying-dp-problems', 14, 6, 'Identifying DP problems',
    'Recognizing DP involves finding a repeatable state, a recurrence and an optimization goal.',
    '["Decide whether a problem admits DP.","Define the state precisely.","Explain the objective being optimized.","Choose top-down or bottom-up implementation."]'::jsonb,
    '["State identification","Recurrence discovery","Optimization goal","DP versus greedy","Implementation choice"]'::jsonb,
    'Implement Java DP solutions for word break and subset sum using boolean[] tables and sets.',
    5,
    '[{"title":"Word Break","platform":"leetcode","url":"https://leetcode.com/problems/word-break/","difficulty":"medium"},{"title":"Partition Equal Subset Sum","platform":"leetcode","url":"https://leetcode.com/problems/partition-equal-subset-sum/","difficulty":"medium"},{"title":"Jump Game","platform":"leetcode","url":"https://leetcode.com/problems/jump-game/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w15-1d-dp', 15, 1, '1D DP',
    'One-dimensional DP stores a single row of states where each entry depends on a few earlier entries.',
    '["Build a one-dimensional dp array.","Initialize base states correctly.","Apply recurrence in forward order.","Optimize space to constant variables where possible."]'::jsonb,
    '["Single-row state","Base initialization","Forward iteration","Rolling variables","Space optimization"]'::jsonb,
    'Implement Java 1D DP with int[] dp and optional O(1) variables for staircase-style problems.',
    5,
    '[{"title":"House Robber","platform":"leetcode","url":"https://leetcode.com/problems/house-robber/","difficulty":"medium"},{"title":"Climbing Stairs","platform":"leetcode","url":"https://leetcode.com/problems/climbing-stairs/","difficulty":"easy"},{"title":"Minimum Cost For Tickets","platform":"leetcode","url":"https://leetcode.com/problems/minimum-cost-for-tickets/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w15-2d-dp', 15, 2, '2D DP',
    'Two-dimensional DP stores states indexed by two dimensions, often positions in a grid or two sequence indices.',
    '["Define rows, columns and base row or column.","Fill the table with nested loops.","Read the answer from the correct cell.","Flatten a 2D table when needed."]'::jsonb,
    '["Grid of states","Base row and column","Nested loop order","Answer cell","Flattened arrays"]'::jsonb,
    'Implement Java 2D DP with int[][] and verify with small hand-computed tables.',
    5,
    '[{"title":"Unique Paths","platform":"leetcode","url":"https://leetcode.com/problems/unique-paths/","difficulty":"medium"},{"title":"Minimum Path Sum","platform":"leetcode","url":"https://leetcode.com/problems/minimum-path-sum/","difficulty":"medium"},{"title":"Longest Common Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-common-subsequence/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w15-knapsack', 15, 3, 'Knapsack',
    'Knapsack problems choose items under a capacity constraint, using 0/1 or unbounded state transitions.',
    '["Build the 0/1 knapsack recurrence.","Choose items once with reverse capacity iteration.","Handle unbounded items with forward iteration.","Reduce a partition problem to knapsack."]'::jsonb,
    '["0/1 knapsack","Capacity dimension","Reverse iteration","Unbounded variant","Subset sum reduction"]'::jsonb,
    'Implement Java knapsack with int[] dp where dp[c] is the best value at capacity c.',
    5,
    '[{"title":"Partition Equal Subset Sum","platform":"leetcode","url":"https://leetcode.com/problems/partition-equal-subset-sum/","difficulty":"medium"},{"title":"Ones and Zeroes","platform":"leetcode","url":"https://leetcode.com/problems/ones-and-zeroes/","difficulty":"medium"},{"title":"The Coin Change Problem","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/the-coin-change-problem/problem","difficulty":"medium"}]'::jsonb
  ),
  (
    'w15-grid-dp', 15, 4, 'Grid DP',
    'Grid DP computes paths or costs through a matrix by combining top, left and sometimes diagonal predecessors.',
    '["Compute minimum path sums in a grid.","Mark unreachable states with obstacles.","Count unique paths with blockers.","Recover a path from parent choices."]'::jsonb,
    '["Cell state","Top and left predecessors","Obstacle handling","Path counting","Path reconstruction"]'::jsonb,
    'Implement Java grid DP with int[][], INF sentinel values and in-place table updates.',
    5,
    '[{"title":"Minimum Path Sum","platform":"leetcode","url":"https://leetcode.com/problems/minimum-path-sum/","difficulty":"medium"},{"title":"Unique Paths II","platform":"leetcode","url":"https://leetcode.com/problems/unique-paths-ii/","difficulty":"medium"},{"title":"Dungeon Game","platform":"leetcode","url":"https://leetcode.com/problems/dungeon-game/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w15-subsequence-dp', 15, 5, 'Subsequence DP',
    'Subsequence DP compares prefixes of sequences to find common, increasing or palindromic subsequences.',
    '["Build 2D tables for two-sequence comparisons.","Derive LCS recurrence from last characters.","Implement LIS with a one-dimensional table or patience sorting.","Return the subsequence, not just its length."]'::jsonb,
    '["Prefix state","LCS recurrence","LIS state","Palindromic intervals","Reconstruction"]'::jsonb,
    'Implement Java subsequence DP with int[][] for LCS and int[] tails for LIS.',
    5,
    '[{"title":"Longest Common Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-common-subsequence/","difficulty":"medium"},{"title":"Longest Increasing Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-increasing-subsequence/","difficulty":"easy"},{"title":"Longest Palindromic Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-palindromic-subsequence/","difficulty":"medium"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO roadmap_topics (id, week_no, order_index, name, description, objectives, subtopics, java_requirements, recommended_problems, related_problems) VALUES
  (
    'w16-longest-common-subsequence', 16, 1, 'Longest Common Subsequence',
    'LCS finds the longest sequence appearing in the same relative order in two strings using a prefix DP table.',
    '["Define dp[i][j] as the LCS length of the first i and j characters.","Apply the match and mismatch transitions.","Reconstruct one LCS from the table.","Explain time and space complexity."]'::jsonb,
    '["Prefix state","Match transition","Mismatch max transition","Table reconstruction","Space optimization"]'::jsonb,
    'Implement Java LCS with int[][] dp and reconstruct the subsequence with StringBuilder.',
    5,
    '[{"title":"Longest Common Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-common-subsequence/","difficulty":"medium"},{"title":"Shortest Common Supersequence","platform":"leetcode","url":"https://leetcode.com/problems/shortest-common-supersequence/","difficulty":"hard"},{"title":"Longest Palindromic Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-palindromic-subsequence/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w16-longest-increasing-subsequence', 16, 2, 'Longest Increasing Subsequence',
    'LIS finds the longest strictly increasing subsequence with a DP table or patience sorting in O(n log n).',
    '["Build the quadratic LIS dp array.","Implement the binary-search tails approach.","Explain why tails entries are minimal endings.","Reconstruct the subsequence with parent pointers."]'::jsonb,
    '["Quadratic DP","Tails array","Binary search insertion","Strict versus non-decreasing","Parent reconstruction"]'::jsonb,
    'Implement Java LIS with int[] tails and Arrays.binarySearch or a custom lower-bound helper.',
    5,
    '[{"title":"Longest Increasing Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-increasing-subsequence/","difficulty":"easy"},{"title":"Russian Doll Envelopes","platform":"leetcode","url":"https://leetcode.com/problems/russian-doll-envelopes/","difficulty":"hard"},{"title":"Longest Continuous Increasing Subsequence","platform":"leetcode","url":"https://leetcode.com/problems/longest-continuous-increasing-subsequence/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w16-advanced-dp-patterns', 16, 3, 'Advanced DP patterns',
    'Advanced DP patterns include bitmask states, interval DP and multi-dimensional optimization goals.',
    '["Model subsets with bitmask state indices.","Solve interval DP over subarray lengths.","Handle multiple dimensions or states per position.","Choose pruning or rolling arrays to fit limits."]'::jsonb,
    '["Bitmask DP","Interval DP","State compression","Rolling arrays","Multi-state transitions"]'::jsonb,
    'Implement Java DP with int[][] tables, bit shifts for masks and long[] where counts grow large.',
    5,
    '[{"title":"Best Time to Buy and Sell Stock with Cooldown","platform":"leetcode","url":"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/","difficulty":"medium"},{"title":"Paint House","platform":"leetcode","url":"https://leetcode.com/problems/paint-house/","difficulty":"easy"},{"title":"Student Attendance Record II","platform":"leetcode","url":"https://leetcode.com/problems/student-attendance-record-ii/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w16-bit-manipulation', 16, 4, 'Bit Manipulation',
    'Bit manipulation operates directly on binary representations using shifts and bitwise operators.',
    '["Read and write bits with shifts and masks.","Set, clear and toggle individual bits.","Use XOR to find unique values.","Count set bits efficiently."]'::jsonb,
    '["Binary representation","Left and right shifts","AND OR XOR NOT","Set clear toggle","Bit counting"]'::jsonb,
    'Implement Java methods using int operators <<, >>, &, |, ^ and Integer.bitCount where allowed.',
    4,
    '[{"title":"Single Number","platform":"leetcode","url":"https://leetcode.com/problems/single-number/","difficulty":"easy"},{"title":"Single Number II","platform":"leetcode","url":"https://leetcode.com/problems/single-number-ii/","difficulty":"medium"},{"title":"Missing Number","platform":"leetcode","url":"https://leetcode.com/problems/missing-number/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w16-bitwise-operations', 16, 5, 'Bitwise operations',
    'Bitwise operations solve arithmetic and masking tasks without loops over digits, often in constant time.',
    '["Add integers with XOR and carry.","Reverse the bits of an integer.","Check power-of-two properties with bit tricks.","Extract or clear low bits."]'::jsonb,
    '["XOR-based addition","Bit reversal","Power-of-two checks","Lowest set bit","Masking patterns"]'::jsonb,
    'Implement Java bit tricks with int, the unsigned right shift >>> and masking constants.',
    4,
    '[{"title":"Sum of Two Integers","platform":"leetcode","url":"https://leetcode.com/problems/sum-of-two-integers/","difficulty":"easy"},{"title":"Number of 1 Bits","platform":"leetcode","url":"https://leetcode.com/problems/number-of-1-bits/","difficulty":"easy"},{"title":"Reverse Bits","platform":"leetcode","url":"https://leetcode.com/problems/reverse-bits/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w17-advanced-dynamic-programming', 17, 1, 'Advanced Dynamic Programming',
    'Advanced revision targets DP problems with several state dimensions and non-obvious transitions.',
    '["Recognize multi-dimensional DP states.","Derive transitions for stock and sequence problems.","Optimize space without changing correctness.","Explain correctness of each recurrence."]'::jsonb,
    '["Multi-dimensional states","Stock with transactions","Interval and string DP","Space optimization","Correctness proof"]'::jsonb,
    'Implement Java solutions with int[][][] or rolling int[][] tables and clear base-case handling.',
    4,
    '[{"title":"Best Time to Buy and Sell Stock IV","platform":"leetcode","url":"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/","difficulty":"hard"},{"title":"Paint House II","platform":"leetcode","url":"https://leetcode.com/problems/paint-house-ii/","difficulty":"hard"},{"title":"Word Break II","platform":"leetcode","url":"https://leetcode.com/problems/word-break-ii/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w17-backtracking-revision', 17, 2, 'Backtracking revision',
    'Backtracking revision reinforces generate-and-prune search over combinatorial spaces.',
    '["Rebuild a backtracking template from memory.","Prune branches using constraints early.","Avoid duplicate results with canonical ordering.","Analyze output-size complexity."]'::jsonb,
    '["Template recall","Early pruning","Duplicate avoidance","Constraint propagation","Complexity"]'::jsonb,
    'Implement Java backtracking with boolean[][] grids, used arrays and List<List<Integer>> results.',
    4,
    '[{"title":"N-Queens","platform":"leetcode","url":"https://leetcode.com/problems/n-queens/","difficulty":"hard"},{"title":"Sudoku Solver","platform":"leetcode","url":"https://leetcode.com/problems/sudoku-solver/","difficulty":"hard"},{"title":"Combination Sum III","platform":"leetcode","url":"https://leetcode.com/problems/combination-sum-iii/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w17-mixed-algorithmic-problems', 17, 3, 'Mixed algorithmic problems',
    'Mixed advanced problems require selecting among hashing, heaps, graphs and DP under time pressure.',
    '["Classify a problem before coding.","Justify the chosen data structure.","Implement a clean solution within a time limit.","Test edge cases systematically."]'::jsonb,
    '["Problem classification","Structure selection","Time-boxed coding","Edge case testing","Review and refinement"]'::jsonb,
    'Implement Java solutions combining HashMap, PriorityQueue, TreeNode and int[] within timed exercises.',
    5,
    '[{"title":"Trapping Rain Water","platform":"leetcode","url":"https://leetcode.com/problems/trapping-rain-water/","difficulty":"hard"},{"title":"LRU Cache","platform":"leetcode","url":"https://leetcode.com/problems/lru-cache/","difficulty":"medium"},{"title":"Merge Intervals","platform":"leetcode","url":"https://leetcode.com/problems/merge-intervals/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w18-arrays-and-strings', 18, 1, 'Arrays and Strings',
    'This revision consolidates array and string patterns: hashing, two pointers, sliding windows and prefix sums.',
    '["Solve a fresh array problem using two pointers.","Solve a fresh string problem using a frequency map.","Apply a sliding window under a stated constraint.","Explain complexity for each solution."]'::jsonb,
    '["Two pointers","Frequency maps","Sliding window","Prefix sums","Complexity review"]'::jsonb,
    'Implement Java revision solutions with int[], String, StringBuilder and java.util.HashMap.',
    5,
    '[{"title":"Two Sum","platform":"leetcode","url":"https://leetcode.com/problems/two-sum/","difficulty":"easy"},{"title":"Longest Substring Without Repeating Characters","platform":"leetcode","url":"https://leetcode.com/problems/longest-substring-without-repeating-characters/","difficulty":"medium"},{"title":"Array DS","platform":"hackerrank","url":"https://www.hackerrank.com/challenges/arrays-ds/problem","difficulty":"easy"}]'::jsonb
  ),
  (
    'w18-linked-lists', 18, 2, 'Linked Lists',
    'Linked list revision covers pointer manipulation, reversal, cycle handling and list-based data structures.',
    '["Reverse a list in place.","Detect and locate a cycle.","Merge sorted lists recursively.","Implement an LRU cache with a doubly linked list and map."]'::jsonb,
    '["Pointer manipulation","Reversal","Cycle detection","Merging","LRU design"]'::jsonb,
    'Implement Java ListNode solutions and an LRU cache using HashMap<Integer,Node> with sentinel nodes.',
    5,
    '[{"title":"Reverse Linked List","platform":"leetcode","url":"https://leetcode.com/problems/reverse-linked-list/","difficulty":"easy"},{"title":"LRU Cache","platform":"leetcode","url":"https://leetcode.com/problems/lru-cache/","difficulty":"medium"},{"title":"Linked List Cycle","platform":"leetcode","url":"https://leetcode.com/problems/linked-list-cycle/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w18-stacks-and-queues', 18, 3, 'Stacks and Queues',
    'Revision of stacks and queues covers matching, monotonic structures and breadth-first processing.',
    '["Match brackets with a stack.","Compute next greater elements with a monotonic stack.","Maintain a moving maximum with a deque.","Process levels with a queue."]'::jsonb,
    '["Matching","Monotonic stack","Monotonic queue","BFS queue","ArrayDeque"]'::jsonb,
    'Implement Java solutions with Deque<T> and ArrayDeque<T> for stacks, queues and monotonic structures.',
    4,
    '[{"title":"Valid Parentheses","platform":"leetcode","url":"https://leetcode.com/problems/valid-parentheses/","difficulty":"easy"},{"title":"Min Stack","platform":"leetcode","url":"https://leetcode.com/problems/min-stack/","difficulty":"easy"},{"title":"Sliding Window Maximum","platform":"leetcode","url":"https://leetcode.com/problems/sliding-window-maximum/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w18-trees', 18, 4, 'Trees',
    'Tree revision revisits traversals, BST validation, recursion patterns and heap-based structures.',
    '["Implement all four depth-first traversals.","Validate a BST with bounded recursion.","Compute height and diameter in one pass.","Use a priority queue for heap-style tasks."]'::jsonb,
    '["DFS traversals","BFS traversal","BST validation","Height and diameter","Heap review"]'::jsonb,
    'Implement Java TreeNode recursion and PriorityQueue<int[]> solutions from memory.',
    5,
    '[{"title":"Validate Binary Search Tree","platform":"leetcode","url":"https://leetcode.com/problems/validate-binary-search-tree/","difficulty":"medium"},{"title":"Binary Tree Level Order Traversal","platform":"leetcode","url":"https://leetcode.com/problems/binary-tree-level-order-traversal/","difficulty":"medium"},{"title":"Lowest Common Ancestor of a Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w18-graphs', 18, 5, 'Graphs',
    'Graph revision covers traversal, topological order, shortest paths and connectivity.',
    '["Run BFS and DFS on adjacency lists.","Detect cycles in directed graphs.","Compute shortest paths with Dijkstra.","Count connected components."]'::jsonb,
    '["Adjacency lists","BFS and DFS","Topological order","Shortest paths","Connectivity"]'::jsonb,
    'Implement Java graph algorithms with List<Integer>[], ArrayDeque<Integer> and PriorityQueue<long[]>.',
    5,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Course Schedule","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule/","difficulty":"medium"},{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w18-mixed-medium-level-problems', 18, 6, 'Mixed medium-level problems',
    'Mixed medium revision builds fluency across patterns that are commonly asked in placement rounds.',
    '["Solve medium problems without hints.","Identify the pattern within the first few minutes.","Write clean Java code with clear invariants.","Review and explain each solution."]'::jsonb,
    '["Pattern fluency","Untimed then timed solving","Code clarity","Invariants","Solution review"]'::jsonb,
    'Implement Java solutions using HashMap, int[] and PriorityQueue while keeping helper methods small.',
    5,
    '[{"title":"Group Anagrams","platform":"leetcode","url":"https://leetcode.com/problems/group-anagrams/","difficulty":"medium"},{"title":"Product of Array Except Self","platform":"leetcode","url":"https://leetcode.com/problems/product-of-array-except-self/","difficulty":"medium"},{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w19-company-style-coding-assessments', 19, 1, 'Company-style coding assessments',
    'Company-style assessments combine several easy and medium problems in a single timed session.',
    '["Solve a mixed set of problems consecutively.","Manage time across varying difficulties.","Communicate assumptions while coding.","Test solutions before submitting."]'::jsonb,
    '["Mixed difficulty sets","Time budgeting","Problem statement reading","Testing","Submission hygiene"]'::jsonb,
    'Implement Java solutions quickly with standard library collections and consistent class and method structure.',
    5,
    '[{"title":"Two Sum","platform":"leetcode","url":"https://leetcode.com/problems/two-sum/","difficulty":"easy"},{"title":"3Sum","platform":"leetcode","url":"https://leetcode.com/problems/3sum/","difficulty":"medium"},{"title":"Merge Intervals","platform":"leetcode","url":"https://leetcode.com/problems/merge-intervals/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w19-timed-coding-tests', 19, 2, 'Timed coding tests',
    'Timed tests measure both correctness and speed, so a simple correct solution often beats a complex clever one.',
    '["Solve within a fixed time box.","Choose a robust approach over a fragile optimization.","Debug efficiently under time limits.","Prioritize edge cases after the main path works."]'::jsonb,
    '["Time boxing","Simple robust solutions","Debugging under pressure","Edge cases","Trade-off decisions"]'::jsonb,
    'Implement Java code in one pass using familiar patterns, then add null and boundary checks.',
    4,
    '[{"title":"Best Time to Buy and Sell Stock","platform":"leetcode","url":"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/","difficulty":"easy"},{"title":"Container With Most Water","platform":"leetcode","url":"https://leetcode.com/problems/container-with-most-water/","difficulty":"medium"},{"title":"House Robber","platform":"leetcode","url":"https://leetcode.com/problems/house-robber/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w19-interview-style-problems', 19, 3, 'Interview-style problems',
    'Interview-style problems require explaining the approach while implementing it cleanly in Java.',
    '["Verbalize the plan before coding.","Implement with descriptive names and invariants.","Walk through a small example aloud.","Respond to follow-up constraints."]'::jsonb,
    '["Communication","Code clarity","Example walkthrough","Follow-up questions","Complexity discussion"]'::jsonb,
    'Implement Java solutions in a single class with clear method signatures and small helper functions.',
    4,
    '[{"title":"Valid Anagram","platform":"leetcode","url":"https://leetcode.com/problems/valid-anagram/","difficulty":"easy"},{"title":"Binary Search","platform":"leetcode","url":"https://leetcode.com/problems/binary-search/","difficulty":"easy"},{"title":"Reverse Linked List","platform":"leetcode","url":"https://leetcode.com/problems/reverse-linked-list/","difficulty":"easy"}]'::jsonb
  ),
  (
    'w19-problem-solving-under-time-constraints', 19, 4, 'Problem-solving under time constraints',
    'Working under constraints requires fast pattern recognition and disciplined error checking.',
    '["Classify a problem within a few minutes.","Start with the simplest correct approach.","Use quick manual tests for boundaries.","Refactor only after tests pass."]'::jsonb,
    '["Fast classification","Simple first solution","Manual test cases","Boundary checks","Refactoring order"]'::jsonb,
    'Implement Java solutions with int[] and HashMap, then verify with hand-built small inputs.',
    4,
    '[{"title":"Move Zeroes","platform":"leetcode","url":"https://leetcode.com/problems/move-zeroes/","difficulty":"easy"},{"title":"Missing Number","platform":"leetcode","url":"https://leetcode.com/problems/missing-number/","difficulty":"easy"},{"title":"Maximum Subarray","platform":"leetcode","url":"https://leetcode.com/problems/maximum-subarray/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w20-mock-interviews', 20, 1, 'Mock interviews',
    'Mock interviews simulate real technical rounds with explanation, coding and follow-up discussion.',
    '["Complete a full interview simulation.","Explain trade-offs while coding.","Handle hints and follow-ups.","Record feedback and repeat weak areas."]'::jsonb,
    '["Simulation format","Think aloud","Follow-up handling","Feedback loop","Progress tracking"]'::jsonb,
    'Implement Java solutions during mocks using only core language features and standard collections.',
    4,
    '[{"title":"Number of Islands","platform":"leetcode","url":"https://leetcode.com/problems/number-of-islands/","difficulty":"medium"},{"title":"Course Schedule","platform":"leetcode","url":"https://leetcode.com/problems/course-schedule/","difficulty":"medium"},{"title":"LRU Cache","platform":"leetcode","url":"https://leetcode.com/problems/lru-cache/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w20-weak-topic-revision', 20, 2, 'Weak-topic revision',
    'Weak-topic revision targets the specific patterns that caused errors in earlier assessments.',
    '["Identify weak patterns from past attempts.","Re-study the underlying concept.","Solve two fresh problems per weak topic.","Re-test after one week."]'::jsonb,
    '["Error analysis","Targeted study","Fresh practice","Retesting","Progress notes"]'::jsonb,
    'Reimplement Java solutions for weak patterns from scratch, comparing with earlier attempts.',
    4,
    '[{"title":"Word Break","platform":"leetcode","url":"https://leetcode.com/problems/word-break/","difficulty":"medium"},{"title":"N-Queens","platform":"leetcode","url":"https://leetcode.com/problems/n-queens/","difficulty":"hard"},{"title":"Network Delay Time","platform":"leetcode","url":"https://leetcode.com/problems/network-delay-time/","difficulty":"medium"}]'::jsonb
  ),
  (
    'w20-mixed-dsa-assessments', 20, 3, 'Mixed DSA assessments',
    'Final mixed assessments measure readiness across arrays, trees, graphs, greedy and DP.',
    '["Complete a full mixed assessment.","Maintain accuracy across categories.","Explain each chosen approach.","Track score trends over time."]'::jsonb,
    '["Full-length assessment","Category coverage","Explanation quality","Score tracking","Final review"]'::jsonb,
    'Implement Java solutions under timed conditions with consistent structure and quick self-checks.',
    5,
    '[{"title":"Trapping Rain Water","platform":"leetcode","url":"https://leetcode.com/problems/trapping-rain-water/","difficulty":"hard"},{"title":"Top K Frequent Elements","platform":"leetcode","url":"https://leetcode.com/problems/top-k-frequent-elements/","difficulty":"medium"},{"title":"Serialize and Deserialize Binary Tree","platform":"leetcode","url":"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w20-final-progress-evaluation', 20, 4, 'Final progress evaluation',
    'Final evaluation measures problem-solving speed, correctness and conceptual coverage against the roadmap goals.',
    '["Review solved problems by topic and difficulty.","Measure time per problem category.","Identify remaining gaps.","Set a focused final study plan."]'::jsonb,
    '["Coverage audit","Timing metrics","Gap analysis","Study plan","Readiness checklist"]'::jsonb,
    'Reimplement a small set of difficult Java solutions without references to confirm independent mastery.',
    4,
    '[{"title":"Median of Two Sorted Arrays","platform":"leetcode","url":"https://leetcode.com/problems/median-of-two-sorted-arrays/","difficulty":"hard"},{"title":"Reverse Nodes in k-Group","platform":"leetcode","url":"https://leetcode.com/problems/reverse-nodes-in-k-group/","difficulty":"hard"},{"title":"Alien Dictionary","platform":"leetcode","url":"https://leetcode.com/problems/alien-dictionary/","difficulty":"hard"}]'::jsonb
  ),
  (
    'w20-placement-readiness-report', 20, 5, 'Placement readiness report',
    'The final report summarizes demonstrated skills and confirms readiness for placement coding rounds.',
    '["Summarize topic mastery with evidence.","List benchmark problems solved.","Assess explanation and code quality.","Document remaining risks and mitigation."]'::jsonb,
    '["Mastery summary","Evidence and benchmarks","Code quality review","Risk register","Next steps"]'::jsonb,
    'Prepare a Java portfolio snapshot of representative solutions with complexity notes and clean formatting.',
    3,
    '[{"title":"Sort Colors","platform":"leetcode","url":"https://leetcode.com/problems/sort-colors/","difficulty":"medium"},{"title":"Climbing Stairs","platform":"leetcode","url":"https://leetcode.com/problems/climbing-stairs/","difficulty":"easy"},{"title":"Daily Temperatures","platform":"leetcode","url":"https://leetcode.com/problems/daily-temperatures/","difficulty":"medium"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Totals: 20 roadmap_weeks rows and 120 roadmap_topics rows.
