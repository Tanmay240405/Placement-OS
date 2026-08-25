const GITHUB_PAT = process.env.GITHUB_PAT;
const USERNAME = "Tanmay240405";

async function fetchGraphQL(query: string, variables: any = {}) {
  if (!GITHUB_PAT) {
    console.warn("GITHUB_PAT is not set in environment variables");
    return null;
  }
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${GITHUB_PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limits
  });

  if (!res.ok) {
    console.error("GitHub API error", await res.text());
    return null;
  }

  const json = await res.json();
  if (json.errors) {
    console.error("GitHub GraphQL Errors:", json.errors);
    return null;
  }
  return json.data;
}

export async function getGithubData() {
  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            pushedAt
            repositoryTopics(first: 5) {
              nodes {
                topic {
                  name
                }
              }
            }
            object(expression: "HEAD:README.md") {
              ... on Blob {
                byteSize
              }
            }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { userName: USERNAME });
  if (!data || !data.user) return null;
  return data.user;
}

export async function fetchGithubRecentActivity() {
  if (!GITHUB_PAT) return [];
  const res = await fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`, {
    headers: {
      "Authorization": `token ${GITHUB_PAT}`,
      "Accept": "application/vnd.github.v3+json"
    },
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) return [];
  const events = await res.json();
  
  const groupedEvents: Record<string, any[]> = {};
  
  events.forEach((event: any) => {
    if (event.type !== "PushEvent" && event.type !== "CreateEvent") return;
    
    const date = new Date(event.created_at);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === date.toDateString();
    
    let dateGroup = "Older";
    if (isToday) dateGroup = "Today";
    else if (isYesterday) dateGroup = "Yesterday";
    else dateGroup = `${Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24))} Days Ago`;

    if (!groupedEvents[dateGroup]) groupedEvents[dateGroup] = [];
    
    let description = "";
    let icon = "🚀";
    if (event.type === "PushEvent") {
      const commits = event.payload.commits?.length || 0;
      description = `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${event.repo.name.split('/')[1]}`;
      icon = "🔥";
    } else if (event.type === "CreateEvent") {
      description = `Created repository ${event.repo.name.split('/')[1]}`;
      icon = "📦";
    }

    if (groupedEvents[dateGroup].length < 5) {
      groupedEvents[dateGroup].push({
        id: event.id,
        description,
        repo: event.repo.name.split('/')[1],
        time: dateGroup,
        icon
      });
    }
  });

  return Object.keys(groupedEvents).map((key, i) => ({
    id: i.toString(),
    dateGroup: key,
    events: groupedEvents[key]
  })).slice(0, 3);
}

export function processGithubData(userData: any) {
  if (!userData) return null;

  // 1. Heatmap Data
  const calendar = userData.contributionsCollection.contributionCalendar;
  const activityData: any[] = [];
  const levelMap: Record<string, number> = {
    "NONE": 0,
    "FIRST_QUARTILE": 1,
    "SECOND_QUARTILE": 2,
    "THIRD_QUARTILE": 3,
    "FOURTH_QUARTILE": 4
  };

  calendar.weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      activityData.push({
        date: day.date,
        count: day.contributionCount,
        level: levelMap[day.contributionLevel] || 0
      });
    });
  });

  // 2. Consistency Stats
  let currentStreak = 0;
  let longestStreak = 0;
  let activeDaysThisMonth = 0;
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Iterate backwards through the activity data to find streak
  const reversedData = [...activityData].reverse();
  
  let currentCounting = true;
  let tempStreak = 0;

  reversedData.forEach((day: any) => {
    const dayDate = new Date(day.date);
    
    // Check active days this month
    if (dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear) {
      if (day.count > 0) activeDaysThisMonth++;
    }

    // Streak logic
    if (day.count > 0) {
      tempStreak++;
      if (currentCounting) currentStreak = tempStreak;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      // If it's today and count is 0, we don't break the current streak yet
      if (dayDate.toDateString() === today.toDateString()) {
        // do nothing
      } else {
        currentCounting = false;
        tempStreak = 0;
      }
    }
  });

  const totalDaysThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 3. Tech Stack
  const languageBytes: Record<string, { size: number, color: string }> = {};
  let totalBytes = 0;
  
  userData.repositories.nodes.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      const name = edge.node.name;
      const size = edge.size;
      const color = edge.node.color;
      
      if (!languageBytes[name]) {
        languageBytes[name] = { size: 0, color };
      }
      languageBytes[name].size += size;
      totalBytes += size;
    });
  });

  const techStack = Object.keys(languageBytes)
    .map(name => ({
      language: name,
      percentage: Math.round((languageBytes[name].size / totalBytes) * 100),
      color: languageBytes[name].color
    }))
    .filter(tech => tech.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  // Group <2% into "Other"
  const mainTech = techStack.filter(t => t.percentage >= 2);
  const otherTech = techStack.filter(t => t.percentage < 2);
  if (otherTech.length > 0) {
    const otherPercent = otherTech.reduce((sum, t) => sum + t.percentage, 0);
    mainTech.push({ language: "Other", percentage: otherPercent, color: "#ededed" });
  }

  // 4. Placement Cleanup
  const cleanupTasks: any[] = [];
  let missingReadme = 0;
  let missingDescription = 0;
  let missingTopics = 0;

  userData.repositories.nodes.forEach((repo: any) => {
    const issues: string[] = [];
    
    if (!repo.object) {
      issues.push("README");
      missingReadme++;
    }
    if (!repo.description) {
      issues.push("Repository description");
      missingDescription++;
    }
    if (repo.repositoryTopics.nodes.length === 0) {
      issues.push("Repository topics");
      missingTopics++;
    }

    if (issues.length > 0) {
      cleanupTasks.push({
        id: repo.name,
        repoName: repo.name,
        issues,
        link: `https://github.com/${USERNAME}/${repo.name}/settings`
      });
    }
  });

  return {
    activityData,
    stats: {
      currentStreak,
      longestStreak,
      activeDaysThisMonth,
      totalDaysThisMonth,
      totalContributions: calendar.totalContributions,
      totalRepositories: userData.repositories.totalCount,
    },
    techStack: mainTech.slice(0, 5),
    cleanupTasks: {
      summary: { missingReadme, missingDescription, missingTopics },
      tasks: cleanupTasks.slice(0, 5) // Top 5
    }
  };
}
