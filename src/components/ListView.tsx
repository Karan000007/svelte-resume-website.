"use client";

import { Application, STAGE_COLORS, PRIORITY_COLORS } from "@/lib/types";

interface Props {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  calendarConnected?: boolean;
  onSyncCalendar?: (app: Application) => void;
}

function isOverdue(nextStepDate: string | null): boolean {
  if (!nextStepDate) return false;
  return new Date(nextStepDate + "T23:59:59") < new Date();
}

export default function ListView({ applications, onEdit, onDelete, calendarConnected, onSyncCalendar }: Props) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg">No applications yet</p>
        <p className="text-sm mt-1">Click &quot;Add Application&quot; to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Company</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Role</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Stage</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Priority</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Source</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Applied</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Next Step</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const overdue = isOverdue(app.next_step_date);
            return (
              <tr
                key={app.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition ${
                  overdue ? "bg-red-50/50" : ""
                }`}
              >
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-800">{app.company}</div>
                  {app.compensation && (
                    <div className="text-xs text-slate-400">{app.compensation}</div>
                  )}
                </td>
                <td className="py-3 px-3 text-slate-700">
                  {app.job_link ? (
                    <a
                      href={app.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {app.role}
                    </a>
                  ) : (
                    app.role
                  )}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      STAGE_COLORS[app.stage]
                    }`}
                  >
                    {app.stage}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      PRIORITY_COLORS[app.priority]
                    }`}
                  >
                    {app.priority}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">{app.source}</td>
                <td className="py-3 px-3 text-slate-600">
                  {app.applied_date || "—"}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    {overdue && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                        OVERDUE
                      </span>
                    )}
                    <div>
                      <div className="text-slate-700">{app.next_step || "—"}</div>
                      {app.next_step_date && (
                        <div className={`text-xs ${overdue ? "text-red-500 font-medium" : "text-slate-400"}`}>
                          {app.next_step_date}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(app)}
                      className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      Edit
                    </button>
                    {calendarConnected && app.next_step && app.next_step_date && (
                      <button
                        onClick={() => onSyncCalendar?.(app)}
                        className="px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded transition"
                      >
                        Cal
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${app.company} - ${app.role}?`)) {
                          onDelete(app.id);
                        }
                      }}
                      className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
