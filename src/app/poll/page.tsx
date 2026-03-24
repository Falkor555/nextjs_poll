import LogoutButton from "@/components/LogoutButton";
import LivePoll from "@/components/LivePoll";

export default function PollPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      {/* Header */}
      <header className="max-w-2xl mx-auto flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">PollApp</span>
        </div>
        <LogoutButton />
      </header>

      {/* Poll Card */}
      <main className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <LivePoll />
        </div>
      </main>
    </div>
  );
}