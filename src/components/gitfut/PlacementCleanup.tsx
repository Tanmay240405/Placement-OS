"use client";

import React from "react";

export default function PlacementCleanup({ cleanupTasks }: { cleanupTasks?: any }) {
  if (!cleanupTasks) return <div className="glass-card" style={{ padding: "1.5rem" }}>Loading Cleanup Tasks...</div>;

  const { summary, tasks } = cleanupTasks;
  const isAllClean = summary.missingReadme === 0 && summary.missingDescription === 0 && summary.missingTopics === 0;

  return (
    <div className="glass-card" style={{ padding: "1.5rem", borderLeft: isAllClean ? "4px solid var(--success)" : "4px solid var(--accent)" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Placement Cleanup
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
        {isAllClean 
          ? "All repositories look great! Good job keeping your profile clean." 
          : "Repositories missing key details for recruiters."}
      </p>

      {/* Summary Chips */}
      {!isAllClean && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {summary.missingReadme > 0 && (
            <span style={{ padding: "0.25rem 0.75rem", backgroundColor: "rgba(255, 60, 0, 0.1)", color: "var(--accent)", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
              {summary.missingReadme} Missing README
            </span>
          )}
          {summary.missingDescription > 0 && (
            <span style={{ padding: "0.25rem 0.75rem", backgroundColor: "rgba(255, 166, 0, 0.1)", color: "#ffa600", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
              {summary.missingDescription} No Description
            </span>
          )}
          {summary.missingTopics > 0 && (
            <span style={{ padding: "0.25rem 0.75rem", backgroundColor: "rgba(180, 180, 180, 0.1)", color: "var(--text-secondary)", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
              {summary.missingTopics} No Topics
            </span>
          )}
        </div>
      )}

      {/* Actionable List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {tasks.map((task: any) => (
          <a key={task.id} href={task.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
            <div style={{ padding: "1rem", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "var(--border-width) solid var(--border-color)", transition: "border-color 0.2s" }} 
                 onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                 onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{task.repoName}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                Missing: {task.issues.join(", ")}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
