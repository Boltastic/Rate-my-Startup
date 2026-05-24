import React from "react";
import { StartupAnalysis, UserProfile } from "../types";

interface PrintableReportProps {
  analysis: StartupAnalysis;
  userProfile: UserProfile | null;
}

export default function PrintableReport({ analysis, userProfile }: PrintableReportProps) {
  const currentTimestamp = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Helpers for text colors of score rating blocks
  const getRatingBadge = (val: number) => {
    if (val >= 80) return "EXCEPTIONAL ADVANTAGE";
    if (val >= 60) return "VALIDATED VENTURE CAPABLE";
    if (val >= 40) return "BOOTSTRAP VIABLE";
    return "SENSITIVE / PIVOT SUGGESTED";
  };

  return (
    <div className="w-full text-slate-900 bg-white font-sans">
      
      {/* PAGE 1: TITLE & MAIN ADVISORY DOSSIER */}
      <div className="print-page border border-slate-200">
        {/* Document Header */}
        <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-[#FF6600] text-white px-2.5 py-1 text-sm font-black tracking-tighter rounded">YC</div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-slate-955 leading-none">STARTUP INCUBATOR ANALYTICS</h1>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">OFFICIAL EVALUATION & PORTAL DOSSIER</p>
            </div>
          </div>
          <div className="text-right text-[10px] font-mono text-slate-500 leading-normal">
            <div>LOG ID: SHA-{analysis.id?.toUpperCase() || "ACTIVE"}</div>
            <div>EXPORTER: SYSTEM PORTAL API</div>
          </div>
        </div>

        {/* Audit Meta Block */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">FOUNDING EXECUTIVE</span>
            <div className="font-bold text-slate-800 text-sm capitalize">{userProfile?.name || "Anonymous Founder"}</div>
            <div className="text-slate-500 font-mono text-[10px] mt-0.5">Role: {userProfile?.role || "Developer"}</div>
            <div className="text-slate-500 text-[10px] italic mt-1 bg-white p-1.5 border border-slate-100 rounded">
              "Expertise: {userProfile?.background || "General software creator"}"
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">DIAGNOSTIC CRITERIA</span>
            <div className="font-bold text-slate-800 text-sm">Advisor: {analysis.personalityType || "Cynical VC"}</div>
            <div className="text-slate-500 font-mono text-[11px] mt-0.5">Roast Mode: {analysis.brutalModeEnabled ? "ACTIVE SAVAGE" : "STANDBY SYSTEM"}</div>
            <div className="text-[10.5px] text-slate-500 font-mono mt-1">Generated: {analysis.submittedAt || currentTimestamp}</div>
          </div>
        </div>

        {/* The Pitch description frame */}
        <div className="border border-slate-200 p-4 rounded-lg mb-6">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">THE PROPOSED CONCEPT TEXT</span>
          <p className="text-xs text-slate-800 italic leading-relaxed font-semibold">
            "{analysis.idea}"
          </p>
        </div>

        {/* High Rating Scoring Banner */}
        <div className="grid grid-cols-3 gap-3 border border-slate-300 rounded-xl p-4 bg-[#FF6600]/5 text-center mb-6">
          <div className="col-span-1 border-r border-slate-200 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">CONSENSUS SCORE</span>
            <div className="text-4xl font-black text-slate-900 font-display mt-1">
              {analysis.scores.overallScore}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center p-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ADVISER VERDICT STATUS</span>
            <div className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded uppercase tracking-wide">
              {getRatingBadge(analysis.scores.overallScore)}
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1.5 leading-tight italic font-mono">
              *Consolidated scoring measures scaling threshold limitations.
            </p>
          </div>
        </div>

        {/* Executive Roast Commentary */}
        <div className="bg-slate-950 text-white p-4.5 rounded-lg border-l-4 border-[#FF6600] mb-6">
          <span className="text-[9px] font-black uppercase text-[#FF6600] tracking-widest block mb-1">EXECUTIVE EVALUATION ROAST SUMMARY</span>
          <p className="text-xs italic leading-relaxed text-slate-300 font-medium">
            "{analysis.roast.brutalRoast}"
          </p>
        </div>

        {/* Strategic Flaws Column Panel */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight mb-2.5 flex items-center">
            ⚠️ CORE STRUCTURAL CRITICISMS & FLAWS FOR DETAILED AUDIT:
          </h3>
          <ul className="space-y-2 text-xs">
            {analysis.roast.fundamentalFlaws.map((flaw, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-4 h-4 bg-red-100 text-red-700 text-[10px] font-mono font-bold flex items-center justify-center rounded-full shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-650 leading-relaxed">{flaw}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PAGE 2: QUANTITATIVE INDEX & DEMOGRAPHICS */}
      <div className="print-page border border-slate-200 page-break">
        <div className="border-b-2 border-slate-900 pb-2 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">SECTION II: QUANTITATIVE INCUBATION METRICS</h2>
          <p className="text-[9px] text-slate-550 italic font-mono">StartupRate quantitative mapping breakdown across core indices</p>
        </div>

        {/* Double-column metric score breakdown table format */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Column A */}
          <div className="space-y-3.5 bg-slate-50 p-4 border rounded border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider border-b pb-1 mb-2">A. SCALING & VIABILITY</h4>
            
            <StaticScore score={analysis.scores.originality} label="Originality Index" />
            <StaticScore score={analysis.scores.viability} label="Business Viability" />
            <StaticScore score={analysis.scores.scalability} label="Scalability potential" />
            <StaticScore score={analysis.scores.profitabilityProbability} label="Profit Unit Economics" />
            <StaticScore score={analysis.scores.painLevel} label="Target Domain Pain Level" />
          </div>

          {/* Column B */}
          <div className="space-y-3.5 bg-slate-50 p-4 border rounded border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider border-b pb-1 mb-2">B. RESISTANCE & TECHNOLOGY</h4>
            
            <StaticScore score={analysis.scores.marketTiming} label="Market Timing Catalyst" />
            <StaticScore score={analysis.scores.practicality} label="Technical Feasibility" />
            <StaticScore score={analysis.scores.executionDifficulty} label="Execution Difficulty" />
            <StaticScore score={analysis.scores.competitionSaturation} label="Competition Barrier" />
            <StaticScore score={analysis.scores.aiReplacementRisk} label="Commoditization / Low Moat Risk" />
          </div>
        </div>

        {/* Dynamic Demographics Assessment */}
        <div className="mb-6">
          <div className="border-b border-slate-200 pb-1.5 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">SECTION III: MARKET DATA & ENUMERATIONS</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
            <div className="bg-slate-50 p-2.5 border rounded border-slate-200">
              <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest block mb-0.5">Estimated TAM</span>
              <div className="font-bold font-mono text-slate-800 text-sm">{analysis.market.estimatedTam}</div>
            </div>
            <div className="bg-slate-50 p-2.5 border rounded border-slate-200">
              <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest block mb-0.5">Traction Catalyst</span>
              <div className="font-bold text-slate-850 text-xs capitalize">{analysis.market.trendingStatus} status</div>
            </div>
            <div className="bg-slate-50 p-2.5 border rounded border-slate-200">
              <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest block mb-0.5">Acquisition Index</span>
              <div className="font-bold text-rose-600 text-xs uppercase">{analysis.market.customerAcquisitionDifficulty} difficulty</div>
            </div>
          </div>

          <div className="border border-slate-205 p-3 rounded-lg bg-white mb-4 text-xs">
            <span className="text-[8px] font-bold text-slate-400 block uppercase mb-1">TARGET MARKET SEGMENTATION REPORT</span>
            <div className="text-slate-800 leading-normal font-medium">🎯 {analysis.market.targetAudience}</div>
          </div>
        </div>

        {/* High Key MVP hires matrix */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
          <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider mb-2.5 border-b pb-1.5">
            👤 CHIEF TALENT EXECUTION ADVISION (CRITICAL MV-PR HIRES):
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {analysis.execution.keyHires.map((hire, idx) => (
              <div key={idx} className="bg-white p-2 border border-slate-200 rounded text-center font-semibold text-slate-705">
                Role {idx + 1}: {hire}
              </div>
            ))}
          </div>
          <p className="text-[9.5px] text-slate-450 italic mt-2 text-center">
            *Recruit specifically for distribution capacity and high velocity coding speeds.
          </p>
        </div>
      </div>

      {/* PAGE 3: MVP DEVELOPMENT PLAN & FINANCIAL MATRIX */}
      <div className="print-page border border-slate-200 page-break">
        <div className="border-b-2 border-slate-900 pb-2 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">SECTION IV: TECHNICAL ARCHITECTURE & TIMELINE OBJECTIVES</h2>
          <p className="text-[9px] text-slate-550 italic font-mono">MVP structural scoping roadmap of building milestones</p>
        </div>

        {/* Recommended Technology Core Section */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg mb-6">
          <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-2.5 border-b pb-1">
            💻 CORE TECHNICAL SPECIFICATIONS MATRIX:
          </h3>
          <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2 bg-white rounded border border-slate-150">
              <span className="font-sans text-[8px] text-slate-400 uppercase tracking-widest block font-bold">FRONTEND SYSTEM</span>
              <div className="text-slate-850 font-bold mt-0.5">{analysis.execution.suggestedTechStack.frontend}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-150 font-bold">
              <span className="font-sans text-[8px] text-slate-400 uppercase tracking-widest block font-bold">BACKEND CORE</span>
              <div className="text-slate-850 mt-0.5">{analysis.execution.suggestedTechStack.backend}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-150">
              <span className="font-sans text-[8px] text-slate-400 uppercase tracking-widest block font-bold">DATABASE/LEDGER</span>
              <div className="text-slate-850 font-bold mt-0.5">{analysis.execution.suggestedTechStack.database}</div>
            </div>
            <div className="p-2 bg-white rounded border border-slate-150">
              <span className="font-sans text-[8px] text-slate-400 uppercase tracking-widest block font-bold">HOSTING INFRA</span>
              <div className="text-slate-850 font-bold mt-0.5">{analysis.execution.suggestedTechStack.hosting}</div>
            </div>
          </div>
        </div>

        {/* Double row MVP list & Phases roadmap */}
        <div className="space-y-4 mb-6 text-xs">
          <div className="border-b border-slate-200 pb-1 mb-2">
            <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">AWARDS OF MVP PRODUCT OBJECTIVES</h4>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {analysis.execution.roadmap.map((phase, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border rounded border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-200/50">
                    <span className="text-[8px] font-mono uppercase bg-slate-200 px-1 py-0.5 text-slate-500 rounded">{phase.timeline}</span>
                    <span className="text-[9px] font-bold text-[#FF6600]">PHASE {idx + 1}</span>
                  </div>
                  <h5 className="font-bold text-slate-800 uppercase text-[10.5px] leading-tight mb-2">{phase.phase}</h5>
                  <ul className="space-y-1">
                    {phase.objectives.map((obj, oIdx) => (
                      <li key={oIdx} className="text-[10px] text-slate-500 flex items-start space-x-1">
                        <span className="text-[#FF6600]">•</span>
                        <span className="leading-tight">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Monetization Tiers List */}
        <div>
          <div className="border-b border-slate-200 pb-1 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">SECTION V: MONETIZATION FRAMEWORK MODEL (STRATEGY METRICS)</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs mb-6">
            {analysis.monetization.map((model, idx) => (
              <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-55 text-[11px] leading-normal">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">TIER 0{idx + 1}: {model.strategy}</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{model.tierName}</div>
                <div className="text-[#FF6600] font-mono font-bold my-1 bg-orange-50 border border-orange-100/40 px-1.5 py-0.5 rounded w-max">{model.suggestedPricing}</div>
                <p className="text-[10px] text-slate-500 mt-1.5"><strong>Advantage:</strong> {model.pros}</p>
                <p className="text-[10px] text-slate-550 mt-0.5"><strong>Obstacle:</strong> {model.cons}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rival Competitive Intelligence Table Layout */}
        <div>
          <div className="border-b border-slate-200 pb-1 mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">SECTION VI: COMPETITIVE RADAR SCREEN DETAILS</h3>
          </div>
          
          <table className="w-full text-left font-sans text-[10.5px] border border-slate-200 divide-y divide-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-2">COMPETITING INCUMBENT</th>
                <th className="p-2">ESTABLISHED STRENGTH</th>
                <th className="p-2">STRATEGIC WEAKNESS ACCENT</th>
                <th className="p-2 text-right">RISK VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {analysis.competitors.map((comp, idx) => (
                <tr key={idx} className="text-slate-650">
                  <td className="p-2 font-bold text-slate-900">{comp.name}</td>
                  <td className="p-2">{comp.strength}</td>
                  <td className="p-2">{comp.weakness}</td>
                  <td className="p-2 text-right font-semibold text-rose-600">{comp.survivalRiskFactor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-slate-150 text-[9.5px] text-slate-400 font-mono">
          End of Evaluation Dossier • Confidential YC Sandbox Appraisal Report • Strictly Secure Channel Print
        </div>
      </div>

    </div>
  );
}

// Minimal static indicator helper to avoid flex rendering bugs during print sheets compilation
interface StaticScoreProps {
  score: number;
  label: string;
}

function StaticScore({ score, label }: StaticScoreProps) {
  return (
    <div className="text-[11px] leading-tight">
      <div className="flex justify-between font-bold mb-0.5 font-mono">
        <span className="text-slate-650 uppercase text-[9.5px] tracking-wide">{label}</span>
        <span className="text-slate-850">{score}%</span>
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded relative overflow-hidden">
        <div className="h-full bg-slate-800 absolute left-0 top-0 rounded" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
