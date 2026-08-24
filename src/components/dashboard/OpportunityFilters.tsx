"use client";

import type { OpportunityFilters } from "@/types";

interface OpportunityFiltersBarProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
}

export default function OpportunityFiltersBar({
  filters,
  onFiltersChange,
}: OpportunityFiltersBarProps) {
  return (
    <div
      className="filters-bar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}
    >
      {/* Search */}
      <div className="search-wrapper" style={{ flex: 1, minWidth: "200px" }}>
        <svg
          className="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="input"
          placeholder="Search opportunities..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          id="search-input"
        />
      </div>

      {/* Status Filter */}
      <select
        className="select"
        style={{ width: "auto", minWidth: "140px" }}
        value={filters.status}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            status: e.target.value as OpportunityFilters["status"],
          })
        }
        id="status-filter"
      >
        <option value="ALL">All Status</option>
        <option value="NOT_REGISTERED">Not Registered</option>
        <option value="REGISTERED">Registered</option>
      </select>

      {/* Category Filter */}
      <select
        className="select"
        style={{ width: "auto", minWidth: "140px" }}
        value={filters.category}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            category: e.target.value as OpportunityFilters["category"],
          })
        }
        id="category-filter"
      >
        <option value="ALL">All Categories</option>
        <option value="Internship">Internship</option>
        <option value="Full Time">Full Time</option>
        <option value="Other">Other</option>
      </select>

      {/* Sort */}
      <select
        className="select"
        style={{ width: "auto", minWidth: "160px" }}
        value={filters.sort}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            sort: e.target.value as OpportunityFilters["sort"],
          })
        }
        id="sort-select"
      >
        <option value="deadline_asc">Deadline Soonest</option>
        <option value="received_desc">Newest Email</option>
        <option value="company_asc">Company Name</option>
      </select>
    </div>
  );
}
