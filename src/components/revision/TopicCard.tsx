"use client";

import React, { useState } from "react";
import SelfEvaluationModal from "./SelfEvaluationModal";

interface TopicCardProps {
  id: string;
  title: string;
  subtopics: string[];
  isCompleted: boolean;
  onMarkComplete: (topicId: string) => void;
}

export default function TopicCard({
  id,
  title,
  subtopics,
  isCompleted,
  onMarkComplete,
}: TopicCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [randomSubtopics, setRandomSubtopics] = useState<string[]>([]);

  const handleOpenModal = () => {
    // Pick 2-3 random subtopics
    const numToPick = Math.min(subtopics.length, Math.floor(Math.random() * 2) + 2); // 2 or 3
    const shuffled = [...subtopics].sort(() => 0.5 - Math.random());
    setRandomSubtopics(shuffled.slice(0, numToPick));
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="opportunity-card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          opacity: isCompleted ? 0.8 : 1,
          backgroundColor: isCompleted ? "var(--bg-card-hover)" : "var(--bg-card)",
          position: "relative",
        }}
      >
        {isCompleted && (
          <div
            className="badge badge-registered"
            style={{ position: "absolute", top: "-10px", right: "-10px", zIndex: 10 }}
          >
            ✓ Completed
          </div>
        )}

        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            {title}
          </h3>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "0.5rem",
              listStyleType: "none",
              padding: 0,
            }}
          >
            {subtopics.map((st, idx) => (
              <li
                key={idx}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ color: "var(--border-color)", marginTop: "2px", fontSize: "0.75rem" }}>■</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          {isCompleted ? (
            <button className="btn btn-secondary btn-sm" disabled>
              Completed
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
              Mark Complete
            </button>
          )}
        </div>
      </div>

      <SelfEvaluationModal
        topicTitle={title}
        subtopics={randomSubtopics}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={() => onMarkComplete(id)}
      />
    </>
  );
}
