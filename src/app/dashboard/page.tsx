"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import StatsCards from "@/components/dashboard/StatsCards";
import OpportunityList from "@/components/dashboard/OpportunityList";
import OpportunityFiltersBar from "@/components/dashboard/OpportunityFilters";
import SyncButton from "@/components/dashboard/SyncButton";
import type { OpportunityWithRoles, OpportunityFilters, SyncResponse } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState<OpportunityWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [filters, setFilters] = useState<OpportunityFilters>({
    status: "ALL",
    category: "ALL",
    search: "",
    sort: "deadline_asc",
  });

  const fetchOpportunities = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== "ALL") params.set("status", filters.status);
      if (filters.category !== "ALL") params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);
      params.set("sort", filters.sort);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus as OpportunityWithRoles["status"] } : o))
    );
  };

  const handleSyncComplete = (result: SyncResponse) => {
    if (result.success) {
      setLastSynced(new Date());
      fetchOpportunities();
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const attentionCount = opportunities.filter(
    (o) => o.status === "NOT_REGISTERED"
  ).length;

  return (
    <>
      <Navbar />
      <main className="page-container">
        {/* Header Section */}
        <div className="animate-slide-up" style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
            }}
          >
            {getGreeting()}, {session?.user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
            {opportunities.length > 0 ? (
              <>
                {opportunities.length} opportunit
                {opportunities.length === 1 ? "y" : "ies"} found in the last 30
                days.
                {attentionCount > 0 && (
                  <span style={{ color: "var(--status-not-registered)" }}>
                    {" "}
                    {attentionCount} require{attentionCount === 1 ? "s" : ""}{" "}
                    your attention.
                  </span>
                )}
              </>
            ) : (
              "Sync your Superset emails to get started."
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ marginBottom: "2rem" }}>
          <StatsCards opportunities={opportunities} />
        </div>

        {/* Sync + Filters Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Opportunities
            </h2>
            <SyncButton
              lastSynced={lastSynced}
              onSyncComplete={handleSyncComplete}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: "1.5rem" }}>
          <OpportunityFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Opportunity List */}
        <OpportunityList
          opportunities={opportunities}
          onStatusChange={handleStatusChange}
          isLoading={isLoading}
        />
      </main>
    </>
  );
}
