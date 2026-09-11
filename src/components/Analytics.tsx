"use client";

import { Application, STAGES, Stage } from "@/lib/types";

interface Props {
  applications: Application[];
}

export default function Analytics({ applications }: Props) {
  const total = applications.length;
  const stageCounts = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = applications.filter((a) => a.stage === stage).length;
      return acc;
    },
    {} as Record<Stage, number>
  );

  const applied = total - stageCounts["Saved"];
  const pastApplied =
    stageCounts["Screening"] +
    stageCounts["Interview"] +
    stageCounts["Offer"];
  const responseRate = applied > 0 ? (pastApplied / applied) * 100 : 0;
  const interviewRate =
    applied > 0
      ? ((stageCounts["Interview"] + stageCounts["Offer"]) / applied) * 100
      : 0;

  const stats = [
    { label: "Total Tracked", value: total, color: "bg-slate-100 text-slate-700" },
    { label: "Applied", value: applied, color: "bg-blue-100 text-blue-700" },
    {
      label: "Response Rate",
      value: `${responseRate.toFixed(0)}%`,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Interview Rate",
      value: `${interviewRate.toFixed(0)}%`,
      color: "bg-purple-100 text-purple-700",
    },
    { label: "Offers", value: stageCounts["Offer"], color: "bg-green-100 text-green-700" },
  ];

  const maxCount = Math.max(...STAGES.map((s) => stageCounts[s]), 1);

  const funnelColors: Record<Stage, string> = {
    Saved: "bg-gray-400",
    Applied: "bg-blue-500",
    Screening: "bg-yellow-500",
    Interview: "bg-purple-500",
    Offer: "bg-green-500",
    Rejected: "bg-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl p-4 ${stat.color}`}
          >
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
          Pipeline Funnel
        </h3>
        <div className="space-y-2">
          {STAGES.map((stage) => (
            <div key={stage} className="flex items-center gap-3">
              <div className="w-24 text-sm text-slate-600 font-medium text-right">
                {stage}
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-7 overflow-hidden">
                <div
                  className={`h-full rounded-full ${funnelColors[stage]} transition-all duration-500 flex items-center`}
                  style={{
                    width: `${(stageCounts[stage] / maxCount) * 100}%`,
                    minWidth: stageCounts[stage] > 0 ? "2rem" : "0",
                  }}
                >
                  {stageCounts[stage] > 0 && (
                    <span className="text-xs font-bold text-white px-2">
                      {stageCounts[stage]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
