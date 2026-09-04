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
      <div className="landing-hero relative overflow-hidden w-full">
        <div className="animate-slide-up flex flex-col items-center relative z-10 w-full max-w-2xl mx-auto">
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

          {/* Bottom Cloud */}
          <div className="mt-44 w-full max-w-[320px]">
            <div className="cloud-shape animate-cloud-pulse w-full">
              <div style={{ marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>Revision</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>Never forget what you've learned</div>
            </div>
          </div>

          {/* Mobile clouds (Left and right become visible on mobile below the bottom one) */}
          <div className="flex xl:hidden flex-col gap-8 w-full max-w-[320px] mt-8">
            <div className="cloud-shape animate-cloud-pulse w-full">
              <div style={{ marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>GitHub</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>Track open source contributions & commits</div>
            </div>
            <div className="cloud-shape animate-cloud-pulse w-full">
              <div style={{ marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
                </svg>
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>DSA</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>Monitor Leetcode & Codeforces progress</div>
            </div>
          </div>
        </div>

        {/* Left Cloud - Absolute (Desktop) */}
        <div className="hidden xl:block absolute left-[2%] 2xl:left-[10%] top-[25%] z-0">
          <div className="cloud-shape animate-cloud-pulse w-full max-w-[280px]">
            <div style={{ marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>GitHub</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>Track open source contributions & commits</div>
          </div>
        </div>

        {/* Right Cloud - Absolute (Desktop) */}
        <div className="hidden xl:block absolute right-[2%] 2xl:right-[10%] top-[25%] z-0" style={{ animationDelay: "1s" }}>
          <div className="cloud-shape animate-cloud-pulse w-full max-w-[280px]">
            <div style={{ marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
              </svg>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>DSA</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.4" }}>Monitor Leetcode & Codeforces progress</div>
          </div>
        </div>
      </div>
    </>
  );
}
