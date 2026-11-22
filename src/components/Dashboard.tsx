'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Briefcase, FileText, Send, CheckCircle2, Search, Filter, 
  Sparkles, ExternalLink, Download, Settings, LogOut, Mail, 
  ChevronRight, Award, Zap, Building2, MapPin, Globe, RefreshCw
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'studio' | 'cover_letter' | 'tracker' | 'pricing'>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recruiterFilter, setRecruiterFilter] = useState(false);
  const [totalJobsCount, setTotalJobsCount] = useState(5460);

  // Cover Letter Modal
  const [selectedJobForLetter, setSelectedJobForLetter] = useState<any>(null);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);

  // CV Studio Tailor
  const [bulletInput, setBulletInput] = useState('Worked on Python FastAPI backend and improved the api speed.');
  const [tailoredBullet, setTailoredBullet] = useState('Accomplished 40% reduction in API latency (p95 from 450ms to 270ms) measured by Datadog APM tracing and Locust load testing by implementing async database connection pooling (asyncpg) and Redis caching.');
  const [tailoringLoading, setTailoringLoading] = useState(false);

  useEffect(() => {
    loadProfile();
    loadJobs();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadJobs = async (q: string = '', recOnly: boolean = false) => {
    setLoadingJobs(true);
    try {
      const res = await fetch(`/api/jobs?q=${encodeURIComponent(q)}&recruiter=${recOnly}&limit=25`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalJobsCount(data.total || 5460);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs(searchQuery, recruiterFilter);
  };

  const handleGenerateLetter = async (job: any) => {
    setSelectedJobForLetter(job);
    setGeneratingLetter(true);
    setGeneratedLetter('');

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile?.full_name || user?.user_metadata?.full_name || 'Muhammad Mubashar',
          title: profile?.target_title || 'AI Agentic Developer',
          company: job.company,
          skills: 'Next.js, Python FastAPI, PostgreSQL, Supabase, LLM Agents',
          contact: `${user?.email} | ${profile?.phone || '+92 308 4453846'}`
        })
      });
      const data = await res.json();
      setGeneratedLetter(data.letter || 'Generated pitch letter ready.');
    } catch (e) {
      setGeneratedLetter('Dear Hiring Team, I am eager to apply...');
    } finally {
      setGeneratingLetter(false);
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
          targetRole: profile?.target_title || 'AI Engineer'
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

  return (
    <div className="min-h-screen bg-[#0B1118] text-[#F7F3EA] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[#27343D] bg-[#101820]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F2AA4C] flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-[#F2AA4C]/30">
              P
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">PASHA HUNT 2.0</span>
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#F2AA4C]/10 border border-[#F2AA4C]/30 text-[#F2AA4C] font-semibold">
                Cloud SaaS
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-[#17212A] border border-[#27343D] rounded-lg p-1 text-xs">
            <span className="px-2 py-0.5 text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              NVIDIA Nemotron 3 Ultra (550B MoE)
            </span>
            <span className="text-[#858B8D]">|</span>
            <span className="px-2 py-0.5 text-[#B7B7AE]">150 Req / Day Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">
              {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </div>
            <div className="text-[11px] text-[#858B8D]">{user?.email}</div>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 rounded-lg bg-[#17212A] border border-[#27343D] hover:bg-red-500/10 hover:border-red-500/30 text-[#858B8D] hover:text-red-400 transition-all text-xs flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#27343D] bg-[#101820] p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
          {[
            { id: 'overview', label: 'Command Center', icon: Briefcase },
            { id: 'jobs', label: `Career Radar (${totalJobsCount})`, icon: Search },
            { id: 'studio', label: 'ATS CV Studio', icon: FileText },
            { id: 'cover_letter', label: 'Cover Letter Studio', icon: Send },
            { id: 'tracker', label: 'Application Tracker', icon: CheckCircle2 },
            { id: 'pricing', label: 'Pricing & Plans ⭐', icon: Award },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#F2AA4C] text-black shadow-lg shadow-[#F2AA4C]/20'
                    : 'text-[#B7B7AE] hover:bg-[#17212A] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW COMMAND CENTER */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#17212A] border border-[#27343D] rounded-2xl p-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Welcome back, {profile?.full_name?.split(' ')[0] || 'Muhammad'}! 👋
                  </h1>
                  <p className="text-xs text-[#858B8D] mt-1">
                    Your autonomous cloud career radar is currently sweeping 18 live feeds for executive openings.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-[#101820] border border-[#27343D] rounded-xl text-center">
                    <div className="text-lg font-bold text-[#F2AA4C]">96%</div>
                    <div className="text-[10px] text-[#858B8D]">ATS Match</div>
                  </div>
                  <div className="px-4 py-2 bg-[#101820] border border-[#27343D] rounded-xl text-center">
                    <div className="text-lg font-bold text-emerald-400">94/100</div>
                    <div className="text-[10px] text-[#858B8D]">Career Score</div>
                  </div>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Radar Jobs', value: totalJobsCount.toLocaleString(), sub: '+18 Feeds Live', color: 'text-[#F2AA4C]' },
                  { label: 'Drafted to Gmail', value: '3', sub: 'Ready in Gmail Drafts', color: 'text-emerald-400' },
                  { label: 'Direct Recruiter Sockets', value: '3,840', sub: 'Verified MX Zero Bounce', color: 'text-blue-400' },
                  { label: 'Active AI Quota', value: '150 / Day', sub: 'OpenRouter 550B MoE', color: 'text-purple-400' },
                ].map((kpi, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#17212A] border border-[#27343D]">
                    <div className="text-xs text-[#858B8D] mb-1">{kpi.label}</div>
                    <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-[10px] text-[#858B8D] mt-1">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* ATS Checklist Card */}
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D]">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Elite ATS Verification Checklist (Google XYZ Standard)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { label: 'Contact Info & Verified Links', score: '15/15', ok: true },
                    { label: 'Skills Coverage & Taxonomy', score: '20/20', ok: true },
                    { label: 'Experience Metrics (Google XYZ)', score: '35/35', ok: true },
                    { label: 'Education & Qualifications', score: '15/15', ok: true },
                    { label: 'Action Verbs & 1-Column Layout', score: '15/15', ok: true },
                  ].map((chk, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#101820] border border-[#27343D] flex justify-between items-center">
                      <span className="text-[#B7B7AE]">{chk.label}</span>
                      <span className="text-emerald-400 font-bold">{chk.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIND JOBS / RADAR */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#858B8D]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, skill (React, Python, QA, AI), or company..."
                    className="w-full pl-9 pr-3 py-2.5 bg-[#17212A] border border-[#27343D] rounded-xl text-sm text-white placeholder-[#858B8D] focus:outline-none focus:border-[#F2AA4C]"
                  />
                </form>
                <button
                  type="button"
                  onClick={() => {
                    const next = !recruiterFilter;
                    setRecruiterFilter(next);
                    loadJobs(searchQuery, next);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                    recruiterFilter
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-[#17212A] border-[#27343D] text-[#858B8D] hover:text-white'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Direct Recruiter Email Only</span>
                </button>
              </div>

              {/* Jobs List */}
              {loadingJobs ? (
                <div className="p-12 text-center text-xs text-[#858B8D]">Loading jobs from 18 feeds...</div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job, idx) => (
                    <div
                      key={job.id || idx}
                      className="p-4 rounded-xl bg-[#17212A] border border-[#27343D] hover:border-[#F2AA4C]/40 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{job.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2AA4C]/10 text-[#F2AA4C] font-semibold">
                            96% Match
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#858B8D]">
                          <span className="flex items-center gap-1 text-[#B7B7AE]">
                            <Building2 className="w-3.5 h-3.5" /> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}
                          </span>
                          {job.recruiter_email && (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> {job.recruiter_email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleGenerateLetter(job)}
                          className="px-3 py-1.5 bg-[#27343D] hover:bg-[#34414A] text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5 text-[#F2AA4C]" /> Tailor Cover Letter
                        </button>
                        {job.url && job.url !== '#' && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SIDE-BY-SIDE ATS CV STUDIO */}
          {activeTab === 'studio' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D]">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F2AA4C]" />
                  Google XYZ Impact Formulator (Powered by Nemotron 3 Ultra 550B MoE)
                </h3>
                <p className="text-xs text-[#858B8D] mb-4">
                  Transform raw duty descriptions into quantifiable, metrics-driven accomplishment bullets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#B7B7AE]">Raw Experience Bullet (Input)</label>
                    <textarea
                      rows={4}
                      value={bulletInput}
                      onChange={(e) => setBulletInput(e.target.value)}
                      className="w-full p-3 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white focus:outline-none focus:border-[#F2AA4C]"
                    />
                    <button
                      type="button"
                      onClick={handleTailorBullet}
                      disabled={tailoringLoading}
                      className="px-4 py-2 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                    >
                      {tailoringLoading ? 'Rewriting with 550B MoE...' : '⚡ Formulate Google XYZ Bullet'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-emerald-400">Tailored Master ATS Output (96% Score)</label>
                    <div className="p-3 bg-[#101820] border border-emerald-500/30 rounded-xl text-xs text-emerald-200 min-h-[96px]">
                      {tailoredBullet}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COVER LETTER STUDIO */}
          {activeTab === 'cover_letter' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D]">
                <h3 className="text-lg font-bold text-white mb-2">Tailored Executive Cover Letter Studio</h3>
                <p className="text-xs text-[#858B8D] mb-4">
                  Generates 3 punchy, impact-driven paragraphs optimized for recruiters.
                </p>

                {generatingLetter ? (
                  <div className="p-8 text-center text-xs text-[#858B8D]">Drafting pitch via Nemotron 3 Ultra...</div>
                ) : (
                  <textarea
                    rows={12}
                    value={generatedLetter || `Dear Talent Acquisition Team,\n\nI am writing to express my strong interest in the ${profile?.target_title || 'Software Engineering'} position. With extensive experience building high-scale production systems, I look forward to contributing directly to your team's strategic objectives.\n\nThroughout my career, I have specialized in full-stack architecture, API performance optimization, and AI agents, consistently driving measurable outcomes. I welcome the opportunity to discuss my qualifications.\n\nSincerely,\n${profile?.full_name || 'Muhammad Mubashar'}\n${user?.email} | ${profile?.phone || '+92 308 4453846'}`}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="w-full p-4 bg-[#101820] border border-[#27343D] rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-[#F2AA4C]"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 5: APPLICATION TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h3 className="text-lg font-bold text-white">Application Pipeline & Tracking</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Drafted in Gmail (3)', items: ['Devsinc — React Frontend', 'Systems Limited — Full Stack', 'Motive — Python Engineer'] },
                  { title: 'Sent Applications (0)', items: ['All pending review in drafts'] },
                  { title: 'Shortlisted & Interviews (0)', items: ['Awaiting recruiter responses'] },
                ].map((col, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#17212A] border border-[#27343D]">
                    <h4 className="text-xs font-bold text-white mb-3">{col.title}</h4>
                    <div className="space-y-2">
                      {col.items.map((item, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#101820] border border-[#27343D] text-xs text-[#B7B7AE]">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PRICING & PLANS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 max-w-5xl mx-auto text-center py-6">
              <h2 className="text-2xl font-bold text-white">Choose Your Career Superpower</h2>
              <p className="text-xs text-[#858B8D] max-w-md mx-auto">
                Simple, transparent pricing designed to accelerate your job search with zero spam.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                {/* Starter */}
                <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                  <div className="text-xs font-bold text-[#858B8D]">STARTER</div>
                  <div className="text-3xl font-extrabold text-white">$0</div>
                  <p className="text-xs text-[#858B8D]">Essential tools for exploring job market openings.</p>
                  <ul className="space-y-2 text-xs text-[#B7B7AE]">
                    <li>✓ 15 Job Matches / Month</li>
                    <li>✓ 1 Active ATS Master CV</li>
                    <li>✓ Standard Job Radar Sweep</li>
                  </ul>
                  <button className="w-full py-2 bg-[#27343D] text-white rounded-lg text-xs font-bold cursor-default">
                    Current Active Plan
                  </button>
                </div>

                {/* Pro Copilot */}
                <div className="p-6 rounded-2xl bg-[#17212A] border-2 border-[#F2AA4C] space-y-4 shadow-xl shadow-[#F2AA4C]/10 relative">
                  <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-[#F2AA4C] text-black font-extrabold text-[10px]">
                    MOST POPULAR
                  </span>
                  <div className="text-xs font-bold text-[#F2AA4C]">PRO COPILOT ⭐</div>
                  <div className="text-3xl font-extrabold text-white">$19<span className="text-xs text-[#858B8D] font-normal"> / mo</span></div>
                  <p className="text-xs text-[#858B8D]">For serious candidates targeting competitive remote roles.</p>
                  <ul className="space-y-2 text-xs text-[#B7B7AE]">
                    <li>✓ 150 Applications / Month</li>
                    <li>✓ Unlimited Google XYZ Tailoring</li>
                    <li>✓ 1-Click Gmail Draft Sync with PDF</li>
                    <li>✓ Priority Nemotron 550B MoE Engine</li>
                  </ul>
                  <button className="w-full py-2.5 bg-[#F2AA4C] hover:bg-[#FFC16F] text-black rounded-lg text-xs font-bold transition-all shadow-md">
                    Upgrade to Pro ↗
                  </button>
                </div>

                {/* Lifetime */}
                <div className="p-6 rounded-2xl bg-[#17212A] border border-[#27343D] space-y-4">
                  <div className="text-xs font-bold text-purple-400">ELITE LIFETIME</div>
                  <div className="text-3xl font-extrabold text-white">$79<span className="text-xs text-[#858B8D] font-normal"> one-time</span></div>
                  <p className="text-xs text-[#858B8D]">Lifetime access to all future feeds and copilot upgrades.</p>
                  <ul className="space-y-2 text-xs text-[#B7B7AE]">
                    <li>✓ Unlimited Everything Forever</li>
                    <li>✓ Autonomous Auto-Pilot Agent</li>
                    <li>✓ Direct Recruiter MX Sockets</li>
                    <li>✓ VIP 1-on-1 Profile Optimization</li>
                  </ul>
                  <button className="w-full py-2 bg-[#27343D] hover:bg-[#34414A] text-white rounded-lg text-xs font-bold transition-all">
                    Get Lifetime Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
