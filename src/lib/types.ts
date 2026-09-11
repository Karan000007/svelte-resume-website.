export type Stage =
  | "Saved"
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected";

export type Priority = "High" | "Medium" | "Low";

export type Source =
  | "LinkedIn"
  | "Referral"
  | "Company Site"
  | "Recruiter"
  | "Other";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  stage: Stage;
  priority: Priority;
  source: Source;
  applied_date: string | null;
  compensation: string | null;
  contact: string | null;
  job_link: string | null;
  next_step: string | null;
  next_step_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const STAGES: Stage[] = [
  "Saved",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

export const SOURCES: Source[] = [
  "LinkedIn",
  "Referral",
  "Company Site",
  "Recruiter",
  "Other",
];

export const STAGE_COLORS: Record<Stage, string> = {
  Saved: "bg-gray-100 text-gray-700 border-gray-300",
  Applied: "bg-blue-100 text-blue-700 border-blue-300",
  Screening: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Interview: "bg-purple-100 text-purple-700 border-purple-300",
  Offer: "bg-green-100 text-green-700 border-green-300",
  Rejected: "bg-red-100 text-red-700 border-red-300",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};
