import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  StartupAnalysis,
  SavedIdea,
  UserProfile,
  Competitor,
  MonetizationModel,
  RoadmapPhase
} from "../types";
import {
  Sparkles,
  Flame,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Coins,
  Cpu,
  Map,
  Users,
  Briefcase,
  Share2,
  Trash2,
  Brain,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Info,
  DollarSign,
  Download,
  Award,
  ChevronRight,
  RefreshCw,
  Search
} from "lucide-react";

interface WorkspaceProps {
  userProfile: UserProfile;
  selectedMentor: string;
  activeAnalysis: StartupAnalysis;
  savedIdeas: SavedIdea[];
  onSelectSavedIdea: (analysis: StartupAnalysis) => void;
  onDeleteSavedIdea: (id: string) => void;
  onUpdateProfile: (p: UserProfile, mentor: string) => void;
  onAnalyzeNew: (idea: string, brutalMode: boolean) => void;
  onGoBackToInput: () => void;
  isReanalyzing: boolean;
  onSignOut?: () => void;
}

export default function Workspace({
  userProfile,
  selectedMentor,
  activeAnalysis,
  savedIdeas,
  onSelectSavedIdea,
  onDeleteSavedIdea,
  onUpdateProfile,
  onAnalyzeNew,
  onGoBackToInput,
  isReanalyzing,
  onSignOut
}: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "analyzer" | "market" | "competitors" | "sharing" | "saved">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "score_desc" | "score_asc">("date_desc");
  
  // Follow-up Savage Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Social share card state
  const [isCardCopied, setIsCardCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Profile Edit
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempRole, setTempRole] = useState(userProfile.role);
  const [tempBackground, setTempBackground] = useState(userProfile.background);
  const [tempMentor, setTempMentor] = useState(selectedMentor);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  useEffect(() => {
    // Reset follow-up chat whenever the active analysis or mentor changes
    setChatHistory([
      {
        role: 'assistant',
        text: `Hey, I am your evaluator: ${selectedMentor}. Let's chat more about "${activeAnalysis.idea.substring(0, 30)}...". Ask me anything – how to improve it, pricing suggestions, or what features are total waste. ${
          activeAnalysis.brutalModeEnabled ? "Brace yourself, I'm in Brutal Mode." : "Constructive hat is on."
        }`
      }
    ]);
  }, [activeAnalysis.id, selectedMentor]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamedText]);

  // Handle stream calling
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isStreaming) return;

    const userText = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsStreaming(true);
    setStreamedText("");

    try {
      const queryParams = new URLSearchParams({
        idea: activeAnalysis.idea,
        brutalMode: activeAnalysis.brutalModeEnabled ? "true" : "false",
        personalityType: selectedMentor,
        message: userText
      });

      const eventSource = new EventSource(`/api/savage-chat-stream?${queryParams.toString()}`);

      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          setChatHistory(prev => [...prev, { role: 'assistant', text: streamedText }]);
          setStreamedText("");
          setIsStreaming(false);
        } else {
          try {
            const data = JSON.parse(event.data);
            if (data.text) {
              setStreamedText(prev => prev + data.text);
            } else if (data.error) {
              setStreamedText(prev => prev + `\n[Error from advisor: ${data.error}]`);
              eventSource.close();
              setIsStreaming(false);
            }
          } catch (err) {
            // Safe fallback logic
          }
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error encountered:", err);
        eventSource.close();
        setChatHistory(prev => [...prev, { role: 'assistant', text: "Sorry, the live container stream went cold. Let's restart the conversation." }]);
        setStreamedText("");
        setIsStreaming(false);
      };

    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', text: `Failed to speak with advisor: ${err.message || "Timeout error"}` }]);
      setIsStreaming(false);
    }
  };

  // Custom visual aids for categories
  const getTimingBadge = (label: string) => {
    switch (label) {
      case 'rising':
        return <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider h-max">🔥 High Growth</span>;
      case 'hyped':
        return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider h-max">🦄 Extreme Hype</span>;
      case 'declining':
        return <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider h-max">📉 Declining demand</span>;
      default:
        return <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider h-max">🗺️ Saturated Stable</span>;
    }
  };

  // Profile saver
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: tempName || "Founder",
      role: tempRole,
      background: tempBackground || "Enthusiastic technology hacker."
    };
    onUpdateProfile(updated, tempMentor);
    setProfileSuccessMsg("INCUBATOR CONFIGURATION COMMITTED!");
    setTimeout(() => {
      setProfileSuccessMsg("");
    }, 3000);
  };

  // Share Card Generator helpers
  const handleDownloadCard = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Social Share Card generated and simulated successfully!\nYou rated: "${activeAnalysis.idea.substring(0, 30)}..." with Score ${activeAnalysis.scores.overallScore}/100 and risk assessment from ${selectedMentor}!`);
    }, 800);
  };

  // Visualizing custom indicators
  const statsRow = [
    { label: "Master Score", value: activeAnalysis.scores.overallScore, color: "text-slate-900", border: "border-[#FF6600]" },
    { label: "VC Appetite", value: activeAnalysis.investor.vcInterestProbability + "%", color: "text-blue-600", secondary: activeAnalysis.investor.fundraisingDifficulty },
    { label: "Viral Factor", value: (activeAnalysis.scores.viralPotential / 10).toFixed(1) + "/10", color: "text-purple-600" },
    { label: "Survival Odds", value: activeAnalysis.scores.survivalChances + "%", color: "text-emerald-600", secondary: "Survival Expectancy" }
  ];

  return (
    <div id="workspace-container" className="flex flex-col bg-[#F4F7F9] font-sans text-slate-800 h-screen overflow-hidden">
      
      {/* Top Banner Navigation bar matching High Density */}
      <header className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200 shrink-0" id="portal-header">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 bg-[#FF6600] rounded-lg flex items-center justify-center text-white font-bold text-lg font-display">YC</div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">STARTUP INCUBATOR ANALYTICS</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">BRUTALLY HONEST EVALUATOR V2.4</p>
          </div>
        </div>

        {/* Dynamic Nav Switches */}
        <nav className="flex space-x-1" id="portal-navigation-tabs">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "dashboard" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Dashboard
          </button>
          <button
            id="tab-analyzer"
            onClick={() => setActiveTab("analyzer")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "analyzer" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Detailed Metrics
          </button>
          <button
            id="tab-market"
            onClick={() => setActiveTab("market")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "market" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Market & Pricing
          </button>
          <button
            id="tab-competitors"
            onClick={() => setActiveTab("competitors")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "competitors" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Competitors
          </button>
          <button
            id="tab-sharing"
            onClick={() => setActiveTab("sharing")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "sharing" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Viral Share Card
          </button>

          {/* Export compiled Report to high-fidelity print PDF */}
          <button
            id="export-pdf-report-btn"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-bold rounded-md bg-[#FF6600] text-white hover:bg-orange-600 transition-all flex items-center space-x-1 shrink-0 ml-1 cursor-pointer select-none border border-transparent"
            title="Download full executive PDF report package"
          >
            <span>PDF Export 📄</span>
          </button>
        </nav>

        <div className="flex items-center space-x-3 text-right">
          <div>
            <p className="text-xs font-bold text-slate-800">{userProfile.name}</p>
            <p className="text-[9px] text-[#FF6600] font-bold uppercase tracking-wider">{userProfile.role}</p>
          </div>
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-7 h-7 rounded-full border border-[#FF6600]/30 shadow-sm"
            referrerPolicy="no-referrer"
          />
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-700 transition-colors text-[10px] font-bold uppercase flex items-center space-x-1 border border-slate-200 cursor-pointer"
              title="Sign out from workspace"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex flex-1 overflow-hidden p-3 gap-3" id="portal-frame">
        
        {/* Leftmost Sidebar Panel: Concept Summary & Real-time Savage Chat */}
        <aside className="w-[305px] flex flex-col gap-3 shrink-0" id="portal-sidebar">
          {/* Active Concept Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex flex-col justify-between" id="active-concept-block">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">THE CONCEPT</h3>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  {activeAnalysis.market.category || "General Startup"}
                </span>
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-4 font-medium mb-2 bg-slate-50 p-2 rounded border border-slate-100">
                "{activeAnalysis.idea}"
              </p>
            </div>

            <div className="space-y-2 mt-1">
              <button
                id="sidebar-new-idea-btn"
                onClick={onGoBackToInput}
                className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-all text-center flex items-center justify-center space-x-1"
                title="Evaluate different concept"
              >
                <span>🆕 Pitch Another Concept</span>
              </button>
            </div>
          </div>

          {/* Brutal Mentor Roast Section */}
          <div className="bg-slate-950 text-slate-100 rounded-xl p-3.5 shadow-md border-l-4 border-[#FF6600] flex flex-col" id="live-roast-block">
            <div className="flex items-center space-x-2 mb-1.5 justify-between">
              <div className="flex items-center space-x-1.5">
                <Flame size={13} className="text-[#FF6600] animate-bounce" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FF6600]">
                  THE {activeAnalysis.brutalModeEnabled ? "SAVAGE ROAST" : "REALITY CHECK"}
                </h3>
              </div>
              <span className="text-[8px] uppercase px-1 py-0.5 bg-red-950 text-red-400 font-extrabold rounded">
                {activeAnalysis.personalityType}
              </span>
            </div>
            
            <p className="text-xs italic leading-relaxed font-medium text-slate-300">
              "{activeAnalysis.roast.brutalRoast}"
            </p>
          </div>

          {/* Real-time Streaming Savage Chat Box */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden" id="streaming-chat-block">
            <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center space-x-1.5">
                <MessageSquare size={13} className="text-slate-400" />
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Debate {selectedMentor}
                </span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2 text-xs" id="chat-messages-scroll">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[90%] ${
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[8px] text-slate-400 mb-0.5 uppercase tracking-wider">
                    {msg.role === 'user' ? "You" : selectedMentor}
                  </span>
                  <div
                    className={`p-2.5 rounded-lg leading-relaxed ${
                      msg.role === 'user'
                        ? "bg-[#FF6600] text-white rounded-tr-none"
                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isStreaming && streamedText && (
                <div className="flex flex-col max-w-[90%] mr-auto items-start">
                  <span className="text-[8px] text-slate-400 mb-0.5 uppercase tracking-wider">
                    {selectedMentor} (Streaming)
                  </span>
                  <div className="p-2.5 bg-orange-50/70 text-slate-800 rounded-lg rounded-tl-none border border-orange-200/50 leading-relaxed font-mono text-[11px]">
                    {streamedText}
                    <span className="w-1.5 h-3.5 bg-yc-orange inline-block align-middle ml-1 animate-ping"></span>
                  </div>
                </div>
              )}

              {isStreaming && !streamedText && (
                <div className="flex items-center space-x-2 text-slate-400 italic text-[11px]">
                  <Loader2 size={12} className="animate-spin text-[#FF6600]" />
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat form */}
            <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-100 bg-slate-50 flex gap-1.5" id="savage-discussion-form">
              <input
                id="chat-message-input"
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Ask ${selectedMentor}...`}
                disabled={isStreaming}
                className="flex-1 px-2.5 py-1.5 rounded bg-white text-xs border border-slate-200 focus:outline-none focus:border-[#FF6600] text-slate-800"
              />
              <button
                id="send-chat-btn"
                type="submit"
                disabled={isStreaming || !chatMessage.trim()}
                className="p-1.5 bg-slate-900 text-white rounded hover:bg-black transition-all flex items-center justify-center"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </aside>

        {/* Central Dashboard Canvas */}
        <section className="flex-1 flex flex-col gap-3 overflow-y-auto" id="dashboard-center-panel">
          
          {/* Top Metric Cards Row */}
          <div className="grid grid-cols-4 gap-3 h-[85px] shrink-0" id="metric-top-row">
            {statsRow.map((stat, idx) => (
              <div
                key={idx}
                id={`stat-box-${idx}`}
                className={`bg-white rounded-xl border border-slate-200 p-2.5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden`}
              >
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-tight">{stat.label}</span>
                <span className={`text-2xl font-black font-display tracking-tight ${stat.color} mt-0.5`}>
                  {stat.value}
                </span>
                {stat.secondary && (
                  <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">{stat.secondary}</span>
                )}
                {stat.border && (
                  <div className={`absolute bottom-0 left-0 h-[3px] bg-[#FF6600] w-full rounded-b-xl`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Tab Pages Switchboard */}
          <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-y-auto" id="dynamic-content-frame">
            
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-4" id="dashboard-tab-content">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 border-b pb-1.5 uppercase tracking-wider font-display mb-3">
                    Overview Assessment
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Score Highlights */}
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50/30 rounded-lg border border-orange-100 flex items-start space-x-3">
                        <Award className="text-[#FF6600] shrink-0 mt-0.5" size={16} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight font-display">Executive Summary</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            An expert consensus has analyzed your vision. With an overall score of <strong className="text-slate-800">{activeAnalysis.scores.overallScore}/100</strong>, your startup highlights a Category of <strong className="text-slate-800">{activeAnalysis.market.category}</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50/20 rounded-lg border border-blue-100/60 flex items-start space-x-3">
                        <TrendingUp className="text-blue-500 shrink-0 mt-0.5" size={16} />
                        <div>
                          <h4 className="text-xs font-bold text-blue-800 uppercase tracking-tight font-display">The VC Appetite Perspective</h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            VC probability stands around <strong className="text-slate-705">{activeAnalysis.investor.vcInterestProbability}%</strong>, presenting a fundraising outlook annotated as <span className="uppercase font-bold text-xs font-mono">{activeAnalysis.investor.fundraisingDifficulty}</span>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Flaws Bullet list */}
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight font-display mb-2 flex items-center space-x-1.5">
                        <ShieldAlert size={14} className="text-red-500" />
                        <span>Core Strategic Flaws identified:</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {activeAnalysis.roast.fundamentalFlaws.map((flaw, idx) => (
                          <li key={idx} className="text-xs text-slate-500 flex items-start space-x-1.5">
                            <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-tight">{flaw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 6-Month MVP Roadmaps */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider font-display border-b pb-1.5">
                    MVP Execution Roadmap
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeAnalysis.execution.roadmap.map((phase, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-100 rounded-lg shadow-xs relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {phase.timeline}
                          </span>
                          <span className="text-[10px] font-bold text-[#FF6600] uppercase font-display">
                            Phase {idx + 1}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight mb-2 uppercase">
                          {phase.phase}
                        </h4>
                        <ul className="space-y-1">
                          {phase.objectives.map((obj, oIdx) => (
                            <li key={oIdx} className="text-[11px] text-slate-400 flex items-start space-x-1">
                              <span className="text-[#FF6600] font-bold">•</span>
                              <span className="leading-tight">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* MVP feature pill set */}
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Core Scope of MVP Release
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAnalysis.execution.mvpFeatures.map((feat, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded text-xs font-medium font-display shadow-xs">
                          🛠️ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated investor advice footer panel */}
                <div className="p-3 bg-orange-600 text-white rounded-lg flex flex-col md:flex-row items-center justify-between shadow-sm">
                  <div className="mb-2 md:mb-0">
                    <h4 className="text-xs font-bold uppercase tracking-wide">Ready to test other mentors?</h4>
                    <p className="text-[11px] text-white/80">Switch mentors in the top selection dropdown or profile helper to get highly divergent roasts!</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("analyzer")}
                    className="px-3.5 py-1.5 bg-white text-orange-600 hover:bg-orange-50 font-bold text-[11px] rounded uppercase font-display select-none transition-colors shadow-xs shrink-0"
                  >
                    Compare Scores
                  </button>
                </div>
              </div>
            )}

            {/* TAB: DETAIL RATINGS ANALYZER */}
            {activeTab === "analyzer" && (
              <div className="space-y-6" id="analyzer-tab-content">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 border-b pb-1.5 uppercase tracking-wider font-display mb-3">
                    Rating Metrics Breakdown
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Our AI incubation matrix extracts twelve core properties to model market velocity, scaling resistance, product complexity, and longevity.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Progress bars block */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight font-display mb-2">Viability & Sizing</h4>
                      
                      {/* Metric lines with custom scoring indicators */}
                      <ScoreLine score={activeAnalysis.scores.originality} label="Idea Originality" />
                      <ScoreLine score={activeAnalysis.scores.practicality} label="Technical Practicality" />
                      <ScoreLine score={activeAnalysis.scores.viability} label="Business Model Viability" />
                      <ScoreLine score={activeAnalysis.scores.marketTiming} label="Market Timing Catalyst" />
                      <ScoreLine score={activeAnalysis.scores.painLevel} label="Target Domain Pain Level" />
                    </div>

                    {/* Technical Complexity Matrix */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight font-display mb-2">Complexity & Risks</h4>

                      <ScoreLine score={activeAnalysis.scores.competitionSaturation} label="Competition Barrier" reverseColors />
                      <ScoreLine score={activeAnalysis.scores.scalability} label="Scalability Potential" />
                      <ScoreLine score={activeAnalysis.scores.profitabilityProbability} label="Profit Unit Economics" />
                      <ScoreLine score={activeAnalysis.scores.executionDifficulty} label="Execution / Capital Cap" reverseColors />
                      <ScoreLine score={activeAnalysis.scores.aiReplacementRisk} label="Commoditization / Low Moat Risk" reverseColors />
                    </div>
                  </div>
                </div>

                {/* Additional detailed explanation indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <span className="text-[9px] uppercase font-black text-slate-400">Bootstrap Rating</span>
                    <div className="text-xl font-bold font-display text-slate-800 mt-1">{activeAnalysis.investor.bootstrapFriendliness}/100</div>
                    <p className="text-slate-405 mt-1 leading-normal">How possible is it to reach cashflow positive without high outside investment.</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <span className="text-[9px] uppercase font-black text-slate-400">SaaS Feasibility</span>
                    <div className="text-xl font-bold font-display text-emerald-600 mt-1">High Optioned</div>
                    <p className="text-slate-405 mt-1 leading-normal">High probability of supporting recurring model metrics with minimum manual support.</p>
                  </div>
                  <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <span className="text-[9px] uppercase font-black text-slate-400">Viral Coefficient</span>
                    <div className="text-xl font-bold font-display text-purple-600 mt-1">{(activeAnalysis.scores.viralPotential / 10).toFixed(1)} / 10</div>
                    <p className="text-slate-405 mt-1 leading-normal">Organic user acquisition loops and sharing dynamics that run automatically.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MARKET & PRICING */}
            {activeTab === "market" && (
              <div className="space-y-6" id="market-tab-content">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 border-b pb-1.5 uppercase tracking-wider font-display mb-3">
                    Market Sizing & Audience Potential
                  </h2>

                  {/* Tam card and audience description */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-orange-50/20 border border-orange-100 rounded-xl relative overflow-hidden">
                      <span className="text-[9px] font-bold uppercase text-slate-400">Total Addressable Market (TAM)</span>
                      <div className="text-3xl font-black font-mono text-slate-800 mt-1.5">{activeAnalysis.market.estimatedTam}</div>
                      <p className="text-xs text-slate-405 mt-2">Calculated regional/globe market category sizing estimates.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[9px] font-bold uppercase text-slate-400">Trending Status</span>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="text-xl font-bold text-slate-800 capitalize font-display">{activeAnalysis.market.trendingStatus}</span>
                        {getTimingBadge(activeAnalysis.market.trendingStatus)}
                      </div>
                      <p className="text-xs text-slate-405 mt-2">Current industry traction trajectory.</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[9px] font-bold uppercase text-slate-400">Customer Acquisition</span>
                      <div className="text-xl font-black font-display text-rose-500 uppercase mt-1.5">{activeAnalysis.market.customerAcquisitionDifficulty}</div>
                      <p className="text-xs text-slate-405 mt-2">Difficulty multiplier for finding and converting leads.</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight font-display mb-1.5">Specified Target Demographics</h3>
                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                      🎯 {activeAnalysis.market.targetAudience}
                    </div>
                  </div>
                </div>

                {/* Suggested Monetization Plans */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-3.5 uppercase tracking-wider font-display border-b pb-1.5">
                    Suggested Monetization Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeAnalysis.monetization.map((model, idx) => (
                      <div key={idx} className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                              Tier {idx + 1}: {model.strategy}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-0.5">
                            {model.tierName}
                          </h4>
                          <span className="text-lg font-extrabold text-indigo-650 font-mono inline-block mb-3 bg-indigo-50/70 border border-indigo-100/50 px-2 py-0.5 rounded leading-none">
                            {model.suggestedPricing}
                          </span>

                          <div className="space-y-1.5 text-xs text-slate-455">
                            <p><strong>Pros:</strong> {model.pros}</p>
                            <p><strong>Cons:</strong> {model.cons}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engineering custom suggest */}
                <div className="p-3 bg-slate-100 rounded-lg flex items-center space-x-2 text-xs">
                  <Cpu size={14} className="text-slate-500" />
                  <div>
                    <strong className="text-slate-800">Incubator note:</strong> Unit economics should seek minimum lifetime value (LTV) to customer acquisition cost (CAC) ratio of 3:1 to sustain growth.
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COMPETITORS LANDSCAPE */}
            {activeTab === "competitors" && (
              <div className="space-y-6" id="competitors-tab-content">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 border-b pb-1.5 uppercase tracking-wider font-display mb-3">
                    Competitive Intelligence Scanner
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Our scanner parses regional giants, direct incumbents, and adjacent historical plays. Track their advantages to plan your unique wedge.
                  </p>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[9px] tracking-wider">
                          <th className="p-3">Incumbent / Rival</th>
                          <th className="p-3">Core Strength</th>
                          <th className="p-3">Identified Weakness / Gap</th>
                          <th className="p-3">Pricing Strategy</th>
                          <th className="p-3 text-right">Risk to You</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {activeAnalysis.competitors.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-bold text-slate-900">{comp.name}</td>
                            <td className="p-3 text-slate-500">{comp.strength}</td>
                            <td className="p-3 text-slate-500 leading-normal">{comp.weakness}</td>
                            <td className="p-3"><span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{comp.pricingModel}</span></td>
                            <td className="p-3 text-right font-semibold text-rose-500 italic">{comp.survivalRiskFactor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Technology configuration suggested */}
                  <div className="p-4 bg-slate-50 border border-slate-250 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight mb-2.5 font-display flex items-center space-x-1.5">
                      <Cpu size={14} className="text-[#FF6600]" />
                      <span>Recommended Technology Core System</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-white p-2 border border-slate-200 rounded">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-sans">Frontend UI</span>
                        <span className="font-bold text-slate-800">{activeAnalysis.execution.suggestedTechStack.frontend}</span>
                      </div>
                      <div className="bg-white p-2 border border-[#FF6600]/20 rounded">
                        <span className="text-[8px] uppercase tracking-wider text-slate-450 block font-sans">Backend Core</span>
                        <span className="font-bold text-slate-800">{activeAnalysis.execution.suggestedTechStack.backend}</span>
                      </div>
                      <div className="bg-white p-2 border border-slate-200 rounded">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-sans">Database / Ledger</span>
                        <span className="font-bold text-slate-800">{activeAnalysis.execution.suggestedTechStack.database}</span>
                      </div>
                      <div className="bg-white p-2 border border-slate-200 rounded">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-sans">Hosting platform</span>
                        <span className="font-bold text-slate-800">{activeAnalysis.execution.suggestedTechStack.hosting}</span>
                      </div>
                    </div>
                  </div>

                  {/* Crucial hires list */}
                  <div className="p-4 bg-slate-50 border border-slate-250 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight mb-1.5 font-display flex items-center space-x-1.5">
                        <Users size={14} className="text-blue-500" />
                        <span>Crucial MVP Hiring Prioritization</span>
                      </h4>
                      <p className="text-[11px] text-slate-450 mb-2 leading-relaxed">
                        To survive initial scaling, prioritize hiring roles that immediately cover code velocity and distribution gaps.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeAnalysis.execution.keyHires.map((hire, idx) => (
                        <span key={idx} className="bg-white font-semibold text-slate-700 px-3 py-1 text-xs rounded border border-slate-200">
                          👤 {hire}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SOCIAL VIRAL SHARE CARD */}
            {activeTab === "sharing" && (
              <div className="space-y-6" id="sharing-tab-content">
                <div className="max-w-md mx-auto">
                  <h2 className="text-xs font-bold text-slate-900 border-b pb-1.5 uppercase tracking-wider font-display mb-3 text-center">
                    Simulate Social Sharing Card
                  </h2>
                  <p className="text-xs text-slate-400 text-center leading-relaxed mb-6">
                    Brag to the Silicon Valley community, or let investors see your direct scoring metrics with beautiful generated layouts.
                  </p>

                  {/* The actual simulated card */}
                  <div className="relative bg-slate-900 text-white rounded-2xl p-6 shadow-xl border-t-8 border-[#FF6600] overflow-hidden" id="social-mockup-card">
                    {/* Background decorations */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF6600]/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl"></div>

                    {/* Logo */}
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono bg-yc-orange text-white font-extrabold px-2 py-0.5 text-xs rounded">YC</span>
                        <span className="font-display font-black text-xs uppercase tracking-widest text-[#FF6600]">StartupRate AI</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{activeAnalysis.market.category}</span>
                    </div>

                    {/* Content text */}
                    <div className="relative z-10 space-y-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block mb-0.5">THE PITCH</span>
                        <h3 className="text-base font-bold italic line-clamp-3 text-slate-100">
                          "{activeAnalysis.idea}"
                        </h3>
                      </div>

                      {/* Main score metrics panel inside image */}
                      <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-slate-350 block">Incubator Score</span>
                          <span className="text-3xl font-black text-white font-display inline-block mt-0.5">
                            {activeAnalysis.scores.overallScore}
                            <span className="text-xs text-slate-400 font-normal"> / 100</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-slate-350 block">AI Advisor Verdict</span>
                          <span className="text-sm font-bold uppercase block mt-1.5 text-[#FF6600]">
                            {activeAnalysis.scores.overallScore > 65 ? "🌟 Legit Moat" : "🔥 Saturated Wrapper"}
                          </span>
                        </div>
                      </div>

                      {/* The savage comment snippet mockup */}
                      <div className="p-3 bg-white/5 rounded-lg border-l-2 border-[#FF6600] text-xs italic text-slate-300">
                        "{activeAnalysis.roast.brutalRoast.substring(0, 150)}..."
                      </div>
                    </div>

                    {/* Footer credentials of card */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400 relative z-10">
                      <div>
                        <span>Pitching Founder: </span>
                        <strong className="text-white capitalize">{userProfile.name}</strong>
                      </div>
                      <span>rate-my-startup.ai</span>
                    </div>
                  </div>

                  {/* Generate Button System */}
                  <div className="flex gap-2.5 mt-6 justify-center">
                    <button
                      id="download-share-card-btn"
                      onClick={handleDownloadCard}
                      disabled={isDownloading}
                      className="px-5 py-2.5 bg-[#FF6600] text-white hover:bg-orange-650 transition-all font-display font-bold text-xs uppercase tracking-wider rounded-lg shadow flex items-center space-x-1.5 cursor-pointer disabled:bg-slate-300"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Generating asset...</span>
                        </>
                      ) : (
                        <>
                          <Download size={13} />
                          <span>Download High-Res Card</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      id="copy-link-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(`Check out my startup idea score: ${activeAnalysis.scores.overallScore}/100 of rating evaluated by ${selectedMentor}!`);
                        setIsCardCopied(true);
                        setTimeout(() => setIsCardCopied(false), 2000);
                      }}
                      className="px-4 py-2.5 border border-slate-200 text-slate-650 hover:bg-slate-50 transition-all text-xs font-bold rounded-lg uppercase font-display select-none"
                    >
                      {isCardCopied ? "Link Copied!" : "Copy Share Link"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Right Most Sidebar Panel: Saved Ideas Register & Dynamic Mentors / Config */}
        <aside className="w-[235px] flex flex-col gap-3 shrink-0" id="portal-history-sidebar">
          
          {/* Active Personality Configuration settings */}
          <div className="bg-white rounded-xl border border-slate-205 p-3.5 shadow-sm" id="personality-config-block">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">ADVISOR CONSOLE</h3>
            <form onSubmit={handleSaveProfile} className="space-y-2 text-xs" id="profile-editor-form">
              <div>
                <label htmlFor="edit-profile-name" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Founder Name</label>
                <input
                  id="edit-profile-name"
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-800"
                  placeholder="Your Name..."
                />
              </div>

              <div>
                <label htmlFor="edit-profile-mentor" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Preferred Mentor</label>
                <select
                  id="edit-profile-mentor"
                  value={tempMentor}
                  onChange={(e) => setTempMentor(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-800"
                >
                  <option value="Cynical VC">💼 Cynical VC</option>
                  <option value="Silicon Valley Guru">🦄 Silicon Valley Guru</option>
                  <option value="Pragmatic Hacker">🛠️ Pragmatic Hacker</option>
                </select>
              </div>

              <button
                id="save-profile-btn"
                type="submit"
                className="w-full py-1.5 bg-slate-800 text-white hover:bg-black rounded text-[10px] font-bold uppercase transition-all"
              >
                Commit Changes
              </button>

              {profileSuccessMsg && (
                <div className="text-[9px] text-[#FF6600] font-bold text-center mt-1 uppercase" id="profile-success-label">
                  {profileSuccessMsg}
                </div>
              )}
            </form>
          </div>

          {/* Saved History ideas list */}
          <div className="flex-1 bg-white rounded-xl border border-slate-205 p-3.5 shadow-sm flex flex-col overflow-hidden" id="saved-ideas-block">
            <div className="flex justify-between items-center mb-2 shrink-0">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SAVED IDEAS ({savedIdeas.length})</h3>
              <Clock size={11} className="text-slate-400" />
            </div>

            {/* Search & Sort Input Fields */}
            {savedIdeas.length > 0 && (
              <div className="space-y-1.5 mb-2.5 px-0.5 shrink-0" id="saved-ideas-filters-container">
                <div className="relative" id="saved-ideas-search-wrapper">
                  <input
                    id="saved-ideas-search-input"
                    type="text"
                    placeholder="Filter category or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-7 py-1 text-[11px] rounded-lg border border-slate-200 focus:outline-none focus:border-[#FF6600] text-slate-800 bg-slate-50/50"
                    title="Filter evaluated concepts in real-time"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search size={11} className="text-slate-400" />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-[10px] text-slate-400 hover:text-slate-650 cursor-pointer select-none focus:outline-none font-bold"
                      type="button"
                      title="Clear filter query"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1.5" id="saved-ideas-sort-wrapper">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
                  <select
                    id="saved-ideas-sort-select"
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 text-[10px] font-semibold text-slate-700 outline-none focus:border-[#FF6600] cursor-pointer"
                    title="Sort saved evaluations in various orders"
                  >
                    <option value="date_desc">📅 Date: Newest first</option>
                    <option value="date_asc">📅 Date: Oldest first</option>
                    <option value="score_desc">🔥 Score: High to Low</option>
                    <option value="score_asc">❄️ Score: Low to High</option>
                  </select>
                </div>
              </div>
            )}

            {/* List scroll */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 text-xs" id="saved-ideas-list-scroll">
              {savedIdeas.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No saved evaluations yet.</p>
              ) : (
                (() => {
                  const filtered = savedIdeas.filter((saved) => {
                    const query = searchQuery.toLowerCase().trim();
                    if (!query) return true;
                    const matchesTitle = saved.idea?.toLowerCase().includes(query) || saved.analysis?.idea?.toLowerCase().includes(query);
                    const matchesCategory = saved.category?.toLowerCase().includes(query) || saved.analysis?.market?.category?.toLowerCase().includes(query);
                    return matchesTitle || matchesCategory;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center text-slate-400 text-xs py-8" id="no-matching-ideas-panel">
                        <p className="font-semibold">No matches found.</p>
                        <p className="text-[10px] opacity-75 mt-0.5">Try a different query</p>
                      </div>
                    );
                  }

                  // Apply Sorting Logic
                  const sorted = [...filtered].sort((a, b) => {
                    if (sortBy === "score_desc") {
                      return b.overallScore - a.overallScore;
                    }
                    if (sortBy === "score_asc") {
                      return a.overallScore - b.overallScore;
                    }
                    if (sortBy === "date_desc") {
                      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
                      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
                      const valA = isNaN(dateA) ? 0 : dateA;
                      const valB = isNaN(dateB) ? 0 : dateB;
                      if (valA === valB) {
                        return (b.id || "").localeCompare(a.id || "");
                      }
                      return valB - valA;
                    }
                    if (sortBy === "date_asc") {
                      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
                      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
                      const valA = isNaN(dateA) ? 0 : dateA;
                      const valB = isNaN(dateB) ? 0 : dateB;
                      if (valA === valB) {
                        return (a.id || "").localeCompare(b.id || "");
                      }
                      return valA - valB;
                    }
                    return 0;
                  });

                  return sorted.map((saved) => (
                    <div
                      key={saved.id}
                      id={`saved-item-${saved.id}`}
                      onClick={() => onSelectSavedIdea(saved.analysis)}
                      className={`p-2 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                        activeAnalysis.id === saved.id
                          ? "bg-orange-50/45 border-[#FF6600]/40"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold truncate text-slate-800 flex-1 font-display leading-tight">
                          {saved.analysis.idea}
                        </span>
                        <span className="font-black text-slate-900 bg-white border border-slate-100 shadow-xs px-1 py-0.5 rounded text-[10px] shrink-0 font-mono">
                          {saved.overallScore}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-100 text-[9px] text-slate-400">
                        <span className="capitalize">{saved.category || "General"}</span>
                        <button
                          id={`delete-saved-${saved.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSavedIdea(saved.id);
                          }}
                          className="text-slate-350 hover:text-red-500 focus:outline-none"
                          title="Delete evaluation history"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </aside>

      </main>

      {/* Footer matching High Density */}
      <footer className="px-6 py-2 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 text-[10px] text-slate-400" id="portal-footer">
        <div>&copy; 2026 StartupRate AI • Strictly Sandboxed Workspace</div>
        <div className="flex space-x-4 font-bold">
          <a href="#" className="hover:text-[#FF6600]">API METRICS</a>
          <a href="#" className="hover:text-[#FF6600]">INCUBATOR PRINCIPLES</a>
          <a href="#" className="hover:text-[#FF6600]">SUPPORT PANEL</a>
        </div>
      </footer>
    </div>
  );
}

/* Custom score indicator line */
interface ScoreLineProps {
  score: number;
  label: string;
  reverseColors?: boolean;
}

function ScoreLine({ score, label, reverseColors = false }: ScoreLineProps) {
  const getProgressColor = (val: number) => {
    if (reverseColors) {
      if (val < 45) return "bg-emerald-500";
      if (val < 70) return "bg-amber-400";
      return "bg-rose-500";
    }
    if (val < 45) return "bg-rose-500";
    if (val < 70) return "bg-amber-400";
    return "bg-emerald-500";
  };

  return (
    <div id={`score-line-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex justify-between text-[11px] font-bold mb-1">
        <span className="text-slate-650">{label}</span>
        <span className="font-mono text-slate-800">{score}%</span>
      </div>
      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor(score)} rounded-full`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
