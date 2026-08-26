export interface LeetCodeProfileResponse {
  data: {
    matchedUser: {
      username: string;
      submitStats: {
        acSubmissionNum: {
          difficulty: string;
          count: number;
          submissions: number;
        }[];
      };
      tagProblemCounts: {
        advanced: {
          tagName: string;
          tagSlug: string;
          problemsSolved: number;
        }[];
        intermediate: {
          tagName: string;
          tagSlug: string;
          problemsSolved: number;
        }[];
        fundamental: {
          tagName: string;
          tagSlug: string;
          problemsSolved: number;
        }[];
      };
    };
  };
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  tagCounts: Record<string, number>;
}
