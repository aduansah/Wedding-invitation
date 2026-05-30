"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, LogOut, RefreshCw, Trash2, Users } from "lucide-react";
import { COUPLE } from "@/lib/constants";
import { markIntroComplete, signalMusicPause } from "@/lib/weddingSession";
import type { RsvpSubmission } from "@/lib/rsvpTypes";

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function RsvpAdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([]);

  const latestSubmission = submissions[0];

  const loadSubmissions = useCallback(async () => {
    const response = await fetch("/api/rsvp/admin/submissions", {
      cache: "no-store",
    });

    if (response.status === 401) {
      setAuthed(false);
      return;
    }

    if (!response.ok) {
      setError("Unable to load RSVP list.");
      return;
    }

    const data = (await response.json()) as { submissions: RsvpSubmission[] };
    setSubmissions(data.submissions);
    setAuthed(true);
    setError("");
  }, []);

  useEffect(() => {
    void loadSubmissions();
    signalMusicPause();
  }, [loadSubmissions]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rsvp/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Incorrect password.");
        return;
      }

      setPassword("");
      await loadSubmissions();
    } catch {
      setError("Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await fetch("/api/rsvp/admin/logout", { method: "POST" });
    setAuthed(false);
    setSubmissions([]);
  };

  const csvContent = useMemo(() => {
    const header = "First Name,Last Name,Submitted\n";
    const rows = submissions
      .map(
        (entry) =>
          `"${entry.firstName.replace(/"/g, '""')}","${entry.lastName.replace(/"/g, '""')}","${entry.createdAt}"`,
      )
      .join("\n");
    return header + rows;
  }, [submissions]);

  const handleExport = () => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding-rsvps.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Clear all RSVP submissions? This cannot be undone.",
    );
    if (!confirmed) return;

    setClearing(true);
    setError("");

    try {
      const response = await fetch("/api/rsvp/admin/clear", { method: "POST" });
      if (!response.ok) {
        setError("Unable to clear RSVP data.");
        return;
      }

      await loadSubmissions();
    } catch {
      setError("Unable to clear RSVP data.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffcf9] via-[#fff8f2] to-[#fceee6] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 space-y-5 sm:mb-8">
          <Link
            href="/"
            onClick={() => markIntroComplete()}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/90 px-4 py-2 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.16em] text-purple uppercase shadow-sm transition hover:border-purple/30 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>

          <div>
            <p className="font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.28em] text-purple uppercase">
              Admin Portal
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl text-purple-deep sm:text-3xl md:text-4xl">
              {COUPLE.full} RSVPs
            </h1>
            <p className="mt-2 max-w-xl font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
              View and export guest confirmations submitted through the wedding site.
            </p>
          </div>

          {authed ? (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-white px-3 py-2.5 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.12em] text-purple uppercase transition hover:border-purple/30 disabled:opacity-60 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                <RefreshCw className={`h-4 w-4 shrink-0 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={submissions.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-purple/20 bg-purple px-3 py-2.5 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.12em] text-white uppercase transition hover:bg-purple-deep disabled:opacity-60 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                <Download className="h-4 w-4 shrink-0" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => void handleClearAll()}
                disabled={clearing || submissions.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2.5 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.12em] text-red-600 uppercase transition hover:bg-red-50 disabled:opacity-60 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                <Trash2 className={`h-4 w-4 shrink-0 ${clearing ? "animate-pulse" : ""}`} />
                Clear all
              </button>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-white/80 px-3 py-2.5 font-[family-name:var(--font-sans)] text-[11px] font-semibold tracking-[0.12em] text-charcoal-soft uppercase transition hover:border-red-200 hover:text-red-600 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>

        {!authed ? (
          <div className="mx-auto max-w-md rounded-3xl border border-gold/25 bg-white/90 p-8 shadow-[0_16px_40px_rgba(74,45,110,0.08)] backdrop-blur-sm">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-purple-deep">
              Sign in
            </h2>
            <p className="mt-2 font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
              Enter the admin password to view RSVP submissions.
            </p>

            <form onSubmit={handleLogin} className="mt-6">
              <label className="block font-[family-name:var(--font-sans)] text-sm font-medium text-charcoal">
                Admin password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gold/35 bg-white px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal outline-none ring-purple/20 focus:border-purple/40 focus:ring-2"
                  autoComplete="current-password"
                  required
                />
              </label>
              {error ? (
                <p className="mt-3 font-[family-name:var(--font-sans)] text-sm text-red-600">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-full border border-purple/20 bg-purple px-6 py-3 font-[family-name:var(--font-sans)] text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-purple-deep disabled:opacity-60"
              >
                {loading ? "Signing in..." : "View RSVPs"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
              <div className="rounded-2xl border border-gold/25 bg-white/90 p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8dde4] text-purple">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.16em] text-charcoal-soft uppercase sm:text-xs sm:tracking-[0.18em]">
                      Total RSVPs
                    </p>
                    <p className="font-[family-name:var(--font-playfair)] text-2xl text-purple-deep sm:text-3xl">
                      {submissions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gold/25 bg-white/90 p-4 shadow-sm sm:col-span-2 sm:p-5">
                <p className="font-[family-name:var(--font-sans)] text-[10px] tracking-[0.16em] text-charcoal-soft uppercase sm:text-xs sm:tracking-[0.18em]">
                  Latest submission
                </p>
                <p className="mt-1.5 truncate font-[family-name:var(--font-playfair)] text-lg text-purple-deep sm:mt-2 sm:text-xl md:text-2xl">
                  {latestSubmission
                    ? `${latestSubmission.firstName} ${latestSubmission.lastName}`
                    : "No submissions yet"}
                </p>
                <p className="mt-1 font-[family-name:var(--font-sans)] text-xs text-charcoal-soft sm:text-sm">
                  {latestSubmission ? formatDate(latestSubmission.createdAt) : "Waiting for the first RSVP"}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-[0_12px_32px_rgba(74,45,110,0.06)]">
              <div className="border-b border-gold/20 bg-[#fff8f2] px-4 py-3">
                <p className="font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.18em] text-purple uppercase">
                  All submissions
                </p>
              </div>

              {submissions.length === 0 ? (
                <p className="px-4 py-10 text-center font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
                  No RSVPs yet. Share the site and they&apos;ll appear here.
                </p>
              ) : (
                <>
                  <div className="divide-y divide-gold/10 md:hidden">
                    {submissions.map((entry, index) => (
                      <div key={entry.id} className="px-4 py-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-[family-name:var(--font-sans)] text-[10px] font-semibold tracking-[0.14em] text-purple/70 uppercase">
                              #{index + 1}
                            </p>
                            <p className="mt-0.5 truncate font-[family-name:var(--font-playfair)] text-lg text-purple-deep">
                              {entry.firstName} {entry.lastName}
                            </p>
                          </div>
                          <p className="shrink-0 pt-1 font-[family-name:var(--font-sans)] text-[11px] leading-snug text-charcoal-soft">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full text-left">
                      <thead className="border-b border-gold/20 bg-[#fff8f2]">
                        <tr>
                          <th className="px-4 py-3 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.18em] text-purple uppercase">
                            #
                          </th>
                          <th className="px-4 py-3 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.18em] text-purple uppercase">
                            First name
                          </th>
                          <th className="px-4 py-3 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.18em] text-purple uppercase">
                            Last name
                          </th>
                          <th className="px-4 py-3 font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.18em] text-purple uppercase">
                            Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((entry, index) => (
                          <tr
                            key={entry.id}
                            className="border-b border-gold/10 transition hover:bg-[#fffaf5] last:border-b-0"
                          >
                            <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm font-medium text-charcoal">
                              {entry.firstName}
                            </td>
                            <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm font-medium text-charcoal">
                              {entry.lastName}
                            </td>
                            <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
                              {formatDate(entry.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
