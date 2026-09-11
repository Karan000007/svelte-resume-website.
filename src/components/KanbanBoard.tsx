"use client";

import { Application, STAGES, Stage, STAGE_COLORS, PRIORITY_COLORS } from "@/lib/types";

interface Props {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, stage: Stage) => void;
  calendarConnected?: boolean;
  onSyncCalendar?: (app: Application) => void;
}

function isOverdue(nextStepDate: string | null): boolean {
  if (!nextStepDate) return false;
  return new Date(nextStepDate + "T23:59:59") < new Date();
}

export default function KanbanBoard({
  applications,
  onEdit,
  onDelete,
  onStageChange,
  calendarConnected,
  onSyncCalendar,
}: Props) {
  const columns = STAGES.map((stage) => ({
    stage,
    apps: applications.filter((a) => a.stage === stage),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(({ stage, apps }) => (
        <div
          key={stage}
          className="flex-shrink-0 w-72"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const id = e.dataTransfer.getData("application-id");
            if (id) onStageChange(id, stage);
          }}
        >
          <div
            className={`rounded-t-lg px-3 py-2 border-t-4 ${STAGE_COLORS[stage]}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{stage}</span>
              <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                {apps.length}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-b-lg min-h-[200px] p-2 space-y-2">
            {apps.length === 0 && (
              <div className="text-center py-8 text-slate-300 text-sm">
                Drop here
              </div>
            )}
            {apps.map((app) => {
              const overdue = isOverdue(app.next_step_date);
              return (
                <div
                  key={app.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("application-id", app.id)
                  }
                  className={`bg-white rounded-lg p-3 shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition ${
                    overdue ? "border-red-300 bg-red-50/30" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-slate-800 text-sm truncate">
                        {app.company}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {app.role}
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${
                        PRIORITY_COLORS[app.priority]
                      }`}
                    >
                      {app.priority[0]}
                    </span>
                  </div>

                  {app.next_step && (
                    <div className="mt-2 text-xs text-slate-500">
                      <span className="text-slate-400">Next:</span>{" "}
                      {app.next_step}
                    </div>
                  )}

                  {overdue && (
                    <div className="mt-1 text-xs font-bold text-red-600">
                      OVERDUE — {app.next_step_date}
                    </div>
                  )}

                  {app.compensation && (
                    <div className="mt-1 text-xs text-slate-400">
                      {app.compensation}
                    </div>
                  )}

                  <div className="mt-2 flex gap-1 border-t border-slate-100 pt-2">
                    <button
                      onClick={() => onEdit(app)}
                      className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded transition"
                    >
                      Edit
                    </button>
                    {calendarConnected && app.next_step && app.next_step_date && (
                      <button
                        onClick={() => onSyncCalendar?.(app)}
                        className="text-xs text-green-600 hover:bg-green-50 px-2 py-0.5 rounded transition"
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
                      className="text-xs text-red-600 hover:bg-red-50 px-2 py-0.5 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
