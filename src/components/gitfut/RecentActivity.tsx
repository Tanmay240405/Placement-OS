import React from "react";

export default function RecentActivity({ recentActivity }: { recentActivity?: any[] }) {
  if (!recentActivity) return <div className="glass-card" style={{ padding: "1.5rem" }}>Loading Activity...</div>;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Recent Activity
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {recentActivity.map(group => (
          <div key={group.id}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase" }}>
              {group.dateGroup}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {group.events.map((event: any) => (
                <div key={event.id} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.25rem", marginTop: "2px" }}>{event.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{event.description}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      {event.repo} • {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
