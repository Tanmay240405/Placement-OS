import React from "react";
import Navbar from "@/components/layout/Navbar";
import GitFutHero from "@/components/gitfut/GitFutHero";
import QuickStats from "@/components/gitfut/QuickStats";
import ContributionHeatmap from "@/components/gitfut/ContributionHeatmap";
import ConsistencyStats from "@/components/gitfut/ConsistencyStats";
import ActiveProjects from "@/components/gitfut/ActiveProjects";
import RecentActivity from "@/components/gitfut/RecentActivity";
import TechStack from "@/components/gitfut/TechStack";
import PlacementCleanup from "@/components/gitfut/PlacementCleanup";
import { getGithubData, processGithubData, fetchGithubRecentActivity } from "@/services/github/githubService";

export default async function GitFutDashboard() {
  const rawData = await getGithubData();
  const githubData = processGithubData(rawData);
  const recentActivity = await fetchGithubRecentActivity();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="page-container animate-fade-in stagger-children" style={{ flex: 1, width: "100%" }}>
        
        {/* HERO */}
        <section style={{ marginBottom: "2rem" }}>
          <GitFutHero />
        </section>

        {/* QUICK STATS */}
        <section style={{ marginBottom: "2rem" }}>
          <QuickStats stats={githubData?.stats} />
        </section>

        {/* 2-COLUMN LAYOUT FOR DASHBOARD CONTENT */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ContributionHeatmap activityData={githubData?.activityData} />
            <ActiveProjects />
            <TechStack techStack={githubData?.techStack} />
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ConsistencyStats stats={githubData?.stats} />
            <PlacementCleanup cleanupTasks={githubData?.cleanupTasks} />
            <RecentActivity recentActivity={recentActivity} />
          </div>
          
        </div>
      </main>
    </div>
  );
}
