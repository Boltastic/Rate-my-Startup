import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Onboarding from "./components/Onboarding";
import LandingPage from "./components/LandingPage";
import Workspace from "./components/Workspace";
import PrintableReport from "./components/PrintableReport";
import { StartupAnalysis, SavedIdea, UserProfile } from "./types";
import {
  Sparkles,
  Brain,
  Flame,
  TrendingUp,
  Cpu,
  Lock,
  Loader2,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";

const SYSTEM_LOGS = [
  "Opening secure pipeline to Silicon Valley Node...",
  "Consulting Y-Combinator senior partner panel...",
  "Running decentralized competitor scanner on global SaaS charts...",
  "Measuring Total Addressable Market coordinates...",
  "Assessing customer acquisition barrier index...",
  "Generating brutal roast paragraphs...",
  "Constructing 3-phase technical execution roadmaps...",
  "Drafting venture capitalist appraisal metrics...",
];

export default function App() {
  // Authentication & Profile state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>("Cynical VC");
  
  // Evaluation States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingLogIndex, setLoadingLogIndex] = useState(0);
  const [activeAnalysis, setActiveAnalysis] = useState<StartupAnalysis | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [generalError, setGeneralError] = useState("");

  // Load state from localStorage on init
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("incubation_registered_users");
      let usersList: any[] = [];
      if (storedUsers) {
        usersList = JSON.parse(storedUsers);
        setRegisteredUsers(usersList);
      } else {
        const defaultUser = {
          email: "founder@yourstartup.com",
          password: "password123",
          profile: {
            name: "Founder Alexis",
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alexis",
            role: "developer",
            background: "Passionate B2B SaaS developer built several MVPs.",
            joinedAt: new Date().toLocaleDateString(),
            hasOnboarded: true,
          },
          selectedMentor: "Cynical VC"
        };
        usersList = [defaultUser];
        setRegisteredUsers(usersList);
        localStorage.setItem("incubation_registered_users", JSON.stringify(usersList));
      }

      const storedAuth = localStorage.getItem("startup_auth_state");
      const currentUserEmail = localStorage.getItem("startup_current_user_email");
      if (storedAuth === "true" && currentUserEmail) {
        setIsAuthenticated(true);
        const matchingUser = usersList.find((u: any) => u.email.toLowerCase() === currentUserEmail.toLowerCase());
        if (matchingUser) {
          setUserProfile(matchingUser.profile);
          setSelectedMentor(matchingUser.selectedMentor || "Cynical VC");

          const userHistoryKey = `startup_ideas_history_${matchingUser.email}`;
          const userHistory = localStorage.getItem(userHistoryKey);
          if (userHistory) {
            setSavedIdeas(JSON.parse(userHistory));
          } else {
            setSavedIdeas([]);
          }
        }
      }
    } catch (e) {
      console.error("Local storage restoration error:", e);
    }
  }, []);

  // Set up loading simulation interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingLogIndex((prev) => (prev + 1) % SYSTEM_LOGS.length);
      }, 1500);
    } else {
      setLoadingLogIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Dynamic Authentication form handlers
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Email and Password are required.");
      return;
    }
    if (!authEmail.includes("@")) {
      setAuthError("Please input a valid developer email.");
      return;
    }

    const currentUsers = JSON.parse(localStorage.getItem("incubation_registered_users") || "[]");

    if (authMode === "signin") {
      // Find matching credentials
      const user = currentUsers.find(
        (u: any) => u.email.toLowerCase() === authEmail.trim().toLowerCase() && u.password === authPassword
      );

      if (user) {
        setAuthError("");
        localStorage.setItem("startup_auth_state", "true");
        localStorage.setItem("startup_current_user_email", user.email);

        setUserProfile(user.profile);
        setSelectedMentor(user.selectedMentor || "Cynical VC");

        // Load correct scoped storage
        const userHistoryKey = `startup_ideas_history_${user.email}`;
        const userHistory = localStorage.getItem(userHistoryKey);
        setSavedIdeas(userHistory ? JSON.parse(userHistory) : []);
        setActiveAnalysis(null);
        setIsAuthenticated(true);
      } else {
        setAuthError("Invalid email or wrong incubation password.");
      }
    } else {
      // Sign Up flow
      const taken = currentUsers.some(
        (u: any) => u.email.toLowerCase() === authEmail.trim().toLowerCase()
      );

      if (taken) {
        setAuthError("This email is already registered here.");
        return;
      }

      // Create new developer user
      const newUser = {
        email: authEmail.trim(),
        password: authPassword,
        profile: null,
        selectedMentor: "Cynical VC"
      };

      const updatedUsers = [...currentUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("incubation_registered_users", JSON.stringify(updatedUsers));

      localStorage.setItem("startup_auth_state", "true");
      localStorage.setItem("startup_current_user_email", newUser.email);

      // Force onboarding transition
      setUserProfile(null);
      setSavedIdeas([]);
      setActiveAnalysis(null);
      setAuthError("");
      setIsAuthenticated(true);
    }
  };

  const handleSimulatedPass = () => {
    const currentUsers = JSON.parse(localStorage.getItem("incubation_registered_users") || "[]");
    const mockEmail = "founder@yourstartup.com";
    
    // Find default or create it
    let user = currentUsers.find((u: any) => u.email.toLowerCase() === mockEmail.toLowerCase());
    if (!user) {
      user = {
        email: mockEmail,
        password: "password123",
        profile: {
          name: "Founder Alexis",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alexis",
          role: "developer",
          background: "Passionate B2B SaaS developer built several MVPs.",
          joinedAt: new Date().toLocaleDateString(),
          hasOnboarded: true,
        },
        selectedMentor: "Cynical VC"
      };
      const updated = [...currentUsers, user];
      setRegisteredUsers(updated);
      localStorage.setItem("incubation_registered_users", JSON.stringify(updated));
    }

    localStorage.setItem("startup_auth_state", "true");
    localStorage.setItem("startup_current_user_email", user.email);

    setUserProfile(user.profile);
    setSelectedMentor(user.selectedMentor || "Cynical VC");

    const userHistoryKey = `startup_ideas_history_${user.email}`;
    const userHistory = localStorage.getItem(userHistoryKey);
    setSavedIdeas(userHistory ? JSON.parse(userHistory) : []);
    setActiveAnalysis(null);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setSelectedMentor("Cynical VC");
    setSavedIdeas([]);
    setActiveAnalysis(null);
    setAuthEmail("");
    setAuthPassword("");
    setAuthError("");
    localStorage.setItem("startup_auth_state", "false");
    localStorage.removeItem("startup_current_user_email");
  };

  // Onboarding callback helper
  const handleOnboardingComplete = (profile: UserProfile, preferredMentor: string) => {
    setUserProfile(profile);
    setSelectedMentor(preferredMentor);

    const currentUserEmail = localStorage.getItem("startup_current_user_email");
    if (currentUserEmail) {
      const currentUsers = JSON.parse(localStorage.getItem("incubation_registered_users") || "[]");
      const updatedUsers = currentUsers.map((u: any) => {
        if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
          return { ...u, profile, selectedMentor: preferredMentor };
        }
        return u;
      });
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("incubation_registered_users", JSON.stringify(updatedUsers));
      
      localStorage.setItem("startup_user_profile", JSON.stringify(profile));
      localStorage.setItem("startup_selected_mentor", preferredMentor);
    }
  };

  // Primary API Call function orchestrator
  const handleAnalyzeIdea = async (idea: string, brutalMode: boolean) => {
    if (isLoading) return;
    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea,
          brutalMode,
          personalityType: selectedMentor,
          userProfile
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to contact analysis server");
      }

      const data: StartupAnalysis = await response.json();
      
      // Inject local settings to keep schema synchronized
      data.id = Math.random().toString(36).substring(7);
      data.idea = idea;
      data.submittedAt = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      data.brutalModeEnabled = brutalMode;
      data.personalityType = selectedMentor;

      setActiveAnalysis(data);

      // Persist to local scoped histories
      const newSavedItem: SavedIdea = {
        id: data.id,
        idea,
        overallScore: data.scores.overallScore,
        submittedAt: data.submittedAt,
        category: data.market.category,
        analysis: data
      };

      const updatedHistory = [newSavedItem, ...savedIdeas];
      setSavedIdeas(updatedHistory);
      
      const currentUserEmail = localStorage.getItem("startup_current_user_email");
      if (currentUserEmail) {
        localStorage.setItem(`startup_ideas_history_${currentUserEmail}`, JSON.stringify(updatedHistory));
      }
      localStorage.setItem("startup_ideas_history", JSON.stringify(updatedHistory));

    } catch (err: any) {
      console.error(err);
      setGeneralError(err.message || "Failed to assess concept. Please verify server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Change advisor helper
  const handleMentorChange = (mentor: string) => {
    setSelectedMentor(mentor);
    localStorage.setItem("startup_selected_mentor", mentor);

    const currentUserEmail = localStorage.getItem("startup_current_user_email");
    if (currentUserEmail) {
      const currentUsers = JSON.parse(localStorage.getItem("incubation_registered_users") || "[]");
      const updatedUsers = currentUsers.map((u: any) => {
        if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
          return { ...u, selectedMentor: mentor };
        }
        return u;
      });
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("incubation_registered_users", JSON.stringify(updatedUsers));
    }
  };

  // Profile configuration updates
  const handleUpdateProfile = (updatedProfile: UserProfile, mentorValue: string) => {
    setUserProfile(updatedProfile);
    setSelectedMentor(mentorValue);
    
    const currentUserEmail = localStorage.getItem("startup_current_user_email");
    if (currentUserEmail) {
      const currentUsers = JSON.parse(localStorage.getItem("incubation_registered_users") || "[]");
      const updatedUsers = currentUsers.map((u: any) => {
        if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
          return { ...u, profile: updatedProfile, selectedMentor: mentorValue };
        }
        return u;
      });
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("incubation_registered_users", JSON.stringify(updatedUsers));
    }
    
    localStorage.setItem("startup_user_profile", JSON.stringify(updatedProfile));
    localStorage.setItem("startup_selected_mentor", mentorValue);
  };

  // List click navigations
  const handleSelectSavedIdea = (analysis: StartupAnalysis) => {
    setActiveAnalysis(analysis);
  };

  const handleDeleteSavedIdea = (id: string) => {
    const updated = savedIdeas.filter(item => item.id !== id);
    setSavedIdeas(updated);
    
    const currentUserEmail = localStorage.getItem("startup_current_user_email");
    if (currentUserEmail) {
      localStorage.setItem(`startup_ideas_history_${currentUserEmail}`, JSON.stringify(updated));
    }
    localStorage.setItem("startup_ideas_history", JSON.stringify(updated));
    if (activeAnalysis?.id === id) {
      setActiveAnalysis(null);
    }
  };

  return (
    <div id="application-root" className="min-h-screen bg-[#F4F7F9]">
      <AnimatePresence mode="wait">

        {/* 1. Authentic simulated portal protection sign in */}
        {!isAuthenticated && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="auth-screen-frame"
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-orange-950/20 px-4"
          >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="text-center mb-5">
                <div className="inline-flex p-3 bg-orange-100 text-orange-600 rounded-xl mb-3">
                  <Lock size={28} />
                </div>
                <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">Incubator Portal</h2>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold block">Protected Developer Session Registry</span>
              </div>

              {/* Secure Auth Tab Toggles */}
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg mb-5 text-xs font-bold no-print">
                <button
                  id="tab-auth-signin"
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setAuthError("");
                  }}
                  className={`py-1.5 rounded transition-all text-center cursor-pointer ${
                    authMode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-auth-signup"
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                  className={`py-1.5 rounded transition-all text-center cursor-pointer ${
                    authMode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs" id="auth-sign-up-form">
                <div>
                  <label htmlFor="auth-email" className="block font-semibold text-slate-700 mb-1 text-[11px]">Developer Corporate Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. founder@yourstartup.com"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#FF6600] text-slate-800 text-xs"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="auth-pass" className="block font-semibold text-slate-700 mb-1 text-[11px]">Secure Passkey</label>
                  <input
                    id="auth-pass"
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#FF6600] text-slate-800 text-xs"
                    required
                  />
                </div>

                {authError && (
                  <div className="text-rose-500 font-bold text-center uppercase text-[10px] bg-rose-50 py-1 rounded border border-rose-100/50" id="auth-error-panel">
                    {authError}
                  </div>
                )}

                <button
                  id="portal-signin-submit"
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 font-display font-bold text-white hover:bg-black rounded-lg transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  {authMode === "signin" ? "Authorize & Sign In" : "Register Founder Account"}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-2 text-slate-400 text-[9px] uppercase font-bold tracking-wider">or bypass with placeholder</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <button
                  id="portal-bypass-btn"
                  type="button"
                  onClick={handleSimulatedPass}
                  className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/55 rounded-lg font-bold border border-emerald-250 text-[10px] uppercase transition-all cursor-pointer"
                >
                  Instant Access (Demo Alexis Account)
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* 2. Onboarding flow details setup */}
        {isAuthenticated && !userProfile?.hasOnboarded && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="onboarding-flow-frame"
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {/* 3. Loading committee analysis animation state */}
        {isAuthenticated && userProfile?.hasOnboarded && isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="loading-eval-screen"
            className="fixed inset-0 z-45 flex flex-col items-center justify-center bg-slate-900 text-white p-6"
          >
            <div className="w-full max-w-md text-center space-y-6">
              <div className="relative inline-block mx-auto">
                {/* Rotating accent rings */}
                <div className="w-20 h-20 rounded-full border-4 border-t-[#FF6600] border-slate-700 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-[#FF6600] animate-pulse" size={32} />
                </div>
              </div>

              <div>
                <h2 className="font-display font-black text-2xl tracking-tight text-white uppercase">Incubator Commitee Panel</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Analyzing coordinates using Gemini Artificial Intelligence</p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-white/10 text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6600]">Live Status Logs</span>
                </div>
                <p className="text-xs font-mono text-slate-200 leading-normal transition-all" id="incubation-status-text">
                  ⏳ {SYSTEM_LOGS[loadingLogIndex]}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                Evaluations parse Estimated Total Addressable market volume, competitors fail factors and suggested monetization structures.
              </p>
            </div>
          </motion.div>
        )}

        {/* 4. Landing input screen */}
        {isAuthenticated && userProfile?.hasOnboarded && !isLoading && !activeAnalysis && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            id="landing-input-screen"
            className="py-12"
          >
            {generalError && (
              <div className="max-w-4xl mx-auto px-4 mb-4">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 text-xs flex items-start space-x-2.5">
                  <span className="shrink-0 font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded uppercase font-mono">Server Call Failure</span>
                  <div className="flex-1">
                    <p className="font-semibold leading-none">{generalError}</p>
                    <p className="mt-1 opacity-80 leading-normal">Please make sure you have loaded an API key for Gemini in the Secrets panels of your Cloud console.</p>
                  </div>
                </div>
              </div>
            )}

            <LandingPage
              userProfile={userProfile!}
              selectedMentor={selectedMentor}
              onMentorChange={handleMentorChange}
              onAnalyze={handleAnalyzeIdea}
              isLoading={isLoading}
              onSignOut={handleSignOut}
            />

            {/* Quick dashboard shortcuts if saved ideas exist */}
            {savedIdeas.length > 0 && (
              <div className="max-w-4xl mx-auto px-4 mt-8 flex justify-center">
                <button
                  id="shortcut-dashboard-btn"
                  onClick={() => setActiveAnalysis(savedIdeas[0].analysis)}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 font-display uppercase tracking-wider"
                >
                  <span>Open active Incubator Workspace</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 5. Main Active Incubator Dashboard workspace */}
        {isAuthenticated && userProfile?.hasOnboarded && !isLoading && activeAnalysis && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="active-workspace-screen"
          >
            <Workspace
              userProfile={userProfile}
              selectedMentor={selectedMentor}
              activeAnalysis={activeAnalysis}
              savedIdeas={savedIdeas}
              onSelectSavedIdea={handleSelectSavedIdea}
              onDeleteSavedIdea={handleDeleteSavedIdea}
              onUpdateProfile={handleUpdateProfile}
              onAnalyzeNew={(idea, brutal) => handleAnalyzeIdea(idea, brutal)}
              onGoBackToInput={() => setActiveAnalysis(null)}
              isReanalyzing={isLoading}
              onSignOut={handleSignOut}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* SECURE PREMIUM PDF/PRINT DOSSIER EXPORT ENGINE */}
      {activeAnalysis && (
        <div id="printable-report-wrapper" className="hidden print:block bg-white text-slate-100 min-h-screen">
          <PrintableReport analysis={activeAnalysis} userProfile={userProfile} />
        </div>
      )}
    </div>
  );
}
