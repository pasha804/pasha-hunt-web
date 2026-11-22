import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';

export async function POST(req: Request) {
  try {
    const { bullet, targetRole } = await req.json();
    if (!bullet) {
      return NextResponse.json({ ok: false, error: 'Bullet text is required' }, { status: 400 });
    }

    const systemPrompt = `You are an Elite Executive ATS Resume Architect. Rewrite candidate experience bullets strictly following Google XYZ format: "Accomplished [X] measured by [Y] by doing [Z]".
Provide 1 punchy, high-impact rewritten bullet with realistic quantified metrics, active power verbs, and strong ATS keywords for ${targetRole || 'Software Engineering'}. Output the single bullet point only, no conversational filler.`;

    const prompt = `Original Experience Bullet: "${bullet}"\nRewrite in Google XYZ metric format:`;
    const result = await callOpenRouter(prompt, systemPrompt);

    return NextResponse.json({ ok: true, tailored: result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
