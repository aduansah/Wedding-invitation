"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { COUPLE } from "@/lib/constants";
import type { RsvpSubmission } from "@/lib/rsvpTypes";

export default function RsvpAdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([]);

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

  return (
    <main className="min-h-screen bg-[#fffcf9] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="font-[family-name:var(--font-sans)] text-xs font-semibold tracking-[0.28em] text-purple uppercase">
          Admin
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-purple-deep md:text-4xl">
          {COUPLE.full} RSVP List
        </h1>

        {!authed ? (
          <form onSubmit={handleLogin} className="mx-auto mt-10 max-w-md">
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
        ) : (
          <>
            <p className="mt-4 font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
              {submissions.length} guest{submissions.length === 1 ? "" : "s"} confirmed
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm">
              <table className="min-w-full text-left">
                <thead className="border-b border-gold/20 bg-[#fff8f2]">
                  <tr>
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
                  {submissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center font-[family-name:var(--font-sans)] text-sm text-charcoal-soft"
                      >
                        No RSVPs yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((entry) => (
                      <tr key={entry.id} className="border-b border-gold/10 last:border-b-0">
                        <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal">
                          {entry.firstName}
                        </td>
                        <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal">
                          {entry.lastName}
                        </td>
                        <td className="px-4 py-3 font-[family-name:var(--font-sans)] text-sm text-charcoal-soft">
                          {new Date(entry.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
