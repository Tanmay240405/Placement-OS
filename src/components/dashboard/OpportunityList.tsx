"use client";

import type { OpportunityWithRoles } from "@/types";
import OpportunityCard from "./OpportunityCard";

interface OpportunityListProps {
  opportunities: OpportunityWithRoles[];
  onStatusChange: (id: string, newStatus: string) => void;
  isLoading: boolean;
}

export default function OpportunityList({
  opportunities,
  onStatusChange,
  isLoading,
}: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ margin: "0 auto 1rem", width: "24px", height: "24px" }} />
        <p style={{ color: "var(--text-secondary)" }}>
          Loading opportunities...
        </p>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "var(--text-secondary)",
          }}
        >
          No opportunities found
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Try syncing your Superset emails or adjusting your filters.
        </p>
      </div>
    );
  }

  // Sort: Active opportunities first (by deadline), then expired
  const now = new Date();
  const sorted = [...opportunities].sort((a, b) => {
    const aExpired = a.deadlineDatetime
      ? new Date(a.deadlineDatetime).getTime() < now.getTime()
      : false;
    const bExpired = b.deadlineDatetime
      ? new Date(b.deadlineDatetime).getTime() < now.getTime()
      : false;

    // Expired goes to bottom
    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;

    return 0;
  });

  return (
    <div className="grid-opportunities stagger-children">
      {sorted.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
