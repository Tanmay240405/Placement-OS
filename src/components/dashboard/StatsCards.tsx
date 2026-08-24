"use client";

import type { OpportunityWithRoles } from "@/types";

interface StatsCardsProps {
  opportunities: OpportunityWithRoles[];
}

export default function StatsCards({ opportunities }: StatsCardsProps) {
  const total = opportunities.length;
  const notRegistered = opportunities.filter(
    (o) => o.status === "NOT_REGISTERED"
  ).length;
  const registered = opportunities.filter(
    (o) => o.status === "REGISTERED"
  ).length;

  const now = new Date();
  const upcomingDeadlines = opportunities.filter((o) => {
    if (!o.deadlineDatetime) return false;
    const deadline = new Date(o.deadlineDatetime);
    return deadline.getTime() > now.getTime();
  }).length;

  const stats = [
    {
      label: "Total Opportunities",
      value: total,
      icon: "📊",
      color: "var(--accent-primary)",
    },
    {
      label: "Not Registered",
      value: notRegistered,
      icon: "⚡",
      color: "var(--status-not-registered)",
    },
    {
      label: "Registered",
      value: registered,
      icon: "✅",
      color: "var(--status-registered)",
    },
    {
      label: "Upcoming Deadlines",
      value: upcomingDeadlines,
      icon: "📅",
      color: "var(--accent-secondary)",
    },
  ];

  return (
    <div className="grid-stats stagger-children">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              {stat.label}
            </span>
            <span style={{ fontSize: "1.25rem" }}>{stat.icon}</span>
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: stat.color,
              lineHeight: 1,
            }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
