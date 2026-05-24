import React, { useState } from "react";
import { motion } from "motion/react";
import { Brain, Flame, Sparkles, Terminal, ArrowRight, User, HelpCircle, Info, ChevronRight, Zap } from "lucide-react";
import { UserProfile } from "../types";

interface LandingPageProps {
  userProfile: UserProfile;
  selectedMentor: string;
  onMentorChange: (mentor: string) => void;
  onAnalyze: (idea: string, brutalMode: boolean) => void;
  isLoading: boolean;
  onSignOut?: () => void;
}

const EXAMPLES = [
  { text: "AI app designed for dentists to generate patient charts live", label: "Dentist AI" },
  { text: "Uber but for heavy construction trucks and excavator logistics", label: "Uber for Trucks" },
  { text: "Marketplace for high-scoring direct college lecture study sheets", label: "Study Exchange" },
  { text: "No-code Telegram bot builder with instant micro-payments", label: "Bot Creator" },
  { text: "Substack competitor but specifically designed for acoustic musicians and songwriters", label: "Acoustic Hub" },
];

const METRIC_INFOS = [
  { title: "Originality Rating", desc: "Is it a cookie-cutter clones list or truly breaking new ground?" },
  { title: "Business Viability", desc: "Can this system sustain itself with reasonable unit economics?" },
  { title: "Pain Saturation", desc: "How desperate are target clients to solve this problem?" },
];

export default function LandingPage({
  userProfile,
  selectedMentor,
  onMentorChange,
  onAnalyze,
  isLoading,
  onSignOut,
}: LandingPageProps) {
  const [ideaInput, setIdeaInput] = useState("");
  const [brutalMode, setBrutalMode] = useState(true);
  const [showHelper, setShowHelper] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaInput.trim() || isLoading) return;
    onAnalyze(ideaInput.trim(), brutalMode);
  };

  const handlePreseed = (exampleText: string) => {
    if (isLoading) return;
    setIdeaInput(exampleText);
  };

  return (
    <div id="landing-page-root" className="w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Upper Bio Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-900/5 rounded-xl border border-slate-200/50 mb-10 text-xs sm:text-sm text-slate-600 gap-3" id="bio-bar">
        <div className="flex items-center space-x-2.5">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full border border-orange-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-semibold text-slate-800">Hello, {userProfile.name}!</span>
            <span className="text-slate-400 capitalize border-l border-slate-300 ml-2 pl-2 text-[11px] font-mono">{userProfile.role}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Advisor:</span>
            <select
              id="advisor-selector"
              value={selectedMentor}
              onChange={(e) => onMentorChange(e.target.value)}
              className="bg-white px-2.5 py-1 text-slate-700 font-medium rounded-md border border-slate-200 text-xs focus:ring-1 focus:ring-yc-orange focus:outline-none cursor-pointer"
            >
              <option value="Cynical VC">💼 Cynical VC (Aesthetic Roast)</option>
              <option value="Silicon Valley Guru">🦄 SV Guru (Buzzwords)</option>
              <option value="Pragmatic Hacker">🛠️ Pragmatic Hacker (Execution)</option>
            </select>
          </div>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 hover:text-red-700 text-slate-700 text-xs font-bold rounded-lg uppercase select-none transition-all cursor-pointer border border-slate-250"
              title="Sign out of system portal"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Main Pitch Card */}
      <div className="text-center mb-10" id="landing-header">
        <div className="inline-flex items-center space-x-1.5 bg-orange-100 text-yc-orange px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={12} />
          <span>Silicon Valley Incubator AI</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-4">
          Rate My Startup Idea
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-sans leading-relaxed">
          Submit your product vision in plain English. Get high-fidelity scores, structural roasts, monetization flows, competitor scanners, and direct investor metrics.
        </p>
      </div>

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-6" id="concept-submission-form">
        <div className="glassmorphism rounded-2xl shadow-xl border border-slate-200/50 p-6 sm:p-8 relative premium-glow">
          <div className="flex justify-between items-center mb-3">
            <label htmlFor="idea-textarea" className="font-display font-bold text-slate-800 text-lg sm:text-xl flex items-center space-x-2">
              <Brain className="text-yc-orange animate-pulse" size={20} />
              <span>Describe Your Startup Concept</span>
            </label>
            
            <button
              id="helper-info-btn"
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title="Help information"
            >
              <Info size={18} />
            </button>
          </div>

          {/* Quick FAQ info toggle */}
          {showHelper && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-500 mb-4 leading-relaxed space-y-1.5"
              id="faq-helper-panel"
            >
              <p className="font-semibold text-slate-700">💡 How to pitch correctly:</p>
              <p>Be concise but specific. Mention: "Who the user is", "What service you provide", and "Why it's better than manual methods." Avoid generic titles like "Social site". Specifying core mechanics generates a far higher quality assessment.</p>
            </motion.div>
          )}

          <div className="relative">
            <textarea
              id="idea-textarea"
              rows={4}
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. A marketplace styled like Uber, but matching qualified regional truck drivers with warehouses that need heavy container transports same day..."
              className="w-full text-slate-800 p-4 border border-slate-200 rounded-xl bg-white/70 focus:outline-none focus:border-yc-orange focus:ring-1 focus:ring-yc-orange transition-all placeholder:text-slate-400 text-sm italic pr-10"
            />
            <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-400">
              {ideaInput.length} chars
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 items-center">
            
            {/* Brutal Honesty System */}
            <div className="flex items-center space-x-3 bg-white/60 p-3 rounded-lg border border-slate-200/70 select-none">
              <div className="p-2 bg-red-50 text-red-500 rounded-md">
                <Flame size={18} className={brutalMode ? "animate-bounce" : ""} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 font-display">Brutal Honesty Mode</span>
                  <input
                    id="brutal-mode-toggle"
                    type="checkbox"
                    checked={brutalMode}
                    onChange={(e) => setBrutalMode(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 text-yc-orange accent-yc-orange rounded cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Instructs AI to be direct, witty, and savage with assumptions.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="analyze-submit-btn"
              type="submit"
              disabled={isLoading || !ideaInput.trim()}
              className={`w-full py-3.5 px-6 font-display font-semibold rounded-xl text-white text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
                isLoading || !ideaInput.trim()
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-yc-orange hover:bg-orange-650 cursor-pointer active:scale-[0.99] border border-orange-500"
              }`}
            >
              <span>{isLoading ? "Consulting Partner Panel..." : "Assess My Concept"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* Recommended Examples */}
      <div className="mt-8" id="examples-preseed-section">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-display">
          Or Select a pre-seeded Startup Idea:
        </h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, index) => (
            <button
              key={index}
              id={`example-badge-${index}`}
              onClick={() => handlePreseed(ex.text)}
              disabled={isLoading}
              type="button"
              className="text-xs px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:border-yc-orange hover:bg-orange-50/20 text-slate-600 hover:text-yc-orange transition-all cursor-pointer font-medium"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Stats Bento Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12" id="info-bento-grid">
        {METRIC_INFOS.map((info, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl text-left shadow-sm">
            <div className="w-6 h-6 rounded-full bg-slate-50 font-mono text-[10px] font-bold text-slate-400 flex items-center justify-center mb-2.5">
              0{idx + 1}
            </div>
            <h4 className="font-display font-bold text-slate-800 text-xs mb-1 uppercase tracking-tight">{info.title}</h4>
            <p className="text-xs text-slate-400 leading-normal">{info.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
