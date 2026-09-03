export const mockStats = {
  currentStreak: 8,
  longestStreak: 21,
  activeDaysThisMonth: 18,
  totalDaysThisMonth: 24,
  totalContributions: 342,
  totalRepositories: 18,
  activeProjects: 5,
};

export const mockRecentActivity = [
  {
    id: "1",
    dateGroup: "Today",
    events: [
      { id: "e1", description: "Pushed 3 commits to Placement OS", repo: "Placement OS", time: "2 hours ago", icon: "🔥" },
      { id: "e2", description: "Updated Resume Forge AI", repo: "Resume Forge AI", time: "5 hours ago", icon: "✨" },
    ],
  },
  {
    id: "2",
    dateGroup: "Yesterday",
    events: [
      { id: "e3", description: "Created repository placement-os", repo: "placement-os", time: "Yesterday", icon: "📦" },
    ],
  },
  {
    id: "3",
    dateGroup: "3 Days Ago",
    events: [
      { id: "e4", description: "Pushed 5 commits to Paint By Numbers", repo: "Paint By Numbers", time: "3 Days Ago", icon: "🔥" },
    ],
  }
];

export const mockTechStack = [
  { language: "TypeScript", percentage: 42, color: "#3178c6" },
  { language: "JavaScript", percentage: 28, color: "#f1e05a" },
  { language: "Python", percentage: 18, color: "#3572A5" },
  { language: "C++", percentage: 8, color: "#f34b7d" },
  { language: "Other", percentage: 4, color: "#ededed" },
];

export const mockCleanupTasks = {
  summary: {
    missingReadme: 3,
    missingDescription: 2,
    missingTopics: 4,
  },
  tasks: [
    {
      id: "t1",
      repoName: "Football Management",
      issues: ["README", "Repository description"],
      link: "#"
    },
    {
      id: "t2",
      repoName: "Old Project",
      issues: ["README"],
      link: "#"
    }
  ]
};

// Mock data for the activity calendar
const today = new Date();
export const mockActivityData = Array.from({ length: 365 }).map((_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() - (364 - i));
  
  // Deterministic count based on index to prevent hydration mismatch
  const count = (i % 7 === 0 || i % 11 === 0) ? 0 : (i * 13) % 6; 
  
  return {
    date: date.toISOString().split("T")[0],
    count: count,
    level: count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4,
  };
});
