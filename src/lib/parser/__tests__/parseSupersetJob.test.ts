/**
 * Parser Unit Tests
 *
 * Run with: npx tsx src/lib/parser/__tests__/parseSupersetJob.test.ts
 *
 * These tests verify the email parser against realistic mock Superset emails.
 */

import { parseSupersetJobEmail } from "../parseSupersetJob";
import { classifyEmail } from "../classifyEmail";
import { parseCompany } from "../parseCompany";
import { parseRoles } from "../parseRoles";
import { parseCategory } from "../parseCategory";
import { parseDeadline } from "../parseDeadline";
import { parseApplicationLink } from "../parseApplicationLink";
import type { ExtractedEmail } from "@/types";

// ─── Test Helpers ─────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    failed++;
  }
}

function assertEq<T>(actual: T, expected: T, message: string) {
  const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
  if (isEqual) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    console.log(`     Expected: ${JSON.stringify(expected)}`);
    console.log(`     Actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function section(title: string) {
  console.log(`\n🧪 ${title}`);
}

// ─── Mock Emails ──────────────────────────────────────────────────

const mockMultiRoleEmail: ExtractedEmail = {
  gmailMessageId: "msg-001",
  threadId: "thread-001",
  subject:
    "Open for application - OSMOS By OnlineSales.ai's Job Profile : Job 1 - QA Intern, Job 2 - Tech Support Intern, Job 3 - SDE Intern",
  sender: "notifications@joinsuperset.com",
  receivedAt: new Date("2026-08-21T11:14:00Z"),
  textBody: `New Job Opening from OSMOS By OnlineSales.ai!

Applications are now being accepted for OSMOS By OnlineSales.ai's Job Profile -
Job 1 - QA Intern,
Job 2 - Tech Support Intern,
Job 3 - SDE Intern

in Internship category.

Deadline : Aug 22, 11:13 AM

Additional Details :

Job Profile Category : Internship

Click to Apply`,
  htmlBody: `<div>
    <h2>New Job Opening from OSMOS By OnlineSales.ai!</h2>
    <p>Applications are now being accepted for OSMOS By OnlineSales.ai's Job Profile -
    Job 1 - QA Intern, Job 2 - Tech Support Intern, Job 3 - SDE Intern</p>
    <p>in Internship category.</p>
    <p>Deadline : Aug 22, 11:13 AM</p>
    <a href="https://aws-tracking.example.com/redirect?url=https://joinsuperset.com/apply/12345" style="color: blue;">Click to Apply</a>
  </div>`,
};

const mockSingleRoleEmail: ExtractedEmail = {
  gmailMessageId: "msg-002",
  threadId: "thread-002",
  subject:
    "Open for application - Google India's Job Profile : Job 1 - Software Engineer Intern",
  sender: "notifications@joinsuperset.com",
  receivedAt: new Date("2026-08-20T09:00:00Z"),
  textBody: `New Job Opening from Google India!

Applications are now being accepted for Google India's Job Profile -
Job 1 - Software Engineer Intern

in Full Time category.

Deadline : Sep 15, 5:00 PM

Job Profile Category : Full Time`,
  htmlBody: `<div>
    <a href="https://joinsuperset.com/apply/67890">Click to Apply</a>
  </div>`,
};

const mockNoDeadlineEmail: ExtractedEmail = {
  gmailMessageId: "msg-003",
  threadId: "thread-003",
  subject: "Open for application - StartupXYZ's Job Profile",
  sender: "notifications@joinsuperset.com",
  receivedAt: new Date("2026-08-19T15:30:00Z"),
  textBody: `Applications are now being accepted for StartupXYZ's Job Profile -
Job 1 - Data Analyst Intern

in Internship category.`,
  htmlBody: `<div>
    <a href="https://joinsuperset.com/apply/abc">Apply Now</a>
  </div>`,
};

const mockNonJobEmail: ExtractedEmail = {
  gmailMessageId: "msg-004",
  threadId: "thread-004",
  subject: "Your weekly digest from Superset",
  sender: "notifications@joinsuperset.com",
  receivedAt: new Date("2026-08-18T10:00:00Z"),
  textBody: "Here's your weekly update. You have 5 new matches.",
  htmlBody: "<div>Weekly digest content</div>",
};

const mockNonSupersetEmail: ExtractedEmail = {
  gmailMessageId: "msg-005",
  threadId: "thread-005",
  subject: "Job Opening at Some Company",
  sender: "careers@somecompany.com",
  receivedAt: new Date("2026-08-17T12:00:00Z"),
  textBody: "We have a new job opening. Click to Apply.",
  htmlBody: '<a href="https://somecompany.com/apply">Apply</a>',
};

// ─── Tests ────────────────────────────────────────────────────────

// Classification tests
section("Email Classification");

assert(
  classifyEmail(mockMultiRoleEmail) === "JOB_OPENING",
  "Multi-role job email classified as JOB_OPENING"
);

assert(
  classifyEmail(mockSingleRoleEmail) === "JOB_OPENING",
  "Single-role job email classified as JOB_OPENING"
);

assert(
  classifyEmail(mockNoDeadlineEmail) === "JOB_OPENING",
  "No-deadline job email classified as JOB_OPENING"
);

assert(
  classifyEmail(mockNonJobEmail) === "OTHER_SUPERSET",
  "Non-job Superset email classified as OTHER_SUPERSET"
);

assert(
  classifyEmail(mockNonSupersetEmail) === "OTHER_SUPERSET",
  "Non-Superset email classified as OTHER_SUPERSET"
);

// Company name tests
section("Company Name Parsing");

assertEq(
  parseCompany(mockMultiRoleEmail.subject, mockMultiRoleEmail.textBody),
  "OSMOS By OnlineSales.ai",
  "Extracts OSMOS By OnlineSales.ai"
);

assertEq(
  parseCompany(mockSingleRoleEmail.subject, mockSingleRoleEmail.textBody),
  "Google India",
  "Extracts Google India"
);

assertEq(
  parseCompany(mockNoDeadlineEmail.subject, mockNoDeadlineEmail.textBody),
  "StartupXYZ",
  "Extracts StartupXYZ"
);

// Roles tests
section("Roles Parsing");

assertEq(
  parseRoles(mockMultiRoleEmail.subject, mockMultiRoleEmail.textBody),
  ["QA Intern", "Tech Support Intern", "SDE Intern"],
  "Extracts 3 roles from multi-role email"
);

assertEq(
  parseRoles(mockSingleRoleEmail.subject, mockSingleRoleEmail.textBody),
  ["Software Engineer Intern"],
  "Extracts 1 role from single-role email"
);

assertEq(
  parseRoles(mockNoDeadlineEmail.subject, mockNoDeadlineEmail.textBody),
  ["Data Analyst Intern"],
  "Extracts role from no-deadline email"
);

// Category tests
section("Category Parsing");

assertEq(
  parseCategory(mockMultiRoleEmail.textBody),
  "Internship",
  "Extracts Internship category"
);

assertEq(
  parseCategory(mockSingleRoleEmail.textBody),
  "Full Time",
  "Extracts Full Time category"
);

// Deadline tests
section("Deadline Parsing");

const deadline1 = parseDeadline(
  mockMultiRoleEmail.textBody,
  mockMultiRoleEmail.receivedAt
);
assert(deadline1.raw === "Aug 22, 11:13 AM", "Extracts raw deadline");
assert(deadline1.datetime !== null, "Parses deadline datetime");
if (deadline1.datetime) {
  assertEq(deadline1.datetime.getMonth(), 7, "Deadline month is August (7)");
  assertEq(deadline1.datetime.getDate(), 22, "Deadline day is 22");
}

const deadline2 = parseDeadline(
  mockNoDeadlineEmail.textBody,
  mockNoDeadlineEmail.receivedAt
);
assert(deadline2.raw === null, "No deadline returns null raw");
assert(deadline2.datetime === null, "No deadline returns null datetime");

// Application link tests
section("Application Link Parsing");

const link1 = parseApplicationLink(mockMultiRoleEmail.htmlBody);
assert(link1 !== null, "Extracts link from multi-role email");
assert(
  link1?.includes("aws-tracking.example.com") || link1?.includes("joinsuperset.com") || false,
  "Link contains expected domain"
);

const link2 = parseApplicationLink(mockSingleRoleEmail.htmlBody);
assertEq(
  link2,
  "https://joinsuperset.com/apply/67890",
  "Extracts direct Superset link"
);

const link3 = parseApplicationLink(mockNoDeadlineEmail.htmlBody);
assertEq(
  link3,
  "https://joinsuperset.com/apply/abc",
  'Extracts link with "Apply Now" text'
);

// Full parser tests
section("Full Parser (parseSupersetJobEmail)");

const parsed1 = parseSupersetJobEmail(mockMultiRoleEmail);
assert(parsed1 !== null, "Multi-role email parsed successfully");
if (parsed1) {
  assertEq(parsed1.companyName, "OSMOS By OnlineSales.ai", "Full: company name");
  assertEq(parsed1.roles.length, 3, "Full: 3 roles");
  assertEq(parsed1.category, "Internship", "Full: category");
  assert(parsed1.deadlineRaw !== null, "Full: has deadline raw");
  assert(parsed1.applicationUrl !== null, "Full: has application URL");
  assertEq(parsed1.gmailMessageId, "msg-001", "Full: preserves message ID");
}

const parsed2 = parseSupersetJobEmail(mockNonJobEmail);
assert(parsed2 === null, "Non-job email returns null");

const parsed3 = parseSupersetJobEmail(mockNonSupersetEmail);
assert(parsed3 === null, "Non-Superset email returns null");

// ─── Summary ──────────────────────────────────────────────────────

console.log(`\n${"═".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${"═".repeat(50)}\n`);

if (failed > 0) {
  process.exit(1);
}
