import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedJobs: any[] = [];

function getJobs(): any[] {
  if (cachedJobs.length > 0) return cachedJobs;
  try {
    const filePath = path.join(process.cwd(), 'data', 'jobs.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      cachedJobs = Array.isArray(data) ? data : (data.jobs || []);
    } else {
      cachedJobs = [];
    }
  } catch (e) {
    cachedJobs = [];
  }
  return cachedJobs;
}

// Tech keywords for AI match scoring tailored to candidate profile
const CORE_KEYWORDS = [
  'python', 'react', 'next.js', 'fastapi', 'typescript', 'javascript',
  'ai agent', 'agentic', 'qa', 'tester', 'quality assurance', 'full stack',
  'frontend', 'backend', 'llm', 'software engineer', 'remote'
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const loc = (searchParams.get('loc') || 'all').toLowerCase().trim();
  const mode = (searchParams.get('mode') || 'all').toLowerCase().trim();
  const recruiterOnly = searchParams.get('recruiter') === 'true';
  const aiMatchesOnly = searchParams.get('fit') === 'ai-matches';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '30', 10);

  const allJobs = getJobs();

  let scoredJobs = allJobs.map((job) => {
    const title = (job.title || '').toLowerCase();
    const comp = (job.company || '').toLowerCase();
    const desc = (job.text || job.description || '').toLowerCase();
    const fullText = `${title} ${comp} ${desc}`;

    // Calculate AI Fit Score (65% to 98%)
    let matchHits = 0;
    CORE_KEYWORDS.forEach((kw) => {
      if (fullText.includes(kw)) matchHits++;
    });

    const baseScore = 72;
    const bonus = Math.min(26, matchHits * 4);
    const fitScore = Math.min(98, baseScore + bonus);

    return {
      ...job,
      email: job.email || job.recruiter_email || '',
      description: job.text || job.description || '',
      fitScore
    };
  });

  let filtered = scoredJobs.filter((job) => {
    if (recruiterOnly && !job.email) return false;
    if (aiMatchesOnly && job.fitScore < 85) return false;

    if (q) {
      const title = (job.title || '').toLowerCase();
      const comp = (job.company || '').toLowerCase();
      const desc = (job.description || '').toLowerCase();
      if (!title.includes(q) && !comp.includes(q) && !desc.includes(q)) {
        return false;
      }
    }

    if (loc !== 'all') {
      const jLoc = (job.location || '').toLowerCase();
      if (!jLoc.includes(loc)) return false;
    }

    if (mode !== 'all') {
      const jMode = (job.mode || '').toLowerCase();
      if (!jMode.includes(mode)) return false;
    }

    return true;
  });

  // If AI matches requested, sort by fitScore descending
  if (aiMatchesOnly) {
    filtered.sort((a, b) => b.fitScore - a.fitScore);
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    jobs: paginated
  });
}
