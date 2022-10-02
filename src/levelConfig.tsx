interface problemInputOutput {
    input: any;
    output: any;
}

interface levelInfo {
    title: string;
    leetcodeLink: string;
    description: string;
    difficulty: string;
    testCase?: Array<problemInputOutput>;
    code: Array<string>;
}

interface IReviseCount {
    [key: string]: number;
}

const levelTitle: Map<string, levelInfo> = new Map();

levelTitle.set('1', {
    title: 'Two Sum',
    leetcodeLink: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.',
    code: [
        `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
`,
        `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        m = defaultdict(int)
`,
        `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        m = defaultdict(int)
        for i in range(len(nums)):
            if(target-nums[i] in m):
`,
        `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        m = defaultdict(int)
        for i in range(len(nums)):
            if(target-nums[i] in m):
                return [m[target-nums[i]], i]
            m[nums[i]] = i
`,
    ],
} as levelInfo);

levelTitle.set('2', {
    title: '3 Sum',
    leetcodeLink: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    description: `
Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
Notice that the solution set must not contain duplicate triplets.
`,
    code: [
        `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
`,
        `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        # print(nums)
        res = []
        target = 0
        for i in range(n-2):
            if(i>0 and nums[i] == nums[i-1]):
                continue
            l = i+1
            r = n-1
            while(l<r):
`,
        `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        # print(nums)
        res = []
        target = 0
        for i in range(n-2):
            if(i>0 and nums[i] == nums[i-1]):
                continue
            l = i+1
            r = n-1
            while(l<r):
                _sum = nums[i]+nums[l]+nums[r]
                if(_sum == target):
                    res.append((nums[i], nums[l], nums[r]))
                    l+=1
                    while(l<r and nums[l] == nums[l-1]):
                        l+=1
                elif(_sum < target):
                    l += 1
                    while(l<r and nums[l] == nums[l-1]):
                        l+=1
                else:
`,
        `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        n = len(nums)
        # print(nums)
        res = []
        target = 0
        for i in range(n-2):
            if(i>0 and nums[i] == nums[i-1]):
                continue
            l = i+1
            r = n-1
            while(l<r):
                _sum = nums[i]+nums[l]+nums[r]
                if(_sum == target):
                    res.append((nums[i], nums[l], nums[r]))
                    l+=1
                    while(l<r and nums[l] == nums[l-1]):
                        l+=1
                elif(_sum < target):
                    l += 1
                    while(l<r and nums[l] == nums[l-1]):
                        l+=1
                else:
                    r -= 1
                    while(l<r and nums[r] == nums[r+1]):
                        r-=1
        return res
`,
    ],
} as levelInfo);

levelTitle.set('3', {
    title: 'Find Peak Element',
    leetcodeLink: 'https://leetcode.com/problems/find-peak-element/',
    difficulty: 'Medium',
    description: `
A peak element is an element that is strictly greater than its neighbors.

Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.

You may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.

You must write an algorithm that runs in O(log n) time.
`,
    code: [
        `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
`,
        `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        nums = [-inf]+nums+[-inf]
        n = len(nums)
        l = 1
        r = n-2
        res = 1
        while(l<=r):
`,
        `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        nums = [-inf]+nums+[-inf]
        n = len(nums)
        l = 1
        r = n-2
        res = 1
        while(l<=r):
            m = (l+r)//2
            if(nums[m]>nums[m-1] and nums[m]>nums[m+1]):
                res = m
                break
            elif(nums[m]<=nums[m-1]):
`,
        `class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        nums = [-inf]+nums+[-inf]
        n = len(nums)
        l = 1
        r = n-2
        res = 1
        while(l<=r):
            m = (l+r)//2
            if(nums[m]>nums[m-1] and nums[m]>nums[m+1]):
                res = m
                break
            elif(nums[m]<=nums[m-1]):
                r = m - 1
            else:
                l = m + 1
        return res-1
`,
    ],
} as levelInfo);

levelTitle.set('4', {
    title: 'Combination Sum',
    leetcodeLink: 'https://leetcode.com/problems/combination-sum/',
    difficulty: 'Medium',
    description: `
Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.
    `,
    code: [
        `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
`,
        `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        n = len(candidates)
        res = set()
        def helper(start, arr):
            tmp = sum(arr)
            if(tmp == target):
                res.add(tuple(arr))
`,
        `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        n = len(candidates)
        res = set()
        def helper(start, arr):
            tmp = sum(arr)
            if(tmp == target):
                res.add(tuple(arr))
            if(tmp < target):
                for i in range(start, n):
`,
        `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        n = len(candidates)
        res = set()
        def helper(start, arr):
            tmp = sum(arr)
            if(tmp == target):
                res.add(tuple(arr))
            if(tmp < target):
                for i in range(start, n):
                    arr.append(candidates[i])
                    helper(i, arr)
                    arr.pop()
        helper(0,[])
        return res
`,
    ],
} as levelInfo);

