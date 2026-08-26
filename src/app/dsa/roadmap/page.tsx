"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { DSA_ROADMAP } from "@/data/dsaRoadmap";
import Link from "next/link";

export default function DsaRoadmapPage() {
  const { data: session } = useSession();
  const [roadmapProgress, setRoadmapProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dsa/roadmap");
        if (res.ok) {
          setRoadmapProgress(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch roadmap data", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) {
      fetchData();
    }
  }, [session]);

  const toggleSubtopic = async (topicId: string, subtopicId: string, isCompleted: boolean) => {
    // Optimistic UI update
    setRoadmapProgress(prev => {
      const existing = prev.find(p => p.topicId === topicId && p.subtopicId === subtopicId);
      if (existing) {
        return prev.map(p => p.id === existing.id ? { ...p, isCompleted } : p);
      } else {
        return [...prev, { topicId, subtopicId, isCompleted, id: Math.random().toString() }];
      }
    });

    try {
      await fetch("/api/dsa/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, subtopicId, isCompleted })
      });
    } catch (e) {
      console.error("Failed to update progress", e);
      // Ideally revert optimistic update on failure
    }
  };

  const toggleExpand = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
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

  const priorityIcon = {
    'MUST_KNOW': '🔥 MUST KNOW',
    'IMPORTANT': '⭐ IMPORTANT',
    'ADVANCED': '📚 ADVANCED'
  };

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="mb-6">
          <Link href="/dsa" className="text-sm font-mono hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">
          DSA ROADMAP
        </h1>

        <div className="space-y-8">
          {DSA_ROADMAP.map(topic => {
            const completedInTopic = roadmapProgress.filter(rp => rp.topicId === topic.id && rp.isCompleted).length;
            const totalInTopic = topic.subtopics.length;
            const percent = Math.round((completedInTopic / totalInTopic) * 100);
            const isExpanded = !!expandedTopics[topic.id];

            let statusIcon = '○';
            if (percent === 100) statusIcon = '✓';
            else if (percent > 0) statusIcon = '◐';

            return (
              <div key={topic.id} className="glass-card">
                <div 
                  className="p-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(topic.id)}
                >
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                      <span className="w-8 text-center">{statusIcon}</span> {topic.name}
                    </h2>
                    <div className="text-sm font-mono mt-2 text-gray-600 pl-11">
                      {priorityIcon[topic.priority]}
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-base font-mono font-bold mb-2">
                        Progress: {completedInTopic} / {totalInTopic}
                      </div>
                      <div className="w-40 bg-gray-200 h-3 border-2 border-black relative">
                        <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                    <button className="btn btn-secondary">
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t-4 border-black p-8 bg-white space-y-4 font-mono text-lg">
                    {topic.subtopics.map(sub => {
                      const isCompleted = roadmapProgress.some(rp => rp.topicId === topic.id && rp.subtopicId === sub.id && rp.isCompleted);
                      return (
                        <label 
                          key={sub.id} 
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200"
                        >
                          <input 
                            type="checkbox" 
                            className="w-6 h-6 accent-black border-2 border-black cursor-pointer"
                            checked={isCompleted}
                            onChange={(e) => toggleSubtopic(topic.id, sub.id, e.target.checked)}
                          />
                          <span className={isCompleted ? 'line-through text-gray-400 font-bold' : 'font-bold'}>
                            {sub.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
