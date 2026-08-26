import type { LeetCodeProfileResponse, LeetCodeStats } from './leetcodeTypes';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

const GET_USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`;

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  if (!username) return null;

  try {
    const response = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_USER_PROFILE_QUERY,
        variables: { username },
      }),
      // Revalidate frequently or rely on client cache
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`LeetCode API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as LeetCodeProfileResponse;
    const user = data?.data?.matchedUser;

    if (!user) {
      console.warn(`LeetCode user ${username} not found or data is empty.`);
      return null;
    }

    // Extract basic stats
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    user.submitStats.acSubmissionNum.forEach((stat) => {
      if (stat.difficulty === 'All') totalSolved = stat.count;
      if (stat.difficulty === 'Easy') easySolved = stat.count;
      if (stat.difficulty === 'Medium') mediumSolved = stat.count;
      if (stat.difficulty === 'Hard') hardSolved = stat.count;
    });

    // Extract tag counts
    const tagCounts: Record<string, number> = {};
    const allTags = [
      ...(user.tagProblemCounts.advanced || []),
      ...(user.tagProblemCounts.intermediate || []),
      ...(user.tagProblemCounts.fundamental || []),
    ];

    allTags.forEach((tag) => {
      // Keep track of solved count for each tag slug
      tagCounts[tag.tagSlug] = tag.problemsSolved;
    });

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      tagCounts,
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
}