levelTitle.set('5', {
    title: 'Permutations',
    leetcodeLink: 'https://leetcode.com/problems/permutations/',
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    difficulty: 'Medium',
    testCase: [
        {
            input: [1, 2, 3],
            output: [
                [1, 2, 3],
                [1, 3, 2],
                [2, 1, 3],
                [2, 3, 1],
                [3, 1, 2],
                [3, 2, 1],
            ],
        },
        {
            input: [0, 1],
            output: [
                [0, 1],
                [1, 0],
            ],
        },
    ],
    code: [
        `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
`,
        `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        res = []
        def helper(arr):
            if(len(arr) == n):
                res.append(arr.copy())
`,
        `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        res = []
        def helper(arr):
            if(len(arr) == n):
                res.append(arr.copy())
            for i in range(0, n):
                if(nums[i] not in arr):
                    arr.append(nums[i])
                    helper(arr)
                    arr.pop()
        helper([])
        return res
`,
        `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        res = []
        def helper(arr):
            if(len(arr) == n):
                res.append(arr.copy())
            for i in range(0, n):
                if(nums[i] not in arr):
                    arr.append(nums[i])
                    helper(arr)
                    arr.pop()
        helper([])
        return res
`,
    ],
} as levelInfo);

levelTitle.set('6', {
    title: 'Merge k Sorted Lists',
    leetcodeLink: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    difficulty: 'Hard',
    testCase: [
        {
            input: [
                [1, 4, 5],
                [1, 3, 4],
                [2, 6],
            ],
            output: [1, 1, 2, 3, 4, 4, 5, 6],
        },
    ],
    code: [
        `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
`,
        `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
from heapq import heapify, heappush, heappop
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        l = []
        for head in lists:
            while(head):
                heappush(l, head.val)
                head = head.next 
`,
        `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
from heapq import heapify, heappush, heappop
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        l = []
        for head in lists:
            while(head):
                heappush(l, head.val)
                head = head.next 
        # print(l)
        prev = ListNode()
        now = prev
        while(l):
            val  = heappop(l)
            tmp = ListNode(val)
`,
        `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
from heapq import heapify, heappush, heappop
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        l = []
        for head in lists:
            while(head):
                heappush(l, head.val)
                head = head.next 
        # print(l)
        prev = ListNode()
        now = prev
        while(l):
            val  = heappop(l)
            tmp = ListNode(val)
            now.next = tmp
            now = now.next
        return prev.next
    `,
    ],
} as levelInfo);

levelTitle.set('7', {
    title: 'Ugly Number II',
    leetcodeLink: 'https://leetcode.com/problems/ugly-number-ii/',
    description: `An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5.

Given an integer n, return the nth ugly number.`,
    difficulty: 'Medium',
    code: [
        `class Solution:
    def nthUglyNumber(self, n: int) -> int:
    `,
        `class Solution:
    def nthUglyNumber(self, n: int) -> int:
        i,j,k = [0,0,0]
        now = (2**i) * (3**j) * (5**k)
        res = [now]
        while(len(res)<n):
    `,
        `class Solution:
    def nthUglyNumber(self, n: int) -> int:
        i,j,k = [0,0,0]
        now = (2**i) * (3**j) * (5**k)
        res = [now]
        while(len(res)<n):
            tmp = min(res[i]*2, res[j]*3, res[k]*5)
            res.append(tmp)
            if(tmp==res[i]*2):
                i+=1
            if(tmp==res[j]*3):
                j+=1`,
        `class Solution:
    def nthUglyNumber(self, n: int) -> int:
        i,j,k = [0,0,0]
        now = (2**i) * (3**j) * (5**k)
        res = [now]
        while(len(res)<n):
            tmp = min(res[i]*2, res[j]*3, res[k]*5)
            res.append(tmp)
            if(tmp==res[i]*2):
                i+=1
            if(tmp==res[j]*3):
                j+=1
            if(tmp == res[k]*5):
                k+=1
        return res[-1]
    `,
    ],
});

