# def solve(n, s):
#     dp = [[0] * n for _ in range(n)]
#     for i in range(n - 1, -1, -1):
#         for j in range(i + 1, n):
#             if s[i] == s[j]:
#                 dp[i][j] = dp[i + 1][j - 1] + 2
#             else:
#                 dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
#     result = n - dp[0][n - 1]
#     if result >= n:
#         return -1
#     return result


# t = int(input().strip())
# for _ in range(t):
#     n = int(input().strip())
#     s = input().strip()
#     print(solve(n, s))


# for i in range(int(input())):
#     n = int(input())
#     s = input()
#     d = {}
#     for i in s:
#         d.setdefault(i, 0)
#         d[i] += 1
#         ps = 0
#     for k, v in d.items():
#         if v >= 2:
#             ps = 2
#             break
#     if (ps == 0):
#         print(-1)
#     else:
#         print(len(s)-ps)


import heapq

arr = [10, 5, 5, 7, 0, 1, 0, 4, 7, 9, 4]
arr = set(arr)
arr = list(arr)
arr.sort()
arr.remove(0)
print(arr[:3])
