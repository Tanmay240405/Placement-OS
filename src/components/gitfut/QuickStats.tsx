import React from "react";

export default function QuickStats({ stats }: { stats?: any }) {
  if (!stats) return <div className="glass-card" style={{ padding: "1.5rem" }}>Loading Quick Stats...</div>;

  // Active Projects is manual, so we could pull from localStorage, but for now we'll just mock it or read it if we pass it down
  // However, QuickStats is server rendered. ActiveProjects is local storage. 
  // We can just keep it at 5 or leave it empty/placeholder until hydration
  
  return (
    <div className="grid-stats">
      <div className="stat-card">
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔥</div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase" }}>Current Streak</div>
        <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.currentStreak} Days</div>
      </div>
      <div className="stat-card">
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💻</div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase" }}>Total Contributions</div>
        <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.totalContributions}</div>
      </div>
      <div className="stat-card">
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦</div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase" }}>Total Repositories</div>
        <div style={{ fontSize: "2rem", fontWeight: 800 }}>{stats.totalRepositories}</div>
      </div>
      <div className="stat-card">
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚀</div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase" }}>Active Projects</div>
        <div style={{ fontSize: "2rem", fontWeight: 800 }}>Manual</div>
      </div>
    </div>
  );
}
