import { NextResponse } from 'next/server';
import { verifyGmailCredentials } from '@/lib/gmailVerifier';

export async function POST(req: Request) {
  try {
    const { email, appPassword } = await req.json();
    const result = await verifyGmailCredentials(email, appPassword);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
