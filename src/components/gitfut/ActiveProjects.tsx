"use client";

import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  lastUpdated: string;
  link: string;
}

const defaultProjects: Project[] = [
  {
    id: "p1",
    name: "Placement OS",
    description: "Personal placement preparation dashboard",
    language: "TypeScript • Next.js",
    lastUpdated: "Today",
    link: "https://github.com/Tanmay240405/google-im-coming",
  }
];

export default function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("gitfut_active_projects");
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {
        setProjects(defaultProjects);
      }
    } else {
      setProjects(defaultProjects);
    }
  }, []);

  const handleAddProject = () => {
    const name = prompt("Project Name:");
    if (!name) return;
    const description = prompt("Description:") || "";
    const language = prompt("Tech Stack (e.g. TypeScript • React):") || "";
    const link = prompt("GitHub Link:") || "#";
    
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      language,
      lastUpdated: "Today",
      link
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("gitfut_active_projects", JSON.stringify(updated));
  };

  const handleRemoveProject = (id: string) => {
    if (!confirm("Remove this active project?")) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("gitfut_active_projects", JSON.stringify(updated));
  };

  if (!isMounted) return null;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase" }}>
          Active Projects
        </h2>
        <button className="btn btn-primary btn-sm" onClick={handleAddProject}>
          + Add Project
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚀</div>
            <p>No active projects added yet.</p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} style={{ border: "var(--border-width) solid var(--border-color)", padding: "1rem", backgroundColor: "var(--bg-secondary)", position: "relative", boxShadow: "2px 2px 0px 0px #000000" }}>
              <button 
                onClick={() => handleRemoveProject(project.id)}
                className="btn-ghost" 
                style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "1.25rem", padding: "0 8px" }}
                title="Remove Project"
              >
                &times;
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1rem" }}>🟢</span>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>{project.name}</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                {project.description}
              </p>
              <div style={{ display: "flex", gap: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                <span>{project.language}</span>
                <span>Last updated: {project.lastUpdated}</span>
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
                View Repository &rarr;
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
