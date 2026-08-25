"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import TopicCard from "@/components/revision/TopicCard";
import topicsData from "@/data/topics.json";

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const resolvedParams = use(params);
  const subjectId = resolvedParams.subject;

  // Retrieve subject data
  const subjectData = (topicsData as any)[subjectId];

  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load from localStorage on mount
    const stored = localStorage.getItem(`completed_${subjectId}`);
    if (stored) {
      try {
        setCompletedTopics(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse completed topics");
      }
    }
  }, [subjectId]);

  if (!subjectData) {
    return notFound();
  }

  const handleMarkComplete = (topicId: string) => {
    const updated = { ...completedTopics, [topicId]: true };
    setCompletedTopics(updated);
    localStorage.setItem(`completed_${subjectId}`, JSON.stringify(updated));
  };

  const completedCount = Object.keys(completedTopics).length;
  const totalCount = subjectData.topics.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="page-container animate-fade-in" style={{ flex: 1, width: "100%" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <Link href="/revision" className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: "1.25rem" }}>
              &larr;
            </Link>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.05em",
                textShadow: "2px 2px 0px var(--accent-glow)",
                margin: 0,
              }}
            >
              {subjectData.title}
            </h1>
          </div>
          {isMounted && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <div
                style={{
                  flex: 1,
                  height: "12px",
                  background: "var(--bg-card)",
                  border: "var(--border-width) solid var(--border-color)",
                  boxShadow: "2px 2px 0px 0px #000000",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: "var(--text-primary)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                {progressPercent}% Complete
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {subjectData.topics.map((topic: any) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={`${topic.id} ${topic.title}`}
              subtopics={topic.subtopics}
              isCompleted={!!completedTopics[topic.id]}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
