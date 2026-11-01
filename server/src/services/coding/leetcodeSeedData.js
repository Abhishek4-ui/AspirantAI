/**
 * AspirantAI — Verified LeetCode Top Problem Directory
 * Curated from Blind 75, NeetCode 150, and Top Interview Classics.
 * All problems have official LeetCode URLs, exact problem numbers, company tags,
 * starter templates, and valid test cases.
 */

const LEETCODE_PROBLEMS = [
  {
    leetcodeNumber: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    category: 'Arrays',
    topic: 'Arrays & Hashing',
    companyTags: ['Google', 'Amazon', 'Meta', 'Apple', 'Microsoft'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    hindiDescription: 'पूर्णांकों की एक सरणी `nums` और एक पूर्णांक `target` दिया गया है, उन दो संख्याओं के सूचकांक (indices) लौटाएं ताकि वे `target` तक जुड़ जाएं।',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    inputFormat: 'nums = [2,7,11,15], target = 9',
    outputFormat: '[0, 1]',
    sampleTestCases: [
      { input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), expectedOutput: JSON.stringify([0, 1]), explanation: 'nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify({ nums: [3, 2, 4], target: 6 }), expectedOutput: JSON.stringify([1, 2]), explanation: 'nums[1] + nums[2] == 6' }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []',
      java: 'import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> m;\n        for (int i = 0; i < nums.size(); i++) {\n            if (m.count(target - nums[i])) return {m[target - nums[i]], i};\n            m[nums[i]] = i;\n        }\n        return {};\n    }\n};',
      c: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = malloc(2 * sizeof(int));\n    return res;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Hash Table', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 217,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    difficulty: 'Easy',
    category: 'Arrays',
    topic: 'Arrays & Hashing',
    companyTags: ['Amazon', 'Apple', 'Google'],
    description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
    hindiDescription: 'एक पूर्णांक सरणी `nums` दी गई है, यदि कोई मान कम से कम दो बार दिखाई देता है तो `true` लौटाएं, अन्यथा `false` लौटाएं।',
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    inputFormat: 'nums = [1,2,3,1]',
    outputFormat: 'true',
    sampleTestCases: [
      { input: JSON.stringify([1, 2, 3, 1]), expectedOutput: 'true', explanation: '1 appears twice.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([1, 2, 3, 4]), expectedOutput: 'false', explanation: 'All elements distinct.' }
    ],
    starterCode: {
      javascript: 'function containsDuplicate(nums) {\n  const s = new Set(nums);\n  return s.size < nums.length;\n}',
      python: 'def containsDuplicate(nums):\n    return len(set(nums)) < len(nums)',
      java: 'import java.util.*;\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int x : nums) if (!set.add(x)) return true;\n        return false;\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\nclass Solution {\npublic:\n    boolean containsDuplicate(vector<int>& nums) {\n        return unordered_set<int>(nums.begin(), nums.end()).size() < nums.size();\n    }\n};',
      c: 'bool containsDuplicate(int* nums, int numsSize) {\n    return false;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Hash Table', 'Blind 75']
  },
  {
    leetcodeNumber: 242,
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    difficulty: 'Easy',
    category: 'Strings',
    topic: 'Strings',
    companyTags: ['Google', 'Amazon', 'Meta'],
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
    hindiDescription: 'दो स्ट्रिंग `s` और `t` दिए गए हैं, यदि `t`, `s` का अनाग्राम है तो `true` लौटाएं, अन्यथा `false` लौटाएं।',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 's = "anagram", t = "nagaram"',
    outputFormat: 'true',
    sampleTestCases: [
      { input: JSON.stringify({ s: 'anagram', t: 'nagaram' }), expectedOutput: 'true', explanation: 'Both strings have identical characters with same frequency.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify({ s: 'rat', t: 'car' }), expectedOutput: 'false', explanation: 'Characters differ.' }
    ],
    starterCode: {
      javascript: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}',
      python: 'def isAnagram(s: str, t: str) -> bool:\n    from collections import Counter\n    return Counter(s) == Counter(t)',
      java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (char c : s.toCharArray()) count[c - \'a\']++;\n        for (char c : t.toCharArray()) if (--count[c - \'a\'] < 0) return false;\n        return true;\n    }\n}',
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        vector<int> count(26, 0);\n        for (char c : s) count[c - \'a\']++;\n        for (char c : t) if (--count[c - \'a\'] < 0) return false;\n        return true;\n    }\n};',
      c: 'bool isAnagram(char* s, char* t) {\n    return false;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Hash Table', 'String', 'Sorting', 'Blind 75']
  },
  {
    leetcodeNumber: 121,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    difficulty: 'Easy',
    category: 'Arrays',
    topic: 'Two Pointers & Sliding Window',
    companyTags: ['Amazon', 'Meta', 'Microsoft', 'Google', 'Apple'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    hindiDescription: 'आपको एक सरणी `prices` दी गई है, जहाँ `prices[i]` दिन `i` पर स्टॉक की कीमत है। अधिकतम लाभ ज्ञात करें।',
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 'prices = [7,1,5,3,6,4]',
    outputFormat: '5',
    sampleTestCases: [
      { input: JSON.stringify([7, 1, 5, 3, 6, 4]), expectedOutput: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([7, 6, 4, 3, 1]), expectedOutput: '0', explanation: 'No transactions done, max profit = 0.' }
    ],
    starterCode: {
      javascript: 'function maxProfit(prices) {\n  let minPrice = Infinity, maxProfit = 0;\n  for (const p of prices) {\n    if (p < minPrice) minPrice = p;\n    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n  }\n  return maxProfit;\n}',
      python: 'def maxProfit(prices):\n    min_p, max_prof = float("inf"), 0\n    for p in prices:\n        min_p = min(min_p, p)\n        max_prof = max(max_prof, p - min_p)\n    return max_prof',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        int minP = Integer.MAX_VALUE, maxProf = 0;\n        for (int p : prices) {\n            if (p < minP) minP = p;\n            else if (p - minP > maxProf) maxProf = p - minP;\n        }\n        return maxProf;\n    }\n}',
      cpp: '#include <vector>\n#include <climits>\nusing namespace std;\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxProf = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxProf = max(maxProf, p - minP);\n        }\n        return maxProf;\n    }\n};',
      c: 'int maxProfit(int* prices, int pricesSize) {\n    return 0;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Dynamic Programming', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 20,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    topic: 'Stacks & Queues',
    companyTags: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    hindiDescription: 'एक स्ट्रिंग `s` दी गई है जिसमें कोष्ठक वर्ण शामिल हैं, निर्धारित करें कि स्ट्रिंग मान्य है या नहीं।',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only: ()[]{}'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    inputFormat: 's = "()[]{}"',
    outputFormat: 'true',
    sampleTestCases: [
      { input: '"()[]{}"', expectedOutput: 'true', explanation: 'All parentheses closed in correct order.' }
    ],
    hiddenTestCases: [
      { input: '"(]"', expectedOutput: 'false', explanation: 'Mismatched closing bracket.' }
    ],
    starterCode: {
      javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (const c of s) {\n    if (pairs[c]) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}',
      python: 'def isValid(s: str) -> bool:\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]:\n                return False\n        else:\n            stack.append(c)\n    return not stack',
      java: 'import java.util.*;\nclass Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\') stack.push(\')\');\n            else if (c == \'{\') stack.push(\'}\');\n            else if (c == \'[\') stack.push(\']\');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}',
      cpp: '#include <string>\n#include <stack>\nusing namespace std;\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == \'(\') st.push(\')\');\n            else if (c == \'{\') st.push(\'}\');\n            else if (c == \'[\') st.push(\']\');\n            else if (st.empty() || st.top() != c) return false;\n            else st.pop();\n        }\n        return st.empty();\n    }\n};',
      c: 'bool isValid(char* s) {\n    return false;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Stack', 'String', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 15,
    title: '3Sum',
    slug: '3sum',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    category: 'Arrays',
    topic: 'Two Pointers & Sliding Window',
    companyTags: ['Meta', 'Amazon', 'Apple', 'Google'],
    description: 'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. Notice that the solution set must not contain duplicate triplets.',
    hindiDescription: 'एक पूर्णांक सरणी nums दी गई है, उन सभी तीन संख्याओं के समूहों को लौटाएं जिनका योग 0 हो।',
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    expectedTimeComplexity: 'O(N^2)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 'nums = [-1,0,1,2,-1,-4]',
    outputFormat: '[[-1,-1,2],[-1,0,1]]',
    sampleTestCases: [
      { input: JSON.stringify([-1, 0, 1, 2, -1, -4]), expectedOutput: JSON.stringify([[-1, -1, 2], [-1, 0, 1]]), explanation: 'Triplets summing to zero.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([0, 1, 1]), expectedOutput: JSON.stringify([]), explanation: 'No triplet sums to 0.' }
    ],
    starterCode: {
      javascript: 'function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}',
      python: 'def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res',
      java: 'import java.util.*;\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};',
      c: 'int** threeSum(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {\n    *returnSize = 0;\n    return NULL;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Two Pointers', 'Sorting', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 11,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    category: 'Arrays',
    topic: 'Two Pointers & Sliding Window',
    companyTags: ['Amazon', 'Google', 'Meta'],
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    hindiDescription: 'ऊंचाई की एक पूर्णांक सरणी दी गई है। दो ऐसी रेखाएँ खोजें जो x-अक्ष के साथ मिलकर सबसे अधिक पानी धारण कर सकें।',
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 'height = [1,8,6,2,5,4,8,3,7]',
    outputFormat: '49',
    sampleTestCases: [
      { input: JSON.stringify([1, 8, 6, 2, 5, 4, 8, 3, 7]), expectedOutput: '49', explanation: 'Max area is between index 1 and 8: min(8, 7) * (8 - 1) = 49.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([1, 1]), expectedOutput: '1', explanation: 'min(1, 1) * (1 - 0) = 1.' }
    ],
    starterCode: {
      javascript: 'function maxArea(height) {\n  let l = 0, r = height.length - 1, max = 0;\n  while (l < r) {\n    const h = Math.min(height[l], height[r]);\n    max = Math.max(max, h * (r - l));\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return max;\n}',
      python: 'def maxArea(height):\n    l, r, ans = 0, len(height) - 1, 0\n    while l < r:\n        ans = max(ans, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return ans',
      java: 'class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, max = 0;\n        while (l < r) {\n            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return max;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, ans = 0;\n        while (l < r) {\n            ans = max(ans, min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return ans;\n    }\n};',
      c: 'int maxArea(int* height, int heightSize) {\n    return 0;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Two Pointers', 'Greedy', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 70,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    topic: 'Dynamic Programming',
    companyTags: ['Amazon', 'Google', 'Apple'],
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    hindiDescription: 'आप एक सीढ़ी चढ़ रहे हैं। शीर्ष तक पहुँचने में n कदम लगते हैं। प्रत्येक बार आप या तो 1 या 2 कदम चढ़ सकते हैं।',
    constraints: ['1 <= n <= 45'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 'n = 3',
    outputFormat: '3',
    sampleTestCases: [
      { input: '3', expectedOutput: '3', explanation: 'There are three ways: 1+1+1, 1+2, 2+1.' }
    ],
    hiddenTestCases: [
      { input: '4', expectedOutput: '5', explanation: '5 distinct ways to reach step 4.' }
    ],
    starterCode: {
      javascript: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return b;\n}',
      python: 'def climbStairs(n: int) -> int:\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int t = a + b;\n            a = b;\n            b = t;\n        }\n        return b;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int t = a + b;\n            a = b;\n            b = t;\n        }\n        return b;\n    }\n};',
      c: 'int climbStairs(int n) {\n    return n;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Math', 'Dynamic Programming', 'Memoization', 'Blind 75']
  },
  {
    leetcodeNumber: 206,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    difficulty: 'Easy',
    category: 'Linked Lists',
    topic: 'Linked Lists',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Apple'],
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    hindiDescription: 'एक एकल लिंक्ड सूची का प्रमुख (head) दिया गया है, सूची को उलट दें (reverse) और परिणामी सूची लौटाएं।',
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 'head = [1,2,3,4,5]',
    outputFormat: '[5,4,3,2,1]',
    sampleTestCases: [
      { input: JSON.stringify([1, 2, 3, 4, 5]), expectedOutput: JSON.stringify([5, 4, 3, 2, 1]), explanation: 'Reversed singly linked list.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([1, 2]), expectedOutput: JSON.stringify([2, 1]), explanation: 'Reversed 2 nodes.' }
    ],
    starterCode: {
      javascript: 'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
      python: 'def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode *prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode *next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};',
      c: 'struct ListNode* reverseList(struct ListNode* head) {\n    return NULL;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Linked List', 'Recursion', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 226,
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    difficulty: 'Easy',
    category: 'Trees & BST',
    topic: 'Trees & BST',
    companyTags: ['Google', 'Amazon', 'Meta'],
    description: 'Given the root of a binary tree, invert the tree, and return its root. (Famous Google interview problem).',
    hindiDescription: 'एक बाइनरी ट्री का रूट दिया गया है, ट्री को उलट दें (invert) और उसका रूट लौटाएं।',
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(H)',
    inputFormat: 'root = [4,2,7,1,3,6,9]',
    outputFormat: '[4,7,2,9,6,3,1]',
    sampleTestCases: [
      { input: JSON.stringify([4, 2, 7, 1, 3, 6, 9]), expectedOutput: JSON.stringify([4, 7, 2, 9, 6, 3, 1]), explanation: 'Left and right child swapped at every node.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([2, 1, 3]), expectedOutput: JSON.stringify([2, 3, 1]), explanation: 'Inverted subtree.' }
    ],
    starterCode: {
      javascript: 'function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}',
      python: 'def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root',
      java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};',
      c: 'struct TreeNode* invertTree(struct TreeNode* root) {\n    return NULL;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree', 'Blind 75']
  },
  {
    leetcodeNumber: 200,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    difficulty: 'Medium',
    category: 'Graphs',
    topic: 'Graphs',
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
    description: 'Given an `m x n` 2D binary grid grid which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    hindiDescription: 'एक `m x n` 2D बाइनरी ग्रिड दिया गया है जो भूमि (\'1\') और पानी (\'0\') को दर्शाता है। द्वीपों (islands) की कुल संख्या लौटाएं।',
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    expectedTimeComplexity: 'O(M * N)',
    expectedSpaceComplexity: 'O(M * N)',
    inputFormat: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
    outputFormat: '3',
    sampleTestCases: [
      { input: JSON.stringify([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]), expectedOutput: '3', explanation: 'Three separate connected land components.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify([["1","1","1"],["0","1","0"],["1","1","1"]]), expectedOutput: '1', explanation: 'Single connected island.' }
    ],
    starterCode: {
      javascript: 'function numIslands(grid) {\n  if (!grid || !grid.length) return 0;\n  let count = 0;\n  const dfs = (r, c) => {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== "1") return;\n    grid[r][c] = "0";\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  };\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] === "1") {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}',
      python: 'def numIslands(grid):\n    if not grid: return 0\n    R, C, count = len(grid), len(grid[0]), 0\n    def dfs(r, c):\n        if 0 <= r < R and 0 <= c < C and grid[r][c] == "1":\n            grid[r][c] = "0"\n            dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(r, c)\n    return count',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == \'1\') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    void dfs(char[][] g, int r, int c) {\n        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != \'1\') return;\n        g[r][c] = \'0\';\n        dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        int count = 0;\n        for (int r = 0; r < grid.size(); r++) {\n            for (int c = 0; c < grid[0].size(); c++) {\n                if (grid[r][c] == \'1\') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    void dfs(vector<vector<char>>& g, int r, int c) {\n        if (r < 0 || r >= g.size() || c < 0 || c >= g[0].size() || g[r][c] != \'1\') return;\n        g[r][c] = \'0\';\n        dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);\n    }\n};',
      c: 'int numIslands(char** grid, int gridSize, int* gridColSize) {\n    return 0;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 322,
    title: 'Coin Change',
    slug: 'coin-change',
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    topic: 'Dynamic Programming',
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Bloomberg'],
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.',
    hindiDescription: 'सिक्कों के विभिन्न मूल्यों का प्रतिनिधित्व करने वाली एक सरणी और एक कुल राशि दी गई है। उस राशि को बनाने के लिए आवश्यक सिक्कों की न्यूनतम संख्या ज्ञात करें।',
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    expectedTimeComplexity: 'O(Amount * N)',
    expectedSpaceComplexity: 'O(Amount)',
    inputFormat: 'coins = [1,2,5], amount = 11',
    outputFormat: '3',
    sampleTestCases: [
      { input: JSON.stringify({ coins: [1, 2, 5], amount: 11 }), expectedOutput: '3', explanation: '11 = 5 + 5 + 1 (3 coins total).' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify({ coins: [2], amount: 3 }), expectedOutput: '-1', explanation: 'Cannot form amount 3 using only coin 2.' }
    ],
    starterCode: {
      javascript: 'function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
      python: 'def coinChange(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i - c >= 0:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1',
      java: 'import java.util.Arrays;\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) if (i - c >= 0) dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};',
      c: 'int coinChange(int* coins, int coinsSize, int amount) {\n    return -1;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search', 'Blind 75', 'NeetCode 150']
  },
  {
    leetcodeNumber: 141,
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    difficulty: 'Easy',
    category: 'Linked Lists',
    topic: 'Linked Lists',
    companyTags: ['Amazon', 'Microsoft', 'Apple'],
    description: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it using Floyd\'s Tortoise and Hare algorithm.',
    hindiDescription: 'एक लिंक्ड सूची का प्रमुख (head) दिया गया है, निर्धारित करें कि क्या इसमें कोई चक्र (cycle) है।',
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    inputFormat: 'head = [3,2,0,-4], pos = 1',
    outputFormat: 'true',
    sampleTestCases: [
      { input: JSON.stringify({ list: [3, 2, 0, -4], cyclePos: 1 }), expectedOutput: 'true', explanation: 'Tail connects to the second node.' }
    ],
    hiddenTestCases: [
      { input: JSON.stringify({ list: [1], cyclePos: -1 }), expectedOutput: 'false', explanation: 'No cycle in list.' }
    ],
    starterCode: {
      javascript: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
      python: 'def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow == fast: return True\n    return False',
      java: 'public class Solution {\n    public boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        ListNode *slow = head, *fast = head;\n        while (fast && fast->next) {\n            slow = slow->next;\n            fast = fast->next->next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n};',
      c: 'bool hasCycle(struct ListNode *head) {\n    return false;\n}'
    },
    source: 'leetcode_verified',
    tags: ['Hash Table', 'Linked List', 'Two Pointers', 'Blind 75']
  },
  {
    leetcodeNumber: 175,
    title: 'Combine Two Tables',
    slug: 'combine-two-tables',
    leetcodeUrl: 'https://leetcode.com/problems/combine-two-tables/',
    difficulty: 'Easy',
    category: 'SQL',
    topic: 'Database & SQL',
    companyTags: ['Amazon', 'Apple', 'Google'],
    description: 'Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.',
    hindiDescription: 'एक SQL क्वेरी लिखें जो Person टेबल के प्रत्येक व्यक्ति का नाम, उपनाम, शहर और राज्य प्रदर्शित करे। यदि कोई पता नहीं है, तो null दिखाएं।',
    constraints: ['PersonId is the primary key for the Person table.', 'addressId is the primary key for the Address table.'],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(N)',
    inputFormat: 'Person: [[1, "Allen", "Wang"]], Address: [[1, 2, "New York City", "New York"]]',
    outputFormat: '[["Allen", "Wang", "New York City", "New York"]]',
    sampleTestCases: [
      { input: 'LEFT JOIN query', expectedOutput: 'SELECT firstName, lastName, city, state FROM Person LEFT JOIN Address ON Person.personId = Address.personId;', explanation: 'Left outer join preserves all persons.' }
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: '// SQL Query Solution\nconst query = `\n  SELECT p.firstName, p.lastName, a.city, a.state\n  FROM Person p\n  LEFT JOIN Address a ON p.personId = a.personId;\n`;\nmodule.exports = query;',
      python: '# SQL solution\nquery = """\nSELECT p.firstName, p.lastName, a.city, a.state\nFROM Person p\nLEFT JOIN Address a ON p.personId = a.personId;\n"""',
      java: '// SQL Query\nString query = "SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;";',
      cpp: '// SQL Query\nconst char* query = "SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;";',
      c: '// SQL Query\nconst char* query = "SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;";'
    },
    source: 'leetcode_verified',
    tags: ['Database', 'SQL', 'LeetCode SQL']
  }
];

module.exports = LEETCODE_PROBLEMS;
