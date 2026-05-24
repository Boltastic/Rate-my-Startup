import React, { useState } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { Code, Briefcase, GraduationCap, Compass, HelpCircle, Shield, User, Landmark, UserCheck } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile, preferredMentor: string) => void;
}

const ROLES = [
  { id: "developer", label: "Software Engineer", icon: Code, desc: "Can build MVPs over weekends" },
  { id: "marketer", label: "Marketer / Growth", icon: Compass, desc: "Focuses on user acquisition and metrics" },
  { id: "student", label: "Student Entrepreneur", icon: GraduationCap, desc: "High energy, low budget, learning fast" },
  { id: "operator", label: "Business Professional", icon: Briefcase, desc: "Ex-consulting or corporate operations expert" },
  { id: "hacker", label: "Solo Hacker", icon: Shield, desc: "Building micro-SaaS and seeking fast ramen-profitability" },
];

const MENTORS = [
  {
    id: "Cynical VC",
    name: "Cynical VC",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    quote: "I've seen 10,000 SaaS pitches. Show me why your startup isn't just a fancy wrapper over a database.",
    badging: "Partner at NoCap Ventures",
    accentColor: "border-amber-500 text-amber-600 bg-amber-50",
  },
  {
    id: "Silicon Valley Guru",
    name: "Silicon Valley Guru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    quote: "Let's synergize our high-agency AI agents to disrupt standard sovereign paradigms! Ready to hyper-scale?",
    badging: "Tech Evangelist & Angel",
    accentColor: "border-purple-500 text-purple-600 bg-purple-50",
  },
  {
    id: "Pragmatic Hacker",
    name: "Pragmatic Hacker",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    quote: "Who cares about your pitch deck? Tell me how you'll make $1,000 without fundraising or running ads.",
    badging: "12x Indie SaaS Founder",
    accentColor: "border-emerald-500 text-emerald-600 bg-emerald-50",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("developer");
  const [background, setBackground] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("Cynical VC");

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name || "Founder",
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      role: selectedRole,
      background: background || "Standard builder passionate about new products.",
      joinedAt: new Date().toLocaleDateString(),
      hasOnboarded: true,
    };
    onComplete(profile, selectedMentor);
  };

  return (
    <div id="onboarding-root" className="min-h-screen py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-50 via-slate-100 to-orange-50/30">
      <div className="w-full max-w-xl">
        {/* Step dots */}
        <div className="flex justify-center space-x-2 mb-8" id="onboarding-steps">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === num ? "w-8 bg-yc-orange" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Card Frame */}
        <div className="glassmorphism p-8 rounded-2xl shadow-xl border border-slate-200/60 premium-glow" id="onboarding-card">
          
          {/* Step 1: Account setup Name / Role */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              id="onboarding-step-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg text-yc-orange">
                  <Landmark size={24} />
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 tracking-tight">Create Founder Account</h1>
                  <p className="text-sm text-slate-500">Step 1 of 3: Who are we assessing?</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="founder-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    What is your Name?
                  </label>
                  <input
                    type="text"
                    id="founder-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexis Ohanian"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white/80 focus:border-yc-orange focus:ring-1 focus:ring-yc-orange focus:outline-none transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What best describes your business role?
                  </label>
                  <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {ROLES.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <button
                          key={role.id}
                          id={`role-${role.id}`}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`flex items-start text-left p-3 rounded-lg border transition-all ${
                            selectedRole === role.id
                              ? "border-yc-orange bg-orange-50/40 text-slate-800 font-medium"
                              : "border-slate-200 bg-white/55 hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          <div className={`p-2 rounded-md mr-3 ${selectedRole === role.id ? "bg-orange-100 text-yc-orange" : "bg-slate-100 text-slate-500"}`}>
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{role.label}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{role.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="onboarding-next-1"
                    onClick={handleNext}
                    disabled={!name.trim()}
                    className={`px-5 py-2.5 font-display font-medium rounded-lg shadow-sm transition-all text-sm flex items-center space-x-1.5 ${
                      name.trim()
                        ? "bg-yc-orange text-white hover:bg-orange-600 cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span>Define Background</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Background Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              id="onboarding-step-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg text-yc-orange">
                  <User size={24} />
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 tracking-tight">Your Core Background</h1>
                  <p className="text-sm text-slate-500">Step 2 of 3: Provide your unfair advantage</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="background-text" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    What is your background or domain expertise?
                  </label>
                  <p className="text-xs text-slate-400 mb-2">
                    Understanding your skills allows our AI mentors to assess how suited you are to execute the startup idea yourself.
                  </p>
                  <textarea
                    id="background-text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    rows={4}
                    placeholder="e.g. 3 years in mechanical engineering, built 2 simple web scrapers, did B2B marketing internship."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white/80 focus:border-yc-orange focus:ring-1 focus:ring-yc-orange focus:outline-none transition-all text-slate-800 text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    id="onboarding-back-2"
                    onClick={handleBack}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    id="onboarding-next-2"
                    onClick={handleNext}
                    className="px-5 py-2.5 font-display font-medium rounded-lg bg-yc-orange text-white hover:bg-orange-600 shadow-sm text-sm"
                  >
                    Choose Your Advisor
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Mentor Selection */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              id="onboarding-step-3"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg text-yc-orange">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-slate-800 tracking-tight">Select AI Evaluator</h1>
                  <p className="text-sm text-slate-500">Step 3 of 3: Match with your preferred archetype</p>
                </div>
              </div>

              <div className="space-y-5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your evaluator determines the tone, angle, and core focus of your startup analyses. You can switch this at any time later in your profile.
                </p>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {MENTORS.map((m) => (
                    <button
                      key={m.id}
                      id={`mentor-${m.id.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => setSelectedMentor(m.id)}
                      className={`w-full flex items-start text-left p-4 rounded-xl border transition-all ${
                        selectedMentor === m.id
                          ? `border-yc-orange/80 bg-orange-50/15 ring-yc-orange/25 ring-1 shadow-sm`
                          : "border-slate-250 bg-white/55 hover:border-slate-350"
                      }`}
                    >
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 mr-3.5 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-bold text-slate-800 text-sm font-display">{m.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-400 text-right">{m.badging}</span>
                        </div>
                        <p className="text-xs italic text-slate-500 mt-1">"{m.quote}"</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    id="onboarding-back-3"
                    onClick={handleBack}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    id="onboard-complete-btn"
                    onClick={handleFinish}
                    className="px-6 py-2.5 font-display font-semibold rounded-lg bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 hover:scale-[1.01] hover:shadow-md transition-all text-sm flex items-center space-x-1"
                  >
                    <span>Launch Incubator</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6 max-w-sm mx-auto" id="onboarding-footer">
          Rate My Startup Idea builds fully compliant, sandbox-tested evaluations directly connected to elite developer APIs and persistent storage.
        </p>
      </div>
    </div>
  );
}
