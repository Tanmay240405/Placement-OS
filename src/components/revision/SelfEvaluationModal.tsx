"use client";

import React, { useState } from "react";

interface SelfEvaluationModalProps {
  topicTitle: string;
  subtopics: string[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function SelfEvaluationModal({
  topicTitle,
  subtopics,
  isOpen,
  onClose,
  onComplete,
}: SelfEvaluationModalProps) {
  const [answer, setAnswer] = useState("");

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--bg-card)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Self Evaluation
            </h2>
            <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
              Topic: {topicTitle}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ fontSize: "1.5rem", padding: "0 8px" }}>
            &times;
          </button>
        </div>

        <div style={{ backgroundColor: "var(--bg-secondary)", padding: "1rem", border: "var(--border-width) solid var(--border-color)", boxShadow: "2px 2px 0px 0px #000000" }}>
          <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Briefly explain the following concepts:</p>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            {subtopics.map((st, idx) => (
              <li key={idx} style={{ marginBottom: "0.25rem" }}>{st}</li>
            ))}
          </ul>
        </div>

        <div>
          <textarea
            className="input"
            rows={5}
            placeholder="Write your explanation here... (Self evaluation only)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ resize: "vertical", minHeight: "120px" }}
          ></textarea>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (answer.trim() || confirm("Are you sure you want to mark this complete without writing an explanation?")) {
                onComplete();
                onClose();
              }
            }}
          >
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}