levelTitle.set('8', {
    title: 'Edit Distance',
    leetcodeLink: 'https://leetcode.com/problems/edit-distance/',
    difficulty: 'Hard',
    description: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted on a word:

Insert a character
Delete a character
Replace a character`,
    code: [
        `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:`,
        `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m = len(word1)
        n = len(word2)
        dp = [[0]*(n+1) for i in range(m+1)]`,
        `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m = len(word1)
        n = len(word2)
        dp = [[0]*(n+1) for i in range(m+1)]
        for i in range(m+1):
            for j in range(n+1):
                if(i==0 or j==0):
                    dp[i][j] = max(i,j)`,
        `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m = len(word1)
        n = len(word2)
        dp = [[0]*(n+1) for i in range(m+1)]
        for i in range(m+1):
            for j in range(n+1):
                if(i==0 or j==0):
                    dp[i][j] = max(i,j)
                elif(word1[i-1] == word2[j-1]):
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
        return dp[m][n]`,
    ],
});

levelTitle.set('9', {
    title: 'Trapping Rain Water',
    leetcodeLink: 'https://leetcode.com/problems/trapping-rain-water/',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    difficulty: 'Hard',
    code: [
        `class Solution:
    def trap(self, height: List[int]) -> int:`,
        `class Solution:
    def trap(self, height: List[int]) -> int:
        res = 0
        cur = 0
        st = []
        n = len(height)
        while(cur < n):`,
        `class Solution:
    def trap(self, height: List[int]) -> int:
        res = 0
        cur = 0
        st = []
        n = len(height)
        while(cur < n):
            while(len(st)>0 and height[cur]>height[st[-1]]):
                top = st[-1]
                st.pop()
                if(len(st)==0):
                    break
                dis = cur - st[-1] - 1`,
        `class Solution:
    def trap(self, height: List[int]) -> int:
        res = 0
        cur = 0
        st = []
        n = len(height)
        while(cur < n):
            while(len(st)>0 and height[cur]>height[st[-1]]):
                top = st[-1]
                st.pop()
                if(len(st)==0):
                    break
                dis = cur - st[-1] - 1
                bounded_height = min(height[cur], height[st[-1]]) - height[top]
                res += bounded_height * dis
            st.append(cur)
            cur+=1
        return res`,
    ],
});

levelTitle.set('10', {
    title: 'Max Score from Operations',
    leetcodeLink:
        'https://leetcode.com/problems/maximum-score-from-performing-multiplication-operations/',
    difficulty: 'Hard',
    description: `You are given two 0-indexed integer arrays nums and multipliers of size n and m respectively, where n >= m.

You begin with a score of 0. You want to perform exactly m operations. On the ith operation (0-indexed) you will:

Choose one integer x from either the start or the end of the array nums.
Add multipliers[i] * x to your score.
Note that multipliers[0] corresponds to the first operation, multipliers[1] to the second operation, and so on.
Remove x from nums.
Return the maximum score after performing m operations.`,
    code: [
        `class Solution:
    def maximumScore(self, nums: List[int], multipliers: List[int]) -> int:`,
        `class Solution:
    def maximumScore(self, nums: List[int], multipliers: List[int]) -> int:
        mul = multipliers
        m = len(mul)
        n = len(nums)
        # 1-D dp
        dp = [0] * (m+1)`,
        `class Solution:
    def maximumScore(self, nums: List[int], multipliers: List[int]) -> int:
        mul = multipliers
        m = len(mul)
        n = len(nums)
        # 1-D dp
        dp = [0] * (m+1)
        for i in range(m-1, -1, -1):
            next_row = dp.copy()
            for left in range(i, -1, -1):`,
        `class Solution:
    def maximumScore(self, nums: List[int], multipliers: List[int]) -> int:
        mul = multipliers
        m = len(mul)
        n = len(nums)
        # 1-D dp
        dp = [0] * (m+1)
        for i in range(m-1, -1, -1):
            next_row = dp.copy()
            for left in range(i, -1, -1):
                dp[left] = max(mul[i]*nums[left] + next_row[left+1], mul[i]*nums[n-1-(i-left)] + next_row[left])
        return dp[0]`,
    ],
});

const complainMessage = [
    'Yes, algorithm is not easy!',
    'Complain is not a good way to solve it.',
    'Not easy to solve it, but you can do it!',
    'You can do it!',
    "Wanna be a Master of Algorithm? That's hard",
    'Not everyone can solve it quickly',
    'Take a deep breath, and try it again',
];

const reviseCountLevel: IReviseCount = {
    '1': 1,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 4,
    '7': 4,
    '8': 5,
    '9': 5,
    '10': 5,
};

const rewardChance = ['revise', 'refresh', 'nothing', 'nothing', 'nothing'];

export { levelTitle, complainMessage, reviseCountLevel, rewardChance };
