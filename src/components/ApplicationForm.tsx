"use client";

import { Application, STAGES, PRIORITIES, SOURCES, Stage, Priority, Source } from "@/lib/types";
import { useState } from "react";

interface PrefillData {
  company?: string;
  role?: string;
  job_link?: string;
  source?: string;
}

interface Props {
  application?: Application;
  prefill?: PrefillData;
  onSubmit: (data: Partial<Application>) => void;
  onCancel: () => void;
}

export default function ApplicationForm({ application, prefill, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    company: application?.company ?? prefill?.company ?? "",
    role: application?.role ?? prefill?.role ?? "",
    stage: application?.stage ?? ("Saved" as Stage),
    priority: application?.priority ?? ("Medium" as Priority),
    source: application?.source ?? (prefill?.source as Source) ?? ("LinkedIn" as Source),
    applied_date: application?.applied_date ?? "",
    compensation: application?.compensation ?? "",
    contact: application?.contact ?? "",
    job_link: application?.job_link ?? prefill?.job_link ?? "",
    next_step: application?.next_step ?? "",
    next_step_date: application?.next_step_date ?? "",
    notes: application?.notes ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...form,
      applied_date: form.applied_date || null,
      compensation: form.compensation || null,
      contact: form.contact || null,
      job_link: form.job_link || null,
      next_step: form.next_step || null,
      next_step_date: form.next_step_date || null,
      notes: form.notes || null,
    });
  }

  const inputClass =
    "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-800";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {application ? "Edit Application" : "Add Application"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company *</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. Google"
                />
              </div>
              <div>
                <label className={labelClass}>Role *</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. Product Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Stage</label>
                <select
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Source</label>
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Applied Date</label>
                <input
                  type="date"
                  name="applied_date"
                  value={form.applied_date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Compensation</label>
                <input
                  name="compensation"
                  value={form.compensation}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. $120k-$150k"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Jane Smith, recruiter"
                />
              </div>
              <div>
                <label className={labelClass}>Job Link</label>
                <input
                  name="job_link"
                  value={form.job_link}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Next Step</label>
                <input
                  name="next_step"
                  value={form.next_step}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Phone screen with HR"
                />
              </div>
              <div>
                <label className={labelClass}>Next Step Date</label>
                <input
                  type="date"
                  name="next_step_date"
                  value={form.next_step_date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Any extra notes..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                {application ? "Save Changes" : "Add Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
