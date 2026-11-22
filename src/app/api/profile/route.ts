import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getProfilePath(): string {
  return path.join(process.cwd(), 'data', 'profile.json');
}

export async function GET() {
  try {
    const pPath = getProfilePath();
    if (fs.existsSync(pPath)) {
      const raw = fs.readFileSync(pPath, 'utf-8');
      const data = JSON.parse(raw);
      return NextResponse.json({ ok: true, profile: data });
    }
    return NextResponse.json({ ok: false, error: 'profile.json not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pPath = getProfilePath();
    let current: any = {};
    if (fs.existsSync(pPath)) {
      current = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
    }
    const merged = { ...current, ...body };
    fs.writeFileSync(pPath, JSON.stringify(merged, null, 2), 'utf-8');
    return NextResponse.json({ ok: true, profile: merged });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
