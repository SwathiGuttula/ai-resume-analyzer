"use client";

import { useState, useRef } from "react";

interface Analysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  roast: string;
  improvements: string[];
  missingKeywords: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    setFile(f);
    setError(null);
    setAnalysis(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBorder = (score: number) => {
    if (score >= 8) return "border-emerald-400";
    if (score >= 6) return "border-amber-400";
    return "border-red-400";
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-violet-400 text-xl">⚡</span>
            <span className="font-bold tracking-tight text-lg">ResumeAI</span>
          </div>
          <span className="text-xs text-white/30 font-mono">llama-3.3-70b · groq</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-12">
          <p className="text-xs font-mono text-violet-400 tracking-widest uppercase mb-4">AI Resume Analyzer</p>
          <h1 className="text-5xl font-black tracking-tight leading-none mb-4">
            Get roasted.<br />
            <span className="text-white/30">Get hired.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-md">
            Upload your resume. Our AI gives you brutal honesty — score, strengths, weaknesses, and exactly what to fix.
          </p>
        </div>

        {/* Upload */}
        <div
          className={`relative border rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-4
            ${isDragging
              ? "border-violet-400 bg-violet-500/10"
              : file
              ? "border-violet-500/50 bg-violet-500/5"
              : "border-white/10 bg-white/[0.02] hover:border-violet-500/40 hover:bg-white/[0.04]"
            }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <div>
              <div className="text-4xl mb-3">📄</div>
              <p className="text-violet-300 font-semibold">{file.name}</p>
              <p className="text-white/30 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB · click to change</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3 opacity-40">↑</div>
              <p className="text-white/60 font-medium">Drop your resume here</p>
              <p className="text-white/25 text-sm mt-1">PDF only · max 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200
            bg-violet-600 hover:bg-violet-500 active:scale-[0.99]
            disabled:opacity-30 disabled:cursor-not-allowed mb-16"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : "Analyze Resume →"}
        </button>

        {/* Results */}
        {analysis && (
          <div className="space-y-6 animate-fadeIn">
            {/* Score */}
            <div className="flex items-center gap-6 p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center flex-shrink-0 ${getScoreBorder(analysis.score)}`}>
                <span className={`text-4xl font-black ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </span>
              </div>
              <div>
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Overall Score</p>
                <p className="text-white/70 leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            {/* Roast */}
            <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
              <p className="text-xs font-mono text-orange-400/70 uppercase tracking-widest mb-3">🔥 The Roast</p>
              <p className="text-white/80 italic leading-relaxed">"{analysis.roast}"</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest mb-4">✓ Strengths</p>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-white/70 text-sm">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <p className="text-xs font-mono text-red-400/70 uppercase tracking-widest mb-4">✗ Weaknesses</p>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-2 text-white/70 text-sm">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvements */}
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">→ What to Fix</p>
              <ol className="space-y-3">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-4 text-white/70 text-sm">
                    <span className="text-violet-400 font-mono font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {imp}
                  </li>
                ))}
              </ol>
            </div>

            {/* Missing Keywords */}
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">⚑ Missing Keywords</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm rounded-full font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Analyze again */}
            <button
              onClick={() => { setAnalysis(null); setFile(null); }}
              className="w-full py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all text-sm"
            >
              Analyze another resume
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
