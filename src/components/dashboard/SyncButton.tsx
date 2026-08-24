"use client";

import { useState } from "react";
import { formatRelativeTime } from "@/lib/utils/deadlineStatus";
import type { SyncResponse } from "@/types";

interface SyncButtonProps {
  lastSynced: Date | string | null;
  onSyncComplete: (result: SyncResponse) => void;
}

export default function SyncButton({
  lastSynced,
  onSyncComplete,
}: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setToast(null);

    try {
      const res = await fetch("/api/gmail/sync", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToast({ message: data.message, type: "success" });
        onSyncComplete(data);
      } else {
        setToast({
          message: data.error || "Sync failed. Please try again.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Network error. Please check your connection.",
        type: "error",
      });
    } finally {
      setIsSyncing(false);

      // Auto-dismiss toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="btn btn-primary"
          id="sync-button"
        >
          {isSyncing ? (
            <>
              <span className="spinner" />
              Syncing...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              Sync Superset Emails
            </>
          )}
        </button>

        {lastSynced && (
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
            }}
          >
            Last synced: {formatRelativeTime(lastSynced)}
          </span>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--text-primary)",
              }}
            >
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="btn btn-ghost btn-icon"
              style={{ marginLeft: "auto", padding: "4px" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
