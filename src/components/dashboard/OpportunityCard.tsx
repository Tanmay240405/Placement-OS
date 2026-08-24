"use client";

import type { OpportunityWithRoles } from "@/types";
import { getDeadlineStatus, formatDeadlineDate } from "@/lib/utils/deadlineStatus";
import { useState } from "react";

interface OpportunityCardProps {
  opportunity: OpportunityWithRoles;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function OpportunityCard({
  opportunity,
  onStatusChange,
}: OpportunityCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const deadlineStatus = getDeadlineStatus(opportunity.deadlineDatetime);
  const isExpired = deadlineStatus.type === "expired";
  const isRegistered = opportunity.status === "REGISTERED";

  const handleStatusToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    const newStatus = isRegistered ? "NOT_REGISTERED" : "REGISTERED";

    try {
      const res = await fetch(`/api/opportunities/${opportunity.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        onStatusChange(opportunity.id, newStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`opportunity-card ${isExpired ? "expired" : ""}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Company & Roles */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          {/* Company Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.125rem" }}>🏢</span>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {opportunity.companyName || "Unknown Company"}
            </h3>
          </div>

          {/* Roles */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "0.75rem",
            }}
          >
            {opportunity.roles.length > 0 ? (
              opportunity.roles.map((role) => (
                <span key={role.id} className="badge badge-role">
                  {role.roleName}
                </span>
              ))
            ) : (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                No roles specified
              </span>
            )}
          </div>

          {/* Category & Deadline Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {opportunity.category && (
              <span className="badge badge-category">
                🏷 {opportunity.category}
              </span>
            )}

            {/* Deadline */}
            <DeadlineDisplay deadlineStatus={deadlineStatus} deadline={opportunity.deadlineDatetime} />
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            minWidth: "160px",
          }}
        >
          {/* Status Badge */}
          <span
            className={`badge ${
              isExpired
                ? "badge-expired"
                : isRegistered
                  ? "badge-registered"
                  : "badge-not-registered"
            }`}
          >
            {isExpired
              ? "Expired"
              : isRegistered
                ? "✓ Registered"
                : "Not Registered"}
          </span>

          {/* Status Toggle */}
          <button
            onClick={handleStatusToggle}
            disabled={isUpdating}
            className={`btn btn-sm ${isRegistered ? "btn-warning" : "btn-success"}`}
            id={`status-toggle-${opportunity.id}`}
          >
            {isUpdating ? (
              <span className="spinner" />
            ) : isRegistered ? (
              "Mark as Not Registered"
            ) : (
              "Mark as Registered"
            )}
          </button>

          {/* Apply Button */}
          {opportunity.applicationUrl && (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              id={`apply-btn-${opportunity.id}`}
            >
              Apply on Superset ↗
            </a>
          )}
        </div>
      </div>

      {/* Email Subject (subtle footer) */}
      {opportunity.emailSubject && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          📧 {opportunity.emailSubject}
        </div>
      )}
    </div>
  );
}

function DeadlineDisplay({
  deadlineStatus,
  deadline,
}: {
  deadlineStatus: ReturnType<typeof getDeadlineStatus>;
  deadline: Date | string | null;
}) {
  if (deadlineStatus.type === "unknown") {
    return (
      <span
        className="badge"
        style={{
          background: "#ffffff",
          color: "#737373",
          border: "2px dashed #737373",
          boxShadow: "none",
        }}
      >
        ⏰ No deadline found
      </span>
    );
  }

  if (deadlineStatus.type === "expired") {
    return (
      <span className="badge badge-expired">
        ⏰ Expired
        {deadline && (
          <span style={{ marginLeft: "4px", opacity: 0.7 }}>
            ({formatDeadlineDate(new Date(deadline))})
          </span>
        )}
      </span>
    );
  }

  if (deadlineStatus.type === "urgent") {
    return (
      <span className="badge badge-urgent">⚠️ {deadlineStatus.text}</span>
    );
  }

  if (deadlineStatus.type === "upcoming") {
    return (
      <span
        className="badge"
        style={{
          background: "rgba(245, 158, 11, 0.1)",
          color: "var(--status-not-registered)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        }}
      >
        📅 {deadlineStatus.text}
      </span>
    );
  }

  return (
    <span
      style={{
        fontSize: "0.8125rem",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      📅 {deadlineStatus.text}
    </span>
  );
}
