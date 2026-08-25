import React from "react";

export default function TechStack({ techStack }: { techStack?: any[] }) {
  if (!techStack) return <div className="glass-card" style={{ padding: "1.5rem" }}>Loading Tech Stack...</div>;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Your Tech Stack
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {techStack.map(tech => (
          <div key={tech.language}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 700 }}>{tech.language}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{tech.percentage}%</span>
            </div>
            <div style={{ width: "100%", height: "12px", backgroundColor: "var(--bg-card)", border: "var(--border-width) solid var(--border-color)", boxShadow: "2px 2px 0px 0px #000000" }}>
              <div
                style={{
                  height: "100%",
                  width: `${tech.percentage}%`,
                  backgroundColor: "var(--accent-primary)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
