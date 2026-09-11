"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Application, Stage, STAGES } from "@/lib/types";
import ApplicationForm from "@/components/ApplicationForm";
import ListView from "@/components/ListView";
import KanbanBoard from "@/components/KanbanBoard";
import Analytics from "@/components/Analytics";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type ViewMode = "list" | "kanban";

interface PrefillData {
  company?: string;
  role?: string;
  job_link?: string;
  source?: string;
}

function DashboardInner() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [prefill, setPrefill] = useState<PrefillData | undefined>();

  useEffect(() => {
    const company = searchParams.get("company");
    const role = searchParams.get("role");
    const job_link = searchParams.get("job_link");
    const source = searchParams.get("source");
    if (company || role || job_link) {
      setPrefill({
        company: company || "",
        role: role || "",
        job_link: job_link || "",
        source: source || "LinkedIn",
      });
      setShowForm(true);
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  const fetchApplications = useCallback(async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return;
    }
    setApplications(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleAdd(data: Partial<Application>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("applications")
      .insert({ ...data, user_id: user.id });

    if (error) {
      alert("Error adding application: " + error.message);
      return;
    }
    setShowForm(false);
    fetchApplications();
  }

  async function handleEdit(data: Partial<Application>) {
    if (!editingApp) return;

    const { error } = await supabase
      .from("applications")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", editingApp.id);

    if (error) {
      alert("Error updating application: " + error.message);
      return;
    }
    setEditingApp(undefined);
    fetchApplications();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting application: " + error.message);
      return;
    }
    fetchApplications();
  }

  async function handleStageChange(id: string, stage: Stage) {
    const { error } = await supabase
      .from("applications")
      .update({ stage, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Error updating stage: " + error.message);
      return;
    }
    fetchApplications();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function exportCSV() {
    const headers = [
      "Company",
      "Role",
      "Stage",
      "Priority",
      "Source",
      "Applied Date",
      "Compensation",
      "Contact",
      "Job Link",
      "Next Step",
      "Next Step Date",
      "Notes",
    ];

    const rows = applications.map((app) => [
      app.company,
      app.role,
      app.stage,
      app.priority,
      app.source,
      app.applied_date || "",
      app.compensation || "",
      app.contact || "",
      app.job_link || "",
      app.next_step || "",
      app.next_step_date || "",
      (app.notes || "").replace(/"/g, '""'),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = applications.filter((app) => {
    const matchesSearch =
      search === "" ||
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase()) ||
      (app.contact || "").toLowerCase().includes(search.toLowerCase()) ||
      (app.notes || "").toLowerCase().includes(search.toLowerCase());

    const matchesStage = stageFilter === "All" || app.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            Job Tracker
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="/bookmarklet"
              className="text-sm text-blue-600 hover:text-blue-800 transition"
            >
              LinkedIn Saver
            </a>
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-500 hover:text-slate-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => {
                setEditingApp(undefined);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              + Add Application
            </button>

            <div className="flex bg-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  viewMode === "list"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Board
              </button>
            </div>

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                showAnalytics
                  ? "bg-slate-800 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              Analytics
            </button>

            <button
              onClick={exportCSV}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
            >
              Export CSV
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
            />
            <select
              value={stageFilter}
              onChange={(e) =>
                setStageFilter(e.target.value as Stage | "All")
              }
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
            >
              <option value="All">All Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Analytics applications={applications} />
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          {viewMode === "list" ? (
            <ListView
              applications={filtered}
              onEdit={(app) => {
                setEditingApp(app);
                setShowForm(false);
              }}
              onDelete={handleDelete}
            />
          ) : (
            <KanbanBoard
              applications={filtered}
              onEdit={(app) => {
                setEditingApp(app);
                setShowForm(false);
              }}
              onDelete={handleDelete}
              onStageChange={handleStageChange}
            />
          )}
        </div>

        <div className="text-center text-xs text-slate-400 pb-4">
          {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
        </div>
      </main>

      {/* Add Form Modal */}
      {showForm && (
        <ApplicationForm
          prefill={prefill}
          onSubmit={(data) => {
            handleAdd(data);
            setPrefill(undefined);
          }}
          onCancel={() => {
            setShowForm(false);
            setPrefill(undefined);
          }}
        />
      )}

      {/* Edit Form Modal */}
      {editingApp && (
        <ApplicationForm
          application={editingApp}
          onSubmit={handleEdit}
          onCancel={() => setEditingApp(undefined)}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-400">Loading...</div></div>}>
      <DashboardInner />
    </Suspense>
  );
}
