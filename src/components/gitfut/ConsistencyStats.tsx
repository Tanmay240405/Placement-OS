import React from "react";

export default function ConsistencyStats({ stats }: { stats?: any }) {
  if (!stats) return <div className="glass-card" style={{ padding: "1.5rem" }}>Loading Consistency...</div>;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Your Consistency
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "var(--border-width) solid var(--border-color)", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔥</span>
            <span style={{ fontWeight: 700, textTransform: "uppercase" }}>Current Streak</span>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>{stats.currentStreak} days</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "var(--border-width) solid var(--border-color)", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🏆</span>
            <span style={{ fontWeight: 700, textTransform: "uppercase" }}>Longest Streak</span>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>{stats.longestStreak} days</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>📅</span>
            <span style={{ fontWeight: 700, textTransform: "uppercase" }}>Active Days</span>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>{stats.activeDaysThisMonth}/{stats.totalDaysThisMonth}</span>
        </div>
      </div>
    </div>
  );
}
