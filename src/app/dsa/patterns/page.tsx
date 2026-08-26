"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { DSA_PATTERNS } from "@/data/dsaPatterns";
import Link from "next/link";

export default function DsaPatternsPage() {
  const { data: session } = useSession();
  const [patternProgress, setPatternProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dsa/patterns");
        if (res.ok) {
          setPatternProgress(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch pattern data", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) {
      fetchData();
    }
  }, [session]);

  const updatePatternStatus = async (patternId: string, status: string) => {
    // Optimistic update
    setPatternProgress(prev => {
      const existing = prev.find(p => p.patternId === patternId);
      if (existing) {
        return prev.map(p => p.id === existing.id ? { ...p, status } : p);
      } else {
        return [...prev, { patternId, status, id: Math.random().toString() }];
      }
    });

    try {
      await fetch("/api/dsa/patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patternId, status })
      });
    } catch (e) {
      console.error("Failed to update pattern status", e);
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

  // Group patterns by category
  const groupedPatterns = DSA_PATTERNS.reduce((acc, pattern) => {
    if (!acc[pattern.category]) {
      acc[pattern.category] = [];
    }
    acc[pattern.category].push(pattern);
    return acc;
  }, {} as Record<string, typeof DSA_PATTERNS>);

  const statusOptions = [
    { value: 'Not Started', label: '⚪ Not Started' },
    { value: 'Learning', label: '🔵 Learning' },
    { value: 'Needs Practice', label: '🟡 Needs Practice' },
    { value: 'Comfortable', label: '🟢 Comfortable' },
    { value: 'Strong', label: '🔥 Strong' }
  ];

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
          PATTERN MASTERY
        </h1>

        <div className="space-y-12">
          {Object.entries(groupedPatterns).map(([category, patterns]) => (
            <div key={category} className="glass-card p-8">
              <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-3">
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patterns.map(pattern => {
                  const p = patternProgress.find(rp => rp.patternId === pattern.id);
                  const currentStatus = p?.status || 'Not Started';

                  return (
                    <div key={pattern.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border-2 border-black hover:bg-gray-50 transition-colors">
                      <div className="font-bold text-lg mb-3 sm:mb-0">
                        {pattern.name}
                      </div>
                      
                      <select 
                        className="select w-auto text-base py-2 px-3 border-2 border-black font-mono font-bold cursor-pointer"
                        value={currentStatus}
                        onChange={(e) => updatePatternStatus(pattern.id, e.target.value)}
                        style={{
                          backgroundColor: currentStatus === 'Not Started' ? 'white' : 'var(--bg-card-hover)',
                        }}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
