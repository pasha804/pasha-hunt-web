import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultProfile from '@/data/profile.json';

function getProfile(): any {
  const candidatePaths = [
    path.join(process.cwd(), 'data', 'profile.json'),
    path.join(process.cwd(), 'public', 'data', 'profile.json'),
  ];
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw);
        if (data && (data.name || data.experience || data.projects)) {
          return data;
        }
      }
    } catch {
      // Continue to next path
    }
  }
  return defaultProfile;
}

export async function GET() {
  try {
    const profile = getProfile();
    return NextResponse.json({ ok: true, profile });
  } catch (err: any) {
    return NextResponse.json({ ok: true, profile: defaultProfile });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = getProfile();
    const merged = { ...current, ...body };
    try {
      const pPath = path.join(process.cwd(), 'data', 'profile.json');
      fs.writeFileSync(pPath, JSON.stringify(merged, null, 2), 'utf-8');
    } catch {
      // Serverless fallback
    }
    return NextResponse.json({ ok: true, profile: merged });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
