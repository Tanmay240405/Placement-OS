import Link from "next/link";
import React from "react";

interface SubjectCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  description?: string;
}

export default function SubjectCard({
  title,
  icon,
  href,
  description,
}: SubjectCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
      <div
        className="opportunity-card stagger-children"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                background: "var(--bg-secondary)",
                border: "var(--border-width) solid var(--border-color)",
                boxShadow: "2px 2px 0px 0px #000000",
              }}
            >
              {icon}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
              {title}
            </h3>
          </div>
          {description && (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                marginTop: "0.5rem",
              }}
            >
              {description}
            </p>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span className="btn btn-secondary btn-sm">Start Revision &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
