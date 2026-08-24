"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="landing-hero">
        <div className="spinner" style={{ width: "32px", height: "32px" }} />
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  return (
    <>
      <div className="landing-bg" />
      <div className="landing-hero">
        <div className="animate-slide-up">
          {/* Logo Mark */}
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
            }}
          >
            🎯
          </div>

          <h1 className="landing-title">Placement OS</h1>

          <p className="landing-subtitle">
            Your personal placement command center. Connect Gmail, track
            Superset opportunities, and never miss a deadline.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn btn-lg"
            id="sign-in-button"
            style={{
              background: "white",
              color: "#1a1a2e",
              fontWeight: 600,
              padding: "16px 32px",
              fontSize: "1rem",
              gap: "12px",
              boxShadow: "0 4px 24px rgba(255, 255, 255, 0.1)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              maxWidth: "400px",
            }}
          >
            We only read your Superset notification emails. Your data stays
            private and secure.
          </p>
        </div>

        {/* Features Preview */}
        <div
          className="animate-fade-in"
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          {[
            {
              icon: "📧",
              title: "Auto-Detect",
              desc: "Fetches job emails from Superset",
            },
            {
              icon: "📊",
              title: "Smart Parse",
              desc: "Extracts company, roles & deadlines",
            },
            {
              icon: "🎯",
              title: "Track Status",
              desc: "Mark as registered with one click",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card"
              style={{
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {feature.icon}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
