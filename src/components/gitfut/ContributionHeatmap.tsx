"use client";

import React from "react";
import { ActivityCalendar } from "react-activity-calendar";

export default function ContributionHeatmap({ activityData }: { activityData?: any[] }) {
  if (!activityData) return <div className="glass-card" style={{ padding: "1.5rem" }}>Loading Heatmap...</div>;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Contribution Activity
      </h2>
      <div style={{ width: "100%", overflowX: "auto", paddingBottom: "0.5rem" }}>
        <div style={{ minWidth: "800px" }}>
          <ActivityCalendar
            data={activityData}
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            labels={{
              legend: {
                less: "Less",
                more: "More"
              },
              months: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              totalCount: "{{count}} contributions in the last year",
            }}
            colorScheme="light" // Enforce light theme to match neo-brutalist white/black
            showWeekdayLabels
          />
        </div>
      </div>
    </div>
  );
}
