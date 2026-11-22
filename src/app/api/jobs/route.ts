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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const loc = (searchParams.get('loc') || 'all').toLowerCase().trim();
  const mode = (searchParams.get('mode') || 'all').toLowerCase().trim();
  const recruiterOnly = searchParams.get('recruiter') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '30', 10);

  const allJobs = getJobs();

  let filtered = allJobs.filter((job) => {
    if (recruiterOnly && !job.recruiter_email) return false;

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
