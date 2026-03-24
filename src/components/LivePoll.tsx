"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Vote from "@/types/Vote";

const CHOICES = [
  {
    label: "Shenmue II",
    barClass: "bg-gradient-to-r from-sky-400 to-cyan-400",
    dotClass: "bg-sky-400",
    ringClass: "ring-sky-400/40",
    selectedBg: "bg-sky-400/15 border-sky-400/60",
    idleBg: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
  },
  {
    label: "Shenmue II en vert",
    barClass: "bg-gradient-to-r from-emerald-400 to-teal-400",
    dotClass: "bg-emerald-400",
    ringClass: "ring-emerald-400/40",
    selectedBg: "bg-emerald-400/15 border-emerald-400/60",
    idleBg: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
  },
  {
    label: "Shenmue II en orange",
    barClass: "bg-gradient-to-r from-amber-400 to-orange-400",
    dotClass: "bg-amber-400",
    ringClass: "ring-amber-400/40",
    selectedBg: "bg-amber-400/15 border-amber-400/60",
    idleBg: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
  },
];

export default function LivePoll() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function fetchVotes() {
      const request = await fetch("/api/votes");
      if (request.ok) {
        const data = await request.json();
        setVotes(data);
      }
    }

    fetchVotes();
    const intervalId = setInterval(fetchVotes, 2000);
    return () => clearInterval(intervalId);
  }, []);

  async function handleVote() {
    if (!selected) return;
    setSubmitting(true);
    const request = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: selected }),
    });

    if (request.ok) {
      const newVote = await request.json();
      setVotes((prev) => [...prev, newVote]);
    }
    setSubmitting(false);
  }

  const hasVoted = votes.some((v) => v.userId === session?.user?.id);
  const totalVotes = votes.length;
  const userChoice = votes.find((v) => v.userId === session?.user?.id)?.choice;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        {/* <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 rounded-full mb-4">
          🔴&nbsp; Sondage en direct
        </span> */}
        <h2 className="text-2xl font-bold text-white">
          Quelle est le meilleur jeu de tous les temps ?
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"} au total
        </p>
      </div>

      {/* Options list */}
      <div className="space-y-3">
        {CHOICES.map((choice) => {
          const count = votes.filter((v) => v.choice === choice.label).length;
          const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
          const isSelected = selected === choice.label;
          const isUserChoice = userChoice === choice.label;

          if (!hasVoted && session) {
            // === VOTING MODE: clickable rows ===
            return (
              <button
                key={choice.label}
                onClick={() => setSelected(choice.label)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? `${choice.selectedBg} ring-2 ${choice.ringClass}`
                    : choice.idleBg
                }`}
              >
                {/* Radio dot */}
                <span
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? `${choice.dotClass} border-transparent`
                      : "border-slate-600"
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>

                <span className={`flex-1 font-medium text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>
                  {choice.label}
                </span>

                {isSelected && (
                  <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          }

          // === RESULTS MODE: rows with progress bars ===
          return (
            <div
              key={choice.label}
              className={`relative overflow-hidden px-5 py-4 rounded-2xl border transition-all duration-500 ${
                isUserChoice
                  ? `${choice.selectedBg} ring-1 ${choice.ringClass}`
                  : "bg-white/5 border-white/10"
              }`}
            >
              {/* Progress bar background */}
              <div
                className={`absolute inset-0 ${choice.barClass} opacity-10 transition-all duration-700 ease-out rounded-2xl`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative flex items-center gap-4">
                <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${choice.dotClass}`} />

                <span className="flex-1 font-medium text-sm text-slate-200">
                  {choice.label}
                </span>

                {isUserChoice && (
                  <span className="text-xs font-medium text-white/50 mr-2">Votre choix</span>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{count} vote{count !== 1 ? "s" : ""}</span>
                  <span className="text-sm font-bold text-white tabular-nums w-10 text-right">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA / status */}
      {!hasVoted && session ? (
        <button
          onClick={handleVote}
          disabled={!selected || submitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              Confirmer mon vote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      ) : !session ? (
        <div className="flex items-center justify-center gap-3 py-4 px-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-semibold">Connectez-vous pour voter</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3 py-3 px-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Votre vote a été enregistré</span>
        </div>
      )}
    </div>
  );
}