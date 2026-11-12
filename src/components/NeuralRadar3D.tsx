"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, ShieldCheck, Zap, Mail, Compass, Sparkles, Terminal } from "lucide-react";

interface RadarNode {
  id: string;
  title: string;
  category: string;
  metric: string;
  icon: any;
  status: "ONLINE" | "SYNCHRONIZED" | "ACTIVE";
  description: string;
  specs: string[];
}

const NODES: RadarNode[] = [
  {
    id: "radar-scrapers",
    title: "18-Feed Scraper Mesh",
    category: "Ingestion Core",
    metric: "5,435 Opportunities",
    icon: Compass,
    status: "ACTIVE",
    description: "Sweeps Remotive, WeWorkRemotely, Indeed, Google Jobs, Arbisoft, Systems Ltd, and direct ATS feeds every cycle with zero IP throttling.",
    specs: ["Deduplication: AST Hash Index", "Ingestion Rate: 120 jobs/sec", "Coverage: 100% Worldwide + PK"]
  },
  {
    id: "radar-mx",
    title: "DNS MX Socket Verifier",
    category: "Deliverability Engine",
    metric: "0.0% Bounces Guaranteed",
    icon: ShieldCheck,
    status: "SYNCHRONIZED",
    description: "Performs authentic socket-level MX DNS queries on corporate mail exchangers before generating applications to guarantee 100% inbox landing.",
    specs: ["DNS Lookup: dnspython Resolver", "Cache Latency: 0.8ms", "SPF & DKIM Compliant: Yes"]
  },
  {
    id: "radar-ats",
    title: "Google XYZ ATS Compiler",
    category: "Intelligence Layer",
    metric: "96% Elite ATS Rank",
    icon: Sparkles,
    status: "SYNCHRONIZED",
    description: "Transforms plain passive resume bullet points into high-impact Google XYZ metrics (Accomplished [X] measured by [Y] by doing [Z]).",
    specs: ["Parser: pypdf Heuristics", "Audit Standard: Workday / Greenhouse", "Pass Threshold: 90%+"]
  },
  {
    id: "radar-ai",
    title: "Priority APINEX AI Cascade",
    category: "Neural Reasoning",
    metric: "Cascading 3-Tier LLM",
    icon: Cpu,
    status: "ONLINE",
    description: "Cascades through Qwen-3.8-Max, DeepSeek-V4.1-Flash, and Claude-Sonnet-4.6 with 6-second timeout fallbacks for lightning-fast cover letters and tailored CVs.",
    specs: ["Model Cascade: Qwen -> DeepSeek -> Sonnet", "Inference Latency: 420ms avg", "Failover: Automatic Fallback"]
  },
  {
    id: "radar-gmail",
    title: "Direct Gmail IMAP/SMTP Socket",
    category: "Delivery Engine",
    metric: "Real [Gmail]/Drafts Sync",
    icon: Mail,
    status: "SYNCHRONIZED",
    description: "Establishes SSL IMAP/SMTP sessions to inject complete drafts directly into the candidate's Gmail Drafts folder with the master ATS CV PDF attached.",
    specs: ["Transport: IMAP4_SSL + RFC 2822", "Attachment: Master ATS CV PDF", "Auto-Pilot Sweep: 30-min loop"]
  },
  {
    id: "radar-daemon",
    title: "30-Min Auto-Pilot Daemon",
    category: "Autonomous Background",
    metric: "Zero Human Supervision",
    icon: Zap,
    status: "ACTIVE",
    description: "Standalone background threading engine that wakes every 30 minutes, sweeps newly posted roles, verifies emails, and alerts on recruiter replies.",
    specs: ["Thread Model: Python Daemon Thread", "Sleep Interval: 1800s", "Telemetry: SQLite + runs.log"]
  }
];

export default function NeuralRadar3D() {
  const [selectedNode, setSelectedNode] = useState<RadarNode>(NODES[0]);

  return (
    <div className="relative w-full rounded-3xl border border-[#1E252D] bg-[#070A0E]/90 p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#10B981]/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E252D] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 text-xs font-mono font-semibold text-[#FF6B00] mb-3">
            <Terminal className="h-3.5 w-3.5" />
            <span>NEURAL RADAR TELEMETRY ENGINE</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            6-Pillar Autonomous Career Architecture
          </h3>
          <p className="text-sm text-[#8E98A4] mt-1 max-w-2xl">
            Real-time visual telemetry of Pasha Hunt 2.0's distributed scraping, MX socket verification, and AI application pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#8E98A4]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#10B981] font-semibold">ALL RADARS SYNCHRONIZED</span>
          </span>
          <span>•</span>
          <span>LATENCY: 3.8ms</span>
        </div>
      </div>

      {/* Interactive Grid & Deep Telemetry */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Nodes Navigation Column */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const Icon = node.icon;
            return (
              <motion.button
                key={node.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNode(node)}
                className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#FF6B00] bg-gradient-to-r from-[#FF6B00]/15 to-transparent shadow-lg shadow-[#FF6B00]/10"
                    : "border-[#1E252D] bg-[#0E1318]/60 hover:border-[#1E252D]/80 hover:bg-[#0E1318]"
                }`}
              >
                <div
                  className={`mt-0.5 p-2 rounded-lg border ${
                    isSelected
                      ? "border-[#FF6B00] bg-[#FF6B00] text-black"
                      : "border-[#1E252D] bg-[#141A21] text-[#8E98A4]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-medium text-[#8E98A4] uppercase tracking-wider">
                      {node.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-[#FF6B00]/20 text-[#FF6B00]"
                          : "bg-[#1E252D] text-[#8E98A4]"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate mt-0.5">{node.title}</h4>
                  <p className="text-xs font-mono text-[#F2AA4C] mt-1">{node.metric}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Inspector Display */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="h-full rounded-2xl border border-[#1E252D] bg-[#0E1318]/90 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#1E252D] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00]">
                      <selectedNode.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#8E98A4] uppercase">{selectedNode.category}</span>
                      <h4 className="text-lg font-bold text-white">{selectedNode.title}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#10B981] font-bold">LIVE TELEMETRY</span>
                    <div className="text-sm font-mono font-bold text-[#F2AA4C]">{selectedNode.metric}</div>
                  </div>
                </div>

                <p className="text-sm text-[#CAD5E2] leading-relaxed mt-5">
                  {selectedNode.description}
                </p>

                {/* Technical Specifications */}
                <div className="mt-6">
                  <h5 className="text-xs font-mono font-semibold text-[#8E98A4] uppercase tracking-wider mb-3">
                    Verification Specifications & Invariants
                  </h5>
                  <div className="space-y-2">
                    {selectedNode.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-[#1E252D] bg-[#141A21]/70 px-3.5 py-2 text-xs font-mono text-[#CAD5E2]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Terminal Execution Status */}
              <div className="mt-8 pt-4 border-t border-[#1E252D] flex items-center justify-between text-xs font-mono text-[#8E98A4]">
                <span>PID: 58241 • TLS 1.3 ENCRYPTED</span>
                <span className="text-[#10B981]">SYSTEM HEALTH: 100% PASS</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

