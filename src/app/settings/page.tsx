"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SyncButton from "@/components/dashboard/SyncButton";
import type { SyncResponse } from "@/types";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const handleSyncComplete = (result: SyncResponse) => {
    if (result.success) {
      setLastSynced(new Date());
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="animate-slide-up">
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "2rem",
            }}
          >
            Settings
          </h1>

          {/* Gmail Connection */}
          <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📧 Connected Gmail Account
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1rem",
              }}
            >
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "2px solid var(--border-subtle)",
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: 500 }}>
                  {session?.user?.name || "User"}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {session?.user?.email || ""}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--status-registered)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--status-registered)",
                }}
              >
                Connected
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-secondary btn-sm"
              id="disconnect-gmail"
              style={{
                color: "var(--status-urgent)",
                borderColor: "rgba(239, 68, 68, 0.2)",
              }}
            >
              Disconnect Gmail
            </button>
          </div>

          {/* Email Sync */}
          <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🔄 Superset Email Sync
            </h2>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                marginBottom: "1rem",
                lineHeight: 1.6,
              }}
            >
              Fetches emails from{" "}
              <code
                style={{
                  background: "var(--bg-elevated)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8125rem",
                }}
              >
                notifications@joinsuperset.com
              </code>{" "}
              from the last 30 days. Only job opening emails are parsed and
              displayed.
            </p>

            <SyncButton
              lastSynced={lastSynced}
              onSyncComplete={handleSyncComplete}
            />
          </div>

          {/* About */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ℹ️ About Placement OS
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              Placement OS automatically detects Superset job opportunity emails,
              extracts key information like company name, roles, category, and
              deadlines, and presents them in a clean dashboard. Your email data
              is processed securely on the server and never shared with third
              parties.
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: "1rem",
              }}
            >
              Phase 1 – Superset Email Parser
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
