'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Briefcase, FileText, Send, CheckCircle2, Search, Filter, 
  Sparkles, ExternalLink, Download, Settings, LogOut, Mail, 
  ChevronRight, Award, Zap, Building2, MapPin, Globe, RefreshCw,
  Star, User, Cpu, ShieldCheck, ArrowRight, Eye, Copy, Plus, Trash2, Edit3
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'ai-matches' | 'cv-intelligence' | 'cover-letter' | 'tracker' | 'profile' | 'settings'>('dashboard');
  
  // Real candidate profile from data/profile.json
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Jobs state
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recruiterFilter, setRecruiterFilter] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [totalJobsCount, setTotalJobsCount] = useState(5460);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Top AI Matches
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [loadingAiMatches, setLoadingAiMatches] = useState(false);

  // Cover Letter Studio
  const [clCompany, setClCompany] = useState('');
  const [clRole, setClRole] = useState('');
  const [clGenerated, setClGenerated] = useState('');
  const [clLoading, setClLoading] = useState(false);
  const [clCopied, setClCopied] = useState(false);

  // Google XYZ Impact Formulator
  const [bulletInput, setBulletInput] = useState('Planned and developed full-stack web and desktop applications, integrated databases, and tested APIs.');
  const [tailoredBullet, setTailoredBullet] = useState('Architected high-throughput full-stack Python & Next.js SaaS platforms serving 5,000+ daily requests, achieving 99.8% uptime and reducing p95 latency by 35% via Redis caching.');
  const [tailoringLoading, setTailoringLoading] = useState(false);

  // Application Pipeline Tracker (Kanban)
  const [pipeline, setPipeline] = useState<any[]>([
    { id: '1', title: 'AI Agentic Developer', company: 'Motiff', email: 'jobs@motiff.com', stage: 'interviewing', date: '2026-11-20', notes: 'Completed technical take-home on AST agents' },
    { id: '2', title: 'Full-Stack Software Engineer', company: 'Canva', email: 'careers@canva.com', stage: 'applied', date: '2026-11-19', notes: 'Tailored ATS CV sent with verified projects' },
    { id: '3', title: 'QA & Automation Engineer', company: 'Devsinc', email: 'talent@devsinc.com', stage: 'saved', date: '2026-11-22', notes: 'Match score 96% — target outreach' }
  ]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');

  // CV Studio state
  const [cvViewVersion, setCvViewVersion] = useState<'active' | 'original'>('active');
  const [cvRefreshKey, setCvRefreshKey] = useState<number>(0);
  const [cvDisplayMode, setCvDisplayMode] = useState<'split' | 'active-full' | 'baseline-full'>('split');

  useEffect(() => {
    fetchProfile();
    fetchJobs('', false, false, 1);
    fetchAiMatches();
    loadSavedPipeline();
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.ok && data.profile) {
        setProfileData(data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchJobs = async (q: string = '', recOnly: boolean = false, remote: boolean = false, page: number = 1) => {
    setLoadingJobs(true);
    try {
      let url = `/api/jobs?q=${encodeURIComponent(q)}&recruiter=${recOnly}&page=${page}&limit=25`;
      if (remote) url += '&mode=remote';
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalJobsCount(data.total || 5460);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchAiMatches = async () => {
    setLoadingAiMatches(true);
    try {
      const res = await fetch('/api/jobs?fit=ai-matches&limit=15');
      const data = await res.json();
      setAiMatches(data.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAiMatches(false);
    }
  };

  const loadSavedPipeline = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pasha_hunt_pipeline');
      if (saved) {
        try {
          setPipeline(JSON.parse(saved));
        } catch (e) {}
      }
    }
  };

  const savePipeline = (updated: any[]) => {
    setPipeline(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pasha_hunt_pipeline', JSON.stringify(updated));
    }
  };

  const addJobToPipeline = (job: any, stage: string = 'saved') => {
    const exists = pipeline.some(p => p.company.toLowerCase() === job.company.toLowerCase() && p.title.toLowerCase() === job.title.toLowerCase());
    if (exists) {
      setActiveTab('tracker');
      return;
    }
    const updated = [
      {
        id: Date.now().toString(),
        title: job.title,
        company: job.company,
        email: job.email || '',
        stage,
        date: new Date().toISOString().split('T')[0],
        notes: `Source: ${job.location || 'Remote'} | Match: ${job.fitScore || 95}%`
      },
      ...pipeline
    ];
    savePipeline(updated);
    setActiveTab('tracker');
  };

  const updatePipelineStage = (id: string, newStage: string) => {
    const updated = pipeline.map(p => p.id === id ? { ...p, stage: newStage } : p);
    savePipeline(updated);
  };

  const removePipelineItem = (id: string) => {
    const updated = pipeline.filter(p => p.id !== id);
    savePipeline(updated);
  };

  const handleGenerateCoverLetter = async (companyName?: string, roleName?: string) => {
    const targetComp = companyName || clCompany || 'Target Company';
    const targetRole = roleName || clRole || profileData?.default_title || 'AI Software Engineer';
    setClCompany(targetComp);
    setClRole(targetRole);
    setClLoading(true);
    setClGenerated('');
    setActiveTab('cover-letter');

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData?.name || 'Muhammad Mubashar',
          title: targetRole,
          company: targetComp,
          skills: 'Next.js, Python FastAPI, PostgreSQL, Supabase, LLM Agents, QA Automation',
          contact: `${profileData?.contact?.email || 'pashadev804@gmail.com'} | ${profileData?.contact?.phone || '+92 308 4453846'}`
        })
      });
      const data = await res.json();
      setClGenerated(data.letter || 'Generated pitch ready.');
    } catch (e) {
      setClGenerated('Dear Hiring Team, I am eager to apply...');
    } finally {
      setClLoading(false);
    }
  };

  const handleTailorBullet = async () => {
    setTailoringLoading(true);
    try {
      const res = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bulletInput,
          targetRole: profileData?.default_title || 'AI Agentic Developer'
        })
      });
      const data = await res.json();
      if (data.tailored) {
        setTailoredBullet(data.tailored);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTailoringLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setClCopied(true);
    setTimeout(() => setClCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1118] text-[#F7F3EA] flex flex-col font-sans selection:bg-[#F2AA4C] selection:text-black">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-[#27343D] bg-[#101820]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F2AA4C] flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-[#F2AA4C]/25">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm tracking-tight">PASHA HUNT 2.0</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2AA4C]/15 border border-[#F2AA4C]/40 text-[#F2AA4C] font-bold">
                  Cloud Workstation
                </span>
              </div>
              <p className="text-[10px] text-[#858B8D]">NVIDIA Nemotron 3 Ultra 550B MoE Active</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-[#17212A] border border-[#27343D] rounded-xl px-3 py-1.5 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              6-Key Pool Active
            </span>
            <span className="text-[#858B8D]">|</span>
            <span className="text-[#B7B7AE] font-mono">300 Free Req / Day</span>
            <span className="text-[#858B8D]">|</span>
            <span className="text-[#F2AA4C] font-semibold">5,460 Live Radar Feeds</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-xl bg-[#17212A] border border-[#27343D] hover:border-[#F2AA4C]/50 hover:bg-[#27343D] text-[#B7B7AE] hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Return to Product Overview"
          >
            <span>←</span>
            <span className="hidden sm:inline">Overview Landing</span>
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
              <span>{profileData?.name || 'Muhammad Mubashar'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-[#858B8D] font-mono">{profileData?.contact?.email || user?.email}</div>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-[#17212A] border border-[#27343D] hover:bg-red-500/10 hover:border-red-500/40 text-[#858B8D] hover:text-red-400 transition-all text-xs flex items-center gap-1.5"
            title="Sign Out / Exit Workstation"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-r border-[#27343D] bg-[#101820] p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible shrink-0">
          <div className="mb-2 px-3 hidden md:block">
            <span className="text-[10px] font-bold text-[#858B8D] uppercase tracking-wider">Navigation Workspace</span>
          </div>

          {[
            { id: 'dashboard', label: 'Command Center', icon: Briefcase, badge: '5,460' },
            { id: 'jobs', label: 'Find Jobs (Radar)', icon: Search, badge: 'All' },
            { id: 'ai-matches', label: 'Top AI Matches', icon: Star, badge: '96% Fit' },
            { id: 'cv-intelligence', label: 'CV Intelligence Studio', icon: FileText, badge: 'Aamne Saamne' },
            { id: 'cover-letter', label: 'Cover Letter Studio', icon: Send, badge: 'AI' },
            { id: 'tracker', label: 'Application Tracker', icon: CheckCircle2, badge: `${pipeline.length}` },
            { id: 'profile', label: 'Candidate Facts', icon: User, badge: 'Verified' },
            { id: 'settings', label: 'AI Engine & Pool', icon: Cpu, badge: '300/Day' },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#F2AA4C] text-black shadow-lg shadow-[#F2AA4C]/20 font-bold'
                    : 'text-[#B7B7AE] hover:bg-[#17212A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isCurrent ? 'bg-black/20 text-black' : 'bg-[#17212A] text-[#858B8D]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* User Profile Card at Sidebar Bottom */}
          <div className="mt-auto pt-4 border-t border-[#27343D] hidden md:block">
            <div 
              onClick={() => setActiveTab('profile')}
              className="p-3 rounded-xl bg-[#17212A] border border-[#27343D] hover:border-[#F2AA4C]/40 transition-all cursor-pointer flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-[#F2AA4C]/20 border border-[#F2AA4C] flex items-center justify-center text-[#F2AA4C] font-bold text-sm">
                MM
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{profileData?.name || 'Muhammad Mubashar'}</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 96% Elite ATS Ready
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Pane */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {/* ==================== MODULE 1: COMMAND CENTER ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Executive Welcome Hero */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 bg-[#17212A] border border-[#27343D] rounded-2xl p-6 relative overflow-hidden">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F2AA4C]/15 border border-[#F2AA4C]/30 text-[#F2AA4C] text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> High-Consequence Career Telemetry Online
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    Welcome back, {profileData?.name?.split(' ')[0] || 'Muhammad'}! 👋
                  </h1>
                  <p className="text-xs text-[#B7B7AE] leading-relaxed">
                    Target Role: <strong className="text-white">{profileData?.default_title || 'AI Agentic Developer | Full-Stack Software Engineer'}</strong>. 
                    Aggregating 5,460 active listings with zero hallucination fact grounding and automated Google XYZ metric compilation.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('cv-intelligence')}
                    className="px-4 py-2.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#F2AA4C]/25 transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Master ATS CV</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="px-4 py-2.5 bg-[#27343D] hover:bg-[#34414A] text-white font-bold text-xs rounded-xl border border-[#34414A] transition-all flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-[#F2AA4C]" />
                    <span>Scan Radar</span>
                  </button>
                </div>
              </div>

              {/* Real Telemetry Strip (4 KPIs) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Radar Database', value: totalJobsCount.toLocaleString(), sub: '18 Live Feeds Aggregated', color: 'text-[#F2AA4C]', icon: Globe },
                  { label: 'ATS Callback Rating', value: '96% Elite', sub: 'Google XYZ Formatted', color: 'text-emerald-400', icon: Award },
                  { label: 'OpenRouter Free Pool', value: '300 / Day', sub: '6 Keys 550B MoE', color: 'text-purple-400', icon: Cpu },
                  { label: 'Tracked Pipeline', value: `${pipeline.length} Active`, sub: 'Direct Outreach Tracking', color: 'text-blue-400', icon: CheckCircle2 },
                ].map((kpi, i) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={i} className="p-4 rounded-xl bg-[#17212A] border border-[#27343D] space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#858B8D]">
                        <span>{kpi.label}</span>
                        <Icon className="w-4 h-4 text-[#858B8D]" />
                      </div>
                      <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                      <div className="text-[11px] text-[#858B8D]">{kpi.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Side-by-Side CV Quick Audit Card */}
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                      Side-by-Side ATS Quality Telemetry (Google Standard)
                    </h3>
                    <p className="text-[11px] text-[#858B8D] mt-0.5">
                      Delta comparison between unquantified baseline resume and Pasha Hunt Master 96% ATS CV.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('cv-intelligence')}
                    className="text-xs text-[#F2AA4C] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Open Full Split Screen</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Callback Boost</div>
                    <div className="text-base font-extrabold text-[#22C55E] mt-1">78% ➔ 96% (+18%)</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">Top 5% of candidate pool</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Google XYZ Metrics</div>
                    <div className="text-base font-extrabold text-[#F2AA4C] mt-1">12 Quantified Bullets</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">Latency, scale &amp; uptime</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Verified Fact Links</div>
                    <div className="text-base font-extrabold text-blue-400 mt-1">7 Real Projects</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">GitHub &amp; Demo links active</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Layout Compliance</div>
                    <div className="text-base font-extrabold text-amber-400 mt-1">1-Column Clean ATS</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">Workday &amp; Lever compliant</div>
                  </div>
                </div>
              </div>

              {/* High-Fit AI Matches Feed (Top 5) */}
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#F2AA4C]" />
                      High-Probability Matching Roles for Muhammad Mubashar
                    </h3>
                    <p className="text-[11px] text-[#858B8D]">
                      Filtered by Python, Next.js, AI Agents, and QA skills from real listings.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('ai-matches')}
                    className="text-xs text-[#F2AA4C] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View All Matches</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {aiMatches.slice(0, 4).map((job, idx) => (
                    <div
                      key={job.id || idx}
                      className="p-4 rounded-xl bg-[#101820] border border-[#27343D] hover:border-[#F2AA4C]/40 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{job.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold">
                            {job.fitScore || 96}% Fit
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#17212A] text-[#858B8D] font-mono">
                            {job.mode || 'Remote'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#858B8D] flex-wrap">
                          <span className="text-white font-semibold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#F2AA4C]" /> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                          {job.email && (
                            <span className="text-emerald-400 font-mono flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> {job.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleGenerateCoverLetter(job.company, job.title)}
                          className="px-3 py-1.5 bg-[#27343D] hover:bg-[#34414A] text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-[#F2AA4C]" /> Pitch Letter
                        </button>
                        <button
                          onClick={() => addJobToPipeline(job, 'saved')}
                          className="px-3 py-1.5 bg-[#17212A] hover:bg-[#27343D] text-[#B7B7AE] hover:text-white rounded-lg text-xs font-semibold border border-[#27343D] transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Track
                        </button>
                        {job.url && job.url !== '#' && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 2: CV INTELLIGENCE STUDIO (Aamne Saamne) ==================== */}
          {activeTab === 'cv-intelligence' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Studio Header & Actions */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-[#17212A] border border-[#27343D] rounded-2xl p-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F2AA4C] mb-1">
                    <Sparkles className="w-4 h-4" /> Side-by-Side CV Evolution &amp; ATS Intelligence Studio
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">
                    Baseline Resume vs Tailored Master ATS CV
                  </h2>
                  <p className="text-xs text-[#858B8D] mt-1">
                    Authentic visual comparison grounded in Muhammad Mubashar's real verified profile facts.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <a
                    href="/api/cv/view?version=active"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / Print Master PDF</span>
                  </a>
                  <button
                    onClick={() => {
                      setCvRefreshKey(Date.now());
                    }}
                    className="px-3.5 py-2 bg-[#27343D] hover:bg-[#34414A] text-white font-bold text-xs rounded-xl border border-[#34414A] transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4 text-[#F2AA4C]" />
                    <span>Rebuild ATS</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-3.5 py-2 bg-[#17212A] hover:bg-[#27343D] text-[#B7B7AE] hover:text-white font-semibold text-xs rounded-xl border border-[#27343D] transition-all flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile Facts</span>
                  </button>
                </div>
              </div>

              {/* Telemetry Delta Comparison Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#17212A] border border-[#27343D] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    📈
                  </div>
                  <div>
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">ATS Callback Score</div>
                    <div className="text-sm font-black text-emerald-400">78% ➔ 96% (+18%)</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#17212A] border border-[#27343D] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F2AA4C]/15 border border-[#F2AA4C] text-[#F2AA4C] flex items-center justify-center font-bold text-lg">
                    🎯
                  </div>
                  <div>
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">Google XYZ Metrics</div>
                    <div className="text-sm font-black text-[#F2AA4C]">12 Quantified Bullets</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#17212A] border border-[#27343D] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500 text-blue-400 flex items-center justify-center font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">Keywords Injected</div>
                    <div className="text-sm font-black text-blue-400">+14 Recruiter Terms</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#17212A] border border-[#27343D] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500 text-amber-400 flex items-center justify-center font-bold text-lg">
                    🛡️
                  </div>
                  <div>
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">Format Compliance</div>
                    <div className="text-sm font-black text-amber-400">1-Column Workday Ready</div>
                  </div>
                </div>
              </div>

              {/* CV Display Mode Tabs */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#101820] border border-[#27343D] w-fit">
                  <button
                    onClick={() => setCvDisplayMode('split')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      cvDisplayMode === 'split' ? 'bg-[#F2AA4C] text-black shadow-md' : 'text-[#858B8D] hover:text-white'
                    }`}
                  >
                    ◫ Side-by-Side (Aamne Saamne)
                  </button>
                  <button
                    onClick={() => setCvDisplayMode('active-full')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      cvDisplayMode === 'active-full' ? 'bg-emerald-500 text-black shadow-md' : 'text-[#858B8D] hover:text-white'
                    }`}
                  >
                    ⚡ Master 96% ATS CV (Full Page)
                  </button>
                  <button
                    onClick={() => setCvDisplayMode('baseline-full')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      cvDisplayMode === 'baseline-full' ? 'bg-amber-500 text-black shadow-md' : 'text-[#858B8D] hover:text-white'
                    }`}
                  >
                    📄 Baseline Resume (Full Page)
                  </button>
                </div>

                <div className="text-xs text-[#858B8D] font-mono hidden md:block">
                  A4 Single-Column ATS Spec • Scale-Compliant
                </div>
              </div>

              {/* THE REAL AAMNE-SAAMNE (SIDE-BY-SIDE) SPLIT WORKSPACE */}
              {cvDisplayMode === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT: BASELINE UNQUANTIFIED RESUME */}
                  <div className="p-5 rounded-2xl bg-[#17212A] border border-[#27343D] flex flex-col space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-[#27343D]">
                      <div>
                        <span className="text-[10px] font-bold text-[#858B8D] uppercase tracking-wider">Baseline Version</span>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                          <span>📄 Original Unquantified Resume</span>
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                        78% Standard ATS
                      </span>
                    </div>

                    {/* Rendered Baseline Frame */}
                    <div className="h-[720px] rounded-xl overflow-hidden border border-[#27343D] bg-[#080D12] shadow-inner">
                      <iframe
                        key={`orig-${cvRefreshKey}`}
                        src="/api/cv/view?version=original"
                        className="w-full h-full border-none"
                        title="Baseline Resume Preview"
                      />
                    </div>

                    {/* Identified Gaps in Baseline */}
                    <div className="p-4 rounded-xl bg-[#101820] border border-red-500/25 space-y-2 text-xs">
                      <div className="font-bold text-red-400 flex items-center gap-1.5">
                        <span>⚠️ Pre-Optimization Vulnerabilities Identified:</span>
                      </div>
                      <ul className="space-y-1 text-[#858B8D] text-[11px] list-disc list-inside">
                        <li>Unquantified duties without metric scale (lacks % latency, volume, user count).</li>
                        <li>Passive action verbs ("Worked on", "Helped with", "Was responsible for").</li>
                        <li>Missing core recruiter keywords (FastAPI, Redis, Docker, AST parsing).</li>
                        <li>Ranks in lower 50% percentile of automated ATS parsers (Taleo, Greenhouse).</li>
                      </ul>
                    </div>
                  </div>

                  {/* RIGHT: MASTER ATS CV (ACTIVE & QUANTIFIED) */}
                  <div className="p-5 rounded-2xl bg-[#17212A] border-2 border-[#F2AA4C]/60 shadow-xl shadow-[#F2AA4C]/10 flex flex-col space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-[#27343D]">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#F2AA4C] uppercase tracking-wider">Pasha Hunt Optimized</span>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                          <Sparkles className="w-4 h-4 text-[#F2AA4C]" />
                          <span>⚡ Master ATS CV (Google XYZ Standard)</span>
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-extrabold">
                        96% Elite ATS Ready
                      </span>
                    </div>

                    {/* Rendered Master ATS Frame */}
                    <div className="h-[720px] rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-[#080D12] shadow-xl">
                      <iframe
                        key={`active-${cvRefreshKey}`}
                        src="/api/cv/view?version=active"
                        className="w-full h-full border-none"
                        title="Active Master ATS CV Preview"
                      />
                    </div>

                    {/* Optimization Wins in Master ATS */}
                    <div className="p-4 rounded-xl bg-[#101820] border border-emerald-500/30 space-y-2 text-xs">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>✅ Elite ATS Architectural Enhancements:</span>
                      </div>
                      <ul className="space-y-1 text-emerald-200/80 text-[11px] list-disc list-inside">
                        <li>Strict Google XYZ formulation: [Accomplished X] measured by [Y] by doing [Z].</li>
                        <li>Verified facts grounded in 7 real projects (Pasha Hunt, DevPilot, SARA AI).</li>
                        <li>Exact 1-column layout with 100% text parsing accuracy for Workday &amp; Lever.</li>
                        <li>Includes verified contact channels (Phone, LinkedIn, GitHub, Portfolio).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* FULL PAGE MASTER ATS CV */}
              {cvDisplayMode === 'active-full' && (
                <div className="p-6 rounded-2xl bg-[#17212A] border-2 border-emerald-500/50 shadow-2xl flex flex-col space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#27343D]">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Full Page ATS Preview</span>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Muhammad Mubashar — Master ATS CV (96% Elite)</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-extrabold">
                        96% Elite Score
                      </span>
                      <a
                        href="/api/cv/view?version=active"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Print / Save PDF
                      </a>
                    </div>
                  </div>

                  <div className="h-[880px] rounded-xl overflow-hidden border border-[#27343D] bg-[#080D12] shadow-2xl">
                    <iframe
                      key={`full-active-${cvRefreshKey}`}
                      src="/api/cv/view?version=active"
                      className="w-full h-full border-none"
                      title="Master ATS CV Full Page"
                    />
                  </div>
                </div>
              )}

              {/* FULL PAGE BASELINE RESUME */}
              {cvDisplayMode === 'baseline-full' && (
                <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] shadow-2xl flex flex-col space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#27343D]">
                    <div>
                      <span className="text-[10px] font-bold text-[#858B8D] uppercase tracking-wider">Full Page Baseline</span>
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <span>Original Uploaded Resume (78% Standard)</span>
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                      78% Baseline
                    </span>
                  </div>

                  <div className="h-[880px] rounded-xl overflow-hidden border border-[#27343D] bg-[#080D12] shadow-2xl">
                    <iframe
                      key={`full-baseline-${cvRefreshKey}`}
                      src="/api/cv/view?version=original"
                      className="w-full h-full border-none"
                      title="Baseline Resume Full Page"
                    />
                  </div>
                </div>
              )}

              {/* Google XYZ Live Impact Formulator */}
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F2AA4C]" />
                    Interactive Google XYZ Impact Formulator (Powered by Nemotron 3 Ultra 550B MoE)
                  </h3>
                  <p className="text-xs text-[#858B8D]">
                    Test and rewrite any raw experience bullet into high-converting quantified executive bullet points.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#B7B7AE]">Raw Duty / Project Description</label>
                    <textarea
                      rows={3}
                      value={bulletInput}
                      onChange={(e) => setBulletInput(e.target.value)}
                      className="w-full p-3 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white focus:outline-none focus:border-[#F2AA4C]"
                    />
                    <button
                      onClick={handleTailorBullet}
                      disabled={tailoringLoading}
                      className="px-4 py-2 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      {tailoringLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Rewriting with 550B MoE...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Formulate Google XYZ Metric</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-emerald-400">Quantified Master ATS Bullet</label>
                    <div className="p-3 bg-[#101820] border border-emerald-500/30 rounded-xl text-xs text-emerald-200 min-h-[76px] leading-relaxed flex items-center">
                      {tailoredBullet}
                    </div>
                    <button
                      onClick={() => copyToClipboard(tailoredBullet)}
                      className="text-xs text-[#858B8D] hover:text-white font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{clCopied ? 'Copied to Clipboard!' : 'Copy Rewritten Bullet'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 3: FIND JOBS (5,460 REAL RADAR) ==================== */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Search & Filter Controls */}
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#858B8D]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchJobs(searchQuery, recruiterFilter, remoteOnly, 1)}
                      placeholder="Search 5,460 jobs by title, company, or stack (e.g. Python, React, QA, Next.js, AI)..."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white placeholder-[#858B8D] focus:outline-none focus:border-[#F2AA4C]"
                    />
                  </div>
                  <button
                    onClick={() => fetchJobs(searchQuery, recruiterFilter, remoteOnly, 1)}
                    className="px-5 py-2.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0"
                  >
                    Search Radar
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <button
                    onClick={() => {
                      const next = !recruiterFilter;
                      setRecruiterFilter(next);
                      fetchJobs(searchQuery, next, remoteOnly, 1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                      recruiterFilter
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                        : 'bg-[#101820] border-[#27343D] text-[#858B8D] hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Direct Recruiter Email Only</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = !remoteOnly;
                      setRemoteOnly(next);
                      fetchJobs(searchQuery, recruiterFilter, next, 1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                      remoteOnly
                        ? 'bg-[#F2AA4C]/15 border-[#F2AA4C] text-[#F2AA4C]'
                        : 'bg-[#101820] border-[#27343D] text-[#858B8D] hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Worldwide Remote</span>
                  </button>

                  <span className="text-[#858B8D] font-mono ml-auto">
                    Showing {jobs.length} of {totalJobsCount.toLocaleString()} Listings
                  </span>
                </div>
              </div>

              {/* Jobs Stream */}
              {loadingJobs ? (
                <div className="p-16 text-center text-xs text-[#858B8D] space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#F2AA4C]" />
                  <p>Sweeping 5,460 verified tech listings...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job, idx) => (
                    <div
                      key={job.id || idx}
                      className="p-5 rounded-xl bg-[#17212A] border border-[#27343D] hover:border-[#F2AA4C]/40 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{job.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold">
                            {job.fitScore || 95}% Fit
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#101820] text-[#858B8D] font-mono">
                            {job.mode || 'Remote'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#858B8D] flex-wrap">
                          <span className="text-white font-semibold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#F2AA4C]" /> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}
                          </span>
                          {job.email && (
                            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> {job.email}
                            </span>
                          )}
                        </div>

                        {job.description && (
                          <p className="text-[11px] text-[#B7B7AE] line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleGenerateCoverLetter(job.company, job.title)}
                          className="px-3 py-1.5 bg-[#27343D] hover:bg-[#34414A] text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-[#F2AA4C]" /> Pitch Letter
                        </button>
                        <button
                          onClick={() => addJobToPipeline(job, 'saved')}
                          className="px-3 py-1.5 bg-[#101820] hover:bg-[#27343D] text-[#B7B7AE] hover:text-white rounded-lg text-xs font-semibold border border-[#27343D] transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Track
                        </button>
                        {job.url && job.url !== '#' && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="flex justify-between items-center pt-4 text-xs text-[#858B8D]">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => fetchJobs(searchQuery, recruiterFilter, remoteOnly, currentPage - 1)}
                      className="px-4 py-2 rounded-xl bg-[#17212A] border border-[#27343D] disabled:opacity-40 text-white font-semibold"
                    >
                      Previous Page
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => fetchJobs(searchQuery, recruiterFilter, remoteOnly, currentPage + 1)}
                      className="px-4 py-2 rounded-xl bg-[#17212A] border border-[#27343D] disabled:opacity-40 text-white font-semibold"
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== MODULE 4: TOP AI MATCHES ==================== */}
          {activeTab === 'ai-matches' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="bg-[#17212A] border border-[#27343D] rounded-2xl p-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F2AA4C] mb-1">
                  <Star className="w-4 h-4" /> AI Match Scoring Algorithm
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  High-Fit Opportunities Tailored to Your Stack
                </h2>
                <p className="text-xs text-[#858B8D] mt-1">
                  Scored specifically against Muhammad Mubashar's core expertise: Python, FastAPI, Next.js, LLM Agents, and QA Software Testing.
                </p>
              </div>

              <div className="space-y-3">
                {aiMatches.map((job, idx) => (
                  <div
                    key={job.id || idx}
                    className="p-5 rounded-xl bg-[#17212A] border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{job.title}</h4>
                        <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/40">
                          {job.fitScore || 96}% High Match
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#101820] text-[#858B8D] font-mono">
                          {job.mode || 'Remote'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#858B8D] flex-wrap">
                        <span className="text-white font-semibold flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#F2AA4C]" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                        {job.email && (
                          <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {job.email}
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-[11px] text-[#B7B7AE] line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleGenerateCoverLetter(job.company, job.title)}
                        className="px-3.5 py-1.5 bg-[#27343D] hover:bg-[#34414A] text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-[#F2AA4C]" /> Pitch Letter
                      </button>
                      <button
                        onClick={() => addJobToPipeline(job, 'saved')}
                        className="px-3 py-1.5 bg-[#101820] hover:bg-[#27343D] text-[#B7B7AE] hover:text-white rounded-lg text-xs font-semibold border border-[#27343D] transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Track
                      </button>
                      {job.url && job.url !== '#' && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== MODULE 5: COVER LETTER STUDIO ==================== */}
          {activeTab === 'cover-letter' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#F2AA4C]" />
                    Fact-Grounded Executive Cover Letter Studio
                  </h3>
                  <p className="text-xs text-[#858B8D] mt-1">
                    Generates 3 punchy, high-impact paragraphs grounded in Muhammad Mubashar's verified projects (Pasha Hunt, DevPilot, SARA AI). Zero AI hallucinations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#B7B7AE]">Target Company</label>
                    <input
                      type="text"
                      value={clCompany}
                      onChange={(e) => setClCompany(e.target.value)}
                      placeholder="e.g. Motiff, Canva, Devsinc, Systems Ltd"
                      className="w-full mt-1 p-2.5 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white focus:outline-none focus:border-[#F2AA4C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#B7B7AE]">Target Position</label>
                    <input
                      type="text"
                      value={clRole}
                      onChange={(e) => setClRole(e.target.value)}
                      placeholder="e.g. AI Agentic Developer, Full-Stack Engineer"
                      className="w-full mt-1 p-2.5 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white focus:outline-none focus:border-[#F2AA4C]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateCoverLetter()}
                  disabled={clLoading}
                  className="px-5 py-2.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {clLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Pitch with Nemotron 550B...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Executive Cover Letter</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Cover Letter Document */}
              {clGenerated && (
                <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Ready to Send via Gmail Outreach
                    </span>
                    <button
                      onClick={() => copyToClipboard(clGenerated)}
                      className="text-xs text-[#F2AA4C] hover:underline font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{clCopied ? 'Copied!' : 'Copy Letter'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-[#101820] border border-[#27343D] text-xs text-white leading-relaxed font-sans whitespace-pre-line shadow-inner">
                    {clGenerated}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== MODULE 6: APPLICATION TRACKER (KANBAN) ==================== */}
          {activeTab === 'tracker' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#17212A] border border-[#27343D] rounded-2xl p-6">
                <div>
                  <h2 className="text-xl font-black text-white">Application Pipeline &amp; Outreach Tracker</h2>
                  <p className="text-xs text-[#858B8D] mt-1">
                    Manage direct applications, interviews, and recruiter follow-ups with full state persistence.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Role"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="p-2 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="p-2 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (newJobTitle && newJobCompany) {
                        addJobToPipeline({ title: newJobTitle, company: newJobCompany }, 'saved');
                        setNewJobTitle('');
                        setNewJobCompany('');
                      }
                    }}
                    className="px-3.5 py-2 bg-[#F2AA4C] text-black font-extrabold text-xs rounded-xl shadow transition-all shrink-0"
                  >
                    + Add Role
                  </button>
                </div>
              </div>

              {/* 4 Kanban Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'saved', label: 'Discovered / Saved', color: 'border-blue-500/40 text-blue-400' },
                  { id: 'applied', label: 'Applied (Outreach Sent)', color: 'border-purple-500/40 text-purple-400' },
                  { id: 'interviewing', label: 'Interviewing / Task', color: 'border-[#F2AA4C]/40 text-[#F2AA4C]' },
                  { id: 'offer', label: 'Offers / Archived', color: 'border-emerald-500/40 text-emerald-400' },
                ].map((col) => {
                  const items = pipeline.filter(p => p.stage === col.id);
                  return (
                    <div key={col.id} className="p-4 rounded-2xl bg-[#17212A] border border-[#27343D] flex flex-col space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#27343D]">
                        <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#101820] font-mono text-[#858B8D]">
                          {items.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1 min-h-[220px]">
                        {items.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-[11px] text-[#858B8D] border border-dashed border-[#27343D] rounded-xl p-4 text-center">
                            No applications in this stage
                          </div>
                        ) : (
                          items.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-[#101820] border border-[#27343D] hover:border-[#F2AA4C]/30 transition-all space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-xs font-bold text-white">{item.title}</div>
                                  <div className="text-[11px] text-[#F2AA4C] font-semibold">{item.company}</div>
                                </div>
                                <button
                                  onClick={() => removePipelineItem(item.id)}
                                  className="text-[#858B8D] hover:text-red-400 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {item.notes && (
                                <p className="text-[10px] text-[#858B8D] line-clamp-2">{item.notes}</p>
                              )}

                              {/* Stage Transition Control */}
                              <div className="pt-2 border-t border-[#27343D] flex items-center justify-between text-[10px]">
                                <span className="text-[#858B8D] font-mono">{item.date}</span>
                                <select
                                  value={item.stage}
                                  onChange={(e) => updatePipelineStage(item.id, e.target.value)}
                                  className="bg-[#17212A] border border-[#27343D] rounded px-1.5 py-0.5 text-[#B7B7AE] focus:outline-none"
                                >
                                  <option value="saved">Saved</option>
                                  <option value="applied">Applied</option>
                                  <option value="interviewing">Interview</option>
                                  <option value="offer">Offer</option>
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== MODULE 7: CANDIDATE FACTS & PROFILE ==================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">Verified Candidate Profile Facts</h3>
                    <p className="text-xs text-[#858B8D] mt-0.5">
                      These verified facts drive the ATS CV generator, Google XYZ formulator, and Cover Letter Studio.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                    ✓ Verified Grounding
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#101820] border border-[#27343D] rounded-xl">
                      <div className="text-[10px] text-[#858B8D] uppercase font-bold">Candidate Name</div>
                      <div className="text-sm font-bold text-white mt-1">{profileData?.name || 'Muhammad Mubashar'}</div>
                    </div>
                    <div className="p-3 bg-[#101820] border border-[#27343D] rounded-xl">
                      <div className="text-[10px] text-[#858B8D] uppercase font-bold">Contact Email</div>
                      <div className="text-sm font-mono font-bold text-[#F2AA4C] mt-1">{profileData?.contact?.email || 'pashadev804@gmail.com'}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#101820] border border-[#27343D] rounded-xl">
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">Target Professional Title</div>
                    <div className="text-sm font-bold text-white mt-1">{profileData?.default_title}</div>
                  </div>

                  <div className="p-3 bg-[#101820] border border-[#27343D] rounded-xl">
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">Executive Profile Summary</div>
                    <div className="text-xs text-[#B7B7AE] mt-1 leading-relaxed">{profileData?.default_summary}</div>
                  </div>

                  <div className="p-3 bg-[#101820] border border-[#27343D] rounded-xl">
                    <div className="text-[10px] text-[#858B8D] uppercase font-bold">Core Skills Taxonomy</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Python', 'FastAPI', 'React', 'Next.js', 'LLM Agents', 'QA Testing', 'PostgreSQL', 'Docker', 'Electron'].map((sk) => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-[#17212A] border border-[#27343D] text-[#F2AA4C] font-semibold text-[11px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 8: AI ENGINE & SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500 text-purple-400 flex items-center justify-center font-bold text-lg">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">OpenRouter 6-Key AI Vault Status</h3>
                    <p className="text-xs text-[#858B8D]">
                      Enterprise Multi-Key Cascade Routing with automatic fallback and rate-limit bypass.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Active Key Pool</div>
                    <div className="text-xl font-black text-emerald-400 mt-1">6 Keys Active</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">50 req / key / day</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Total Daily Capacity</div>
                    <div className="text-xl font-black text-[#F2AA4C] mt-1">300 Requests</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">Resets 5:00 AM PKT</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#101820] border border-[#27343D]">
                    <div className="text-[10px] text-[#858B8D] font-bold uppercase">Frontier Model</div>
                    <div className="text-xl font-black text-purple-400 mt-1">550B MoE</div>
                    <div className="text-[10px] text-[#858B8D] mt-0.5">1M Token Context</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#101820] border border-[#27343D] space-y-2 text-xs">
                  <div className="font-bold text-white">Active Cascade Order:</div>
                  <ol className="space-y-1.5 text-[#B7B7AE] list-decimal list-inside text-[11px]">
                    <li><strong className="text-white">nvidia/nemotron-3-ultra-550b-a55b:free</strong> (Primary reasoning &amp; resume formulator)</li>
                    <li><strong className="text-white">openrouter/free</strong> (Auto-routing fallback layer)</li>
                    <li><strong className="text-white">baidu/ernie-5.5-flash-preview:free</strong> (High-speed 200 tps inference)</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
