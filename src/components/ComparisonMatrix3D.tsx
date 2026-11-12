"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, X, ShieldAlert, Zap, Award } from "lucide-react";
import ThreeDCard from "./ThreeDCard";

export default function ComparisonMatrix3D() {
  const features = [
    {
      feature: "Discovery Feed Scope",
      pasha: "18 Distributed Feeds (5,435 Roles)",
      legacy: "Single Siloed Board (Walled Garden)",
      botSpam: "Random Untargeted Web Scraping"
    },
    {
      feature: "Deliverability Mechanism",
      pasha: "Direct MX Socket & Verified Inboxes",
      legacy: "ATS Web Portal Black Hole",
      botSpam: "High Bounce Rate (>35% Bounces)"
    },
    {
      feature: "Resume & CV Intelligence",
      pasha: "Google XYZ ATS Neural Compiler (96%)",
      legacy: "Generic Static PDF Upload",
      botSpam: "Raw Unformatted Text Injection"
    },
    {
      feature: "Application Execution",
      pasha: "Direct [Gmail]/Drafts with PDF Attached",
      legacy: "50-Step Cluttered Job Form",
      botSpam: "Spam Flagged Headless POSTs"
    },
    {
      feature: "Autonomous Auto-Pilot",
      pasha: "30-Min Native Background Engine",
      legacy: "Manual Refresh & Endless Scrolling",
      botSpam: "Blocked by Cloudflare/Bot Gates"
    },
    {
      feature: "Data Privacy & Telemetry",
      pasha: "100% Local-First (Zero Cloud Storage)",
      legacy: "Data Harvested for Target Ads",
      botSpam: "Credentials Stored on Third-Party DB"
    }
  ];

  return (
    <section id="comparison" className="relative py-24 border-t border-[#1E252D]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#FF6B00] mb-4">
            <Award className="h-3.5 w-3.5" />
            <span>THE 10X UNFAIR ADVANTAGE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Why Pasha Hunt 2.0 Obliterates Generic Job Platforms
          </h2>
          <p className="text-[#8E98A4] text-base md:text-lg mt-4 leading-relaxed">
            Stop losing weeks to ATS black holes and 500-applicant queues. Pasha Hunt puts you in direct contact with verified hiring managers.
          </p>
        </div>

        {/* 3D Elevated Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Legacy Job Boards */}
          <ThreeDCard depth={15} glowColor="#EF4444">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <X className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Legacy Job Boards</h4>
                <p className="text-xs text-[#8E98A4]">LinkedIn, Indeed, Glassdoor</p>
              </div>
            </div>
            <div className="text-xs font-mono text-red-400 font-semibold mb-6">
              AVERAGE INTERVIEW RATE: &lt; 2.1%
            </div>
            <ul className="space-y-3.5 text-xs text-[#CAD5E2]">
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>500+ applicants per post in under 2 hours</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Unforgiving Workday/Taleo ATS rejection filters</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Zero visibility on whether recruiters opened your CV</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Exhausting repetitive 40-minute forms</span>
              </li>
            </ul>
          </ThreeDCard>

          {/* Pasha Hunt 2.0 APINEX (Featured Center Hero Card) */}
          <div className="relative md:-mt-4">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-[#F2AA4C] to-[#10B981] opacity-75 blur-lg" />
            <ThreeDCard depth={35} glowColor="#FF6B00" className="border-[#FF6B00] bg-[#0E1318]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Pasha Hunt" className="h-9 w-9 object-contain rounded-lg" />
                  <div>
                    <h4 className="text-xl font-black text-white">Pasha Hunt 2.0</h4>
                    <p className="text-xs font-mono text-[#FF6B00] font-bold">APINEX EDITION WORKSTATION</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B00]/20 text-[#FF6B00] font-bold">
                  RECOMMENDED
                </span>
              </div>
              <div className="text-xs font-mono text-[#10B981] font-bold mb-6">
                AVERAGE INTERVIEW VELOCITY: +420% UPLIFT
              </div>
              <ul className="space-y-3.5 text-xs text-white">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span><strong>18 Radar Feeds</strong> (5,435 live deduplicated roles)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span><strong>0.0% Bounces</strong> via direct DNS MX socket handshake</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span><strong>Google XYZ Compiler</strong> (reaches elite top 2% ATS ranking)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span><strong>Direct Gmail Injection</strong> (drafts created in your actual inbox)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span><strong>30-Min Auto-Pilot</strong> sweeps new jobs while you sleep</span>
                </li>
              </ul>
            </ThreeDCard>
          </div>

          {/* Cheap Mass Spammers */}
          <ThreeDCard depth={15} glowColor="#F59E0B">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Mass Application Bots</h4>
                <p className="text-xs text-[#8E98A4]">Auto-clickers &amp; form blasters</p>
              </div>
            </div>
            <div className="text-xs font-mono text-amber-400 font-semibold mb-6">
              ACCOUNT BAN &amp; SPAM TRAP RISK: HIGH
            </div>
            <ul className="space-y-3.5 text-xs text-[#CAD5E2]">
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>35%+ email bounce rate ruins sender reputation</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Easily detected and shadowbanned by corporate firewalls</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Hallucinated, robotic cover letters that recruiters trash</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Stores candidate passwords and resumes on unknown clouds</span>
              </li>
            </ul>
          </ThreeDCard>
        </div>
      </div>
    </section>
  );
}

