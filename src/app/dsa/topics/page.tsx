"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { getMajorCategory } from "@/data/leetcodeTopicMapping";
import type { LeetCodeStats } from "@/services/leetcode/leetcodeTypes";
import Link from "next/link";

export default function DsaTopicsPage() {
  const { data: session } = useSession();
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const settingsRes = await fetch("/api/dsa/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.leetcodeUsername) {
            const lcRes = await fetch(`/api/dsa/leetcode?username=${settingsData.leetcodeUsername}`);
            if (lcRes.ok) {
              setLeetcodeStats(await lcRes.json());
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch topics data", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) {
      fetchData();
    }
  }, [session]);

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

  // Process Leetcode Topics
  let allTopics: { name: string; count: number }[] = [];
  if (leetcodeStats?.tagCounts) {
    const categoryCounts: Record<string, number> = {};
    Object.entries(leetcodeStats.tagCounts).forEach(([tag, count]) => {
      const category = getMajorCategory(tag);
      if (category !== 'Other') {
        categoryCounts[category] = (categoryCounts[category] || 0) + count;
      }
    });
    allTopics = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

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
          TOPIC MASTERY
        </h1>

        <div className="glass-card p-8 mb-12">
          {allTopics.length === 0 ? (
            <div className="text-center p-12">
              <h2 className="text-2xl font-black mb-4 uppercase">No Data Available</h2>
              <p className="text-gray-600 text-lg">
                Please add your LeetCode username in the DSA Dashboard settings, and make sure you have solved questions.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {allTopics.map(topic => {
                const maxExpected = 50; // Visual baseline
                const percent = Math.min(Math.round((topic.count / maxExpected) * 100), 100);
                return (
                  <div key={topic.name} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                    <div className="font-bold w-56 text-xl">{topic.name}</div>
                    <div className="font-mono text-base w-36 font-bold">{topic.count} Questions</div>
                    <div className="flex-grow bg-gray-200 h-5 border-2 border-black relative">
                      <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="font-mono text-lg w-16 text-right font-black">{percent}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
