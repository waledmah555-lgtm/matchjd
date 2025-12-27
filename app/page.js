"use client";

import { useState } from "react";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function generate() {
    setErr("");
    setResult("");

    if (!resumeText.trim() || !jobDescription.trim()) {
      setErr("Please paste both Resume text and Job Description.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Something went wrong");

      setResult(data.result || "");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <h1 style={{ margin: 0 }}>MatchJD</h1>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          No fake skills • No invented experience • ATS-friendly
        </div>
      </div>

      <p style={{ marginTop: 10, lineHeight: 1.5 }}>
        Paste your <b>resume text</b> and a <b>job description</b>. MatchJD rewrites and reorders your resume to align
        with the JD — using <b>only your real information</b>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
        <label style={{ fontWeight: 700 }}>Resume Text (paste here)</label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={10}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
          placeholder="Paste your resume text here (for MVP, paste text directly)."
        />

        <label style={{ fontWeight: 700 }}>Job Description (paste here)</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
          placeholder="Paste the full job description here."
        />

        <button
          onClick={generate}
          disabled={loading}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #000",
            background: loading ? "#ddd" : "#000",
            color: loading ? "#000" : "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700
          }}
        >
          {loading ? "Generating..." : "Generate Tailored Resume"}
        </button>

        {err ? (
          <div style={{ padding: 12, borderRadius: 12, background: "#ffe6e6", border: "1px solid #ffb3b3" }}>
            {err}
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ margin: "18px 0 8px" }}>Result</h2>
          <button
            onClick={copyResult}
            disabled={!result}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: !result ? "#f4f4f4" : "#fff",
              cursor: !result ? "not-allowed" : "pointer"
            }}
          >
            Copy
          </button>
        </div>

        <textarea
          value={result}
          readOnly
          rows={18}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
          placeholder="Your tailored ATS-friendly resume will appear here."
        />

        <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.4 }}>
          <b>Note:</b> MatchJD does not add fake experience or skills. Always review before applying.
        </div>
      </div>
    </main>
  );
}
