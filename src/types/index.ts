// ─── Email Classification ────────────────────────────────────────

export type EmailClassification =
  | "JOB_OPENING"
  | "OTHER_SUPERSET";

// Future classifications (not implemented yet):
// | "ONLINE_ASSESSMENT"
// | "INTERVIEW"
// | "SHORTLISTED"
// | "SELECTED"
// | "REJECTED"

// ─── Opportunity Status ──────────────────────────────────────────

export type OpportunityStatus = "NOT_REGISTERED" | "REGISTERED";

// ─── Extracted Email (from Gmail API) ────────────────────────────

export interface ExtractedEmail {
  gmailMessageId: string;
  threadId: string;
  subject: string;
  sender: string;
  receivedAt: Date;
  textBody: string;
  htmlBody: string;
}

// ─── Parsed Deadline ─────────────────────────────────────────────

export interface ParsedDeadline {
  raw: string | null;
  datetime: Date | null;
}

// ─── Parsed Opportunity (from parser) ────────────────────────────

export interface ParsedOpportunity {
  gmailMessageId: string;
  threadId: string;
  sender: string;
  emailSubject: string;
  companyName: string | null;
  roles: string[];
  category: string | null;
  deadlineRaw: string | null;
  deadlineDatetime: Date | null;
  applicationUrl: string | null;
  receivedAt: Date;
}

// ─── Opportunity (from database, with roles) ─────────────────────

export interface OpportunityWithRoles {
  id: string;
  userId: string;
  gmailMessageId: string;
  threadId: string | null;
  companyName: string | null;
  category: string | null;
  deadlineRaw: string | null;
  deadlineDatetime: Date | string | null;
  applicationUrl: string | null;
  emailSubject: string | null;
  senderEmail: string | null;
  receivedAt: Date | string | null;
  status: OpportunityStatus;
  roles: { id: string; roleName: string }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ─── API Response Types ──────────────────────────────────────────

export interface SyncResponse {
  success: boolean;
  newOpportunities: number;
  totalEmails: number;
  message: string;
}

export interface OpportunitiesResponse {
  opportunities: OpportunityWithRoles[];
  total: number;
}

// ─── Filter Types ────────────────────────────────────────────────

export type SortOption =
  | "deadline_asc"
  | "received_desc"
  | "company_asc";

export type StatusFilter = "ALL" | "NOT_REGISTERED" | "REGISTERED";
export type CategoryFilter = "ALL" | "Internship" | "Full Time" | "Other";

export interface OpportunityFilters {
  status: StatusFilter;
  category: CategoryFilter;
  search: string;
  sort: SortOption;
}

// ─── Deadline Status ─────────────────────────────────────────────

export type DeadlineStatus =
  | { type: "expired" }
  | { type: "urgent"; text: string }
  | { type: "upcoming"; text: string }
  | { type: "normal"; text: string }
  | { type: "unknown" };
