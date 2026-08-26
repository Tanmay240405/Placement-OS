"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getMajorCategory } from "@/data/leetcodeTopicMapping";
import { DSA_ROADMAP } from "@/data/dsaRoadmap";
import { DSA_PATTERNS } from "@/data/dsaPatterns";
import type { LeetCodeStats } from "@/services/leetcode/leetcodeTypes";

export default function DsaDashboardPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<any>(null);
  const [roadmapProgress, setRoadmapProgress] = useState<any[]>([]);
  const [patternProgress, setPatternProgress] = useState<any[]>([]);
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editForm, setEditForm] = useState({
    leetcodeUsername: "",
    totalProblemsSolved: "",
    targetProblems: "",
    codeforcesRating: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, roadmapRes, patternsRes] = await Promise.all([
          fetch("/api/dsa/settings"),
          fetch("/api/dsa/roadmap"),
          fetch("/api/dsa/patterns")
        ]);

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
          setEditForm({
            leetcodeUsername: settingsData.leetcodeUsername || "",
            totalProblemsSolved: settingsData.totalProblemsSolved?.toString() || "0",
            targetProblems: settingsData.targetProblems?.toString() || "300",
            codeforcesRating: settingsData.codeforcesRating?.toString() || "0",
          });

          if (settingsData.leetcodeUsername) {
            const lcRes = await fetch(`/api/dsa/leetcode?username=${settingsData.leetcodeUsername}`);
            if (lcRes.ok) {
              setLeetcodeStats(await lcRes.json());
            }
          }
        }

        if (roadmapRes.ok) setRoadmapProgress(await roadmapRes.json());
        if (patternsRes.ok) setPatternProgress(await patternsRes.json());

      } catch (e) {
        console.error("Failed to fetch DSA data", e);
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleSaveSettings = async () => {
    setIsEditingSettings(false);
    const res = await fetch("/api/dsa/settings", {
      method: "POST",
      body: JSON.stringify(editForm),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      const newSettings = await res.json();
      setSettings(newSettings);
      if (newSettings.leetcodeUsername !== settings.leetcodeUsername && newSettings.leetcodeUsername) {
        const lcRes = await fetch(`/api/dsa/leetcode?username=${newSettings.leetcodeUsername}`);
        if (lcRes.ok) {
          setLeetcodeStats(await lcRes.json());
        }
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="page-container flex justify-center items-center h-screen">
          <div className="spinner" style={{ width: "32px", height: "32px" }}></div>
        </main>
      </>
    );
  }

  // Derived Data for UI
  const totalSolved = settings?.totalProblemsSolved || 0;
  const targetProblems = settings?.targetProblems || 300;
  const progressPercent = Math.min(Math.round((totalSolved / targetProblems) * 100), 100) || 0;

  // Process Leetcode Topics
  let topicMastery: { name: string; count: number }[] = [];
  if (leetcodeStats?.tagCounts) {
    const categoryCounts: Record<string, number> = {};
    Object.entries(leetcodeStats.tagCounts).forEach(([tag, count]) => {
      const category = getMajorCategory(tag);
      if (category !== 'Other') {
        categoryCounts[category] = (categoryCounts[category] || 0) + count;
      }
    });
    topicMastery = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }

  // Process Roadmap Progress
  const roadmapPreview = DSA_ROADMAP.slice(0, 8).map(topic => {
    const completedInTopic = roadmapProgress.filter(rp => rp.topicId === topic.id && rp.isCompleted).length;
    const totalInTopic = topic.subtopics.length;
    const percent = Math.round((completedInTopic / totalInTopic) * 100);
    let status = '○';
    if (percent === 100) status = '✓';
    else if (percent > 0) status = '◐';
    return { name: topic.name, percent, status };
  });

  // Process Pattern Progress
  const statusMap = {
    'Strong': '🟢 Strong',
    'Comfortable': '🟢 Comfortable',
    'Needs Practice': '🟡 Needs Practice',
    'Learning': '🔵 Learning',
    'Not Started': '🔴 Weak' // Default mapping for weak
  };

  const patternPreview = DSA_PATTERNS.slice(0, 8).map(pattern => {
    const p = patternProgress.find(rp => rp.patternId === pattern.id);
    const status = p?.status || 'Not Started';
    const displayStatus = status === 'Not Started' ? '🔴 Weak' : (statusMap[status as keyof typeof statusMap] || status);
    return { name: pattern.name, status: displayStatus };
  });

  return (
    <>
      <Navbar />
      <main className="page-container stagger-children">
        
        {/* HERO SECTION */}
        <section className="glass-card text-center py-12 px-8 mb-12" style={{ borderBottomWidth: "4px" }}>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">DSA</h1>
          <div className="text-3xl font-mono font-bold mb-4">
            {totalSolved} / {targetProblems} Problems
          </div>
          <div className="text-xl font-medium text-gray-500 mb-8">
            🔥 {leetcodeStats ? "Live Streak (TBD)" : "6 Day Streak"} 
            {/* Streak logic can be improved later as requested */}
          </div>
          
          <div className="w-full max-w-3xl mx-auto bg-gray-200 h-6 rounded-none border-2 border-black relative mb-2">
            <div 
              className="h-full bg-black transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="font-mono text-base font-bold mb-8">{progressPercent}% Completed</div>
          
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => setIsEditingSettings(true)}
          >
            Edit Stats
          </button>
        </section>

        {/* LEETCODE + PLATFORMS */}
        <section className="mb-12">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-3">LEETCODE + PLATFORMS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stat-card p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">🟡 LeetCode</h3>
              {leetcodeStats ? (
                <>
                  <div className="font-mono text-3xl font-black mb-6">{leetcodeStats.totalSolved} Solved</div>
                  <div className="text-base space-y-2 font-mono">
                    <div className="flex justify-between"><span>Easy:</span> <strong>{leetcodeStats.easySolved}</strong></div>
                    <div className="flex justify-between"><span>Medium:</span> <strong>{leetcodeStats.mediumSolved}</strong></div>
                    <div className="flex justify-between"><span>Hard:</span> <strong>{leetcodeStats.hardSolved}</strong></div>
                  </div>
                </>
              ) : (
                <div className="text-base text-gray-500 mt-4">Add LeetCode username in settings</div>
              )}
            </div>

            <div className="stat-card p-6 flex flex-col justify-center">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">🔵 Codeforces</h3>
              <div className="font-mono text-3xl font-black">Rating: {settings?.codeforcesRating || 0}</div>
            </div>

            <div className="stat-card p-6 flex flex-col justify-center">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">📊 Total Problems</h3>
              <div className="font-mono text-3xl font-black">{totalSolved} / {targetProblems}</div>
            </div>
          </div>
        </section>

        {/* TOPIC MASTERY */}
        <section className="mb-12 glass-card p-8">
          <h2 className="text-2xl font-black uppercase mb-8 border-b-2 border-gray-200 pb-4">TOPIC MASTERY</h2>
          <div className="space-y-6 mb-8">
            {topicMastery.map(topic => {
              // Assume 50 questions is 100% for the preview visualization purposes
              const maxExpected = 50;
              const percent = Math.min(Math.round((topic.count / maxExpected) * 100), 100);
              return (
                <div key={topic.name} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="font-bold text-lg w-56">{topic.name}</div>
                  <div className="font-mono text-base w-36">{topic.count} Questions</div>
                  <div className="flex-grow bg-gray-200 h-4 border-2 border-black relative">
                    <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="font-mono text-base font-bold w-16 text-right">{percent}%</div>
                </div>
              );
            })}
            {topicMastery.length === 0 && <div className="text-base text-gray-500 italic py-4">No data available. Solve questions on LeetCode.</div>}
          </div>
          <Link href="/dsa/topics" className="btn btn-primary btn-lg inline-flex mt-2">
            View All Topics →
          </Link>
        </section>

        {/* DSA ROADMAP PREVIEW */}
        <section className="mb-12 glass-card p-8">
          <h2 className="text-2xl font-black uppercase mb-8 border-b-2 border-gray-200 pb-4">DSA ROADMAP</h2>
          <div className="space-y-5 mb-8 font-mono text-lg">
            {roadmapPreview.map(topic => (
              <div key={topic.name} className="flex justify-between items-center border-b border-gray-200 pb-3 hover:bg-gray-50 px-2 -mx-2 transition-colors">
                <div>
                  <span className="mr-4 font-bold text-xl inline-block w-6 text-center">{topic.status}</span> 
                  {topic.name}
                </div>
                <div className="font-bold">{topic.percent}%</div>
              </div>
            ))}
          </div>
          <Link href="/dsa/roadmap" className="btn btn-primary btn-lg inline-flex mt-2">
            View Full DSA Roadmap →
          </Link>
        </section>

        {/* PATTERN MASTERY PREVIEW */}
        <section className="mb-12 glass-card p-8">
          <h2 className="text-2xl font-black uppercase mb-8 border-b-2 border-gray-200 pb-4">PATTERN MASTERY</h2>
          <div className="space-y-5 mb-8 font-mono text-lg">
            {patternPreview.map(pattern => (
              <div key={pattern.name} className="flex justify-between items-center border-b border-gray-200 pb-3 hover:bg-gray-50 px-2 -mx-2 transition-colors">
                <div className="font-semibold">{pattern.name}</div>
                <div className="font-bold px-3 py-1 bg-gray-100 border border-gray-300 rounded-sm">{pattern.status}</div>
              </div>
            ))}
          </div>
          <Link href="/dsa/patterns" className="btn btn-primary btn-lg inline-flex mt-2">
            View All Patterns →
          </Link>
        </section>
      </main>

      {/* Edit Settings Modal */}
      {isEditingSettings && (
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
          onClick={() => setIsEditingSettings(false)}
        >
          <div 
            className="glass-card animate-fade-in" 
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "var(--bg-card)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Edit DSA Stats
                </h2>
                <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                  Update your problem targets and manual progress
                </p>
              </div>
              <button onClick={() => setIsEditingSettings(false)} className="btn-ghost" style={{ fontSize: "1.5rem", padding: "0 8px" }}>
                &times;
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Total Problems Solved (Manual)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={editForm.totalProblemsSolved}
                  onChange={e => setEditForm({...editForm, totalProblemsSolved: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Target Problems</label>
                <input 
                  type="number" 
                  className="input" 
                  value={editForm.targetProblems}
                  onChange={e => setEditForm({...editForm, targetProblems: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Codeforces Rating (Manual)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={editForm.codeforcesRating}
                  onChange={e => setEditForm({...editForm, codeforcesRating: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">LeetCode Username</label>
                <input 
                  type="text" 
                  className="input" 
                  value={editForm.leetcodeUsername}
                  onChange={e => setEditForm({...editForm, leetcodeUsername: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
              <button className="btn btn-secondary" onClick={() => setIsEditingSettings(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveSettings}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
