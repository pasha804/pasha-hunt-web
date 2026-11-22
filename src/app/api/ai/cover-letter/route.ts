import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';

export async function POST(req: Request) {
  try {
    const { name, title, company, skills, contact } = await req.json();

    const systemPrompt = "You are an elite Executive Recruiter and Outreach Copywriter. Write punchy, confident, 3-paragraph professional cover letters tailored to the target company and role. Keep it impact-driven and free of generic AI cliches.";

    const prompt = `Write a high-converting, 3-paragraph cover letter for:
Candidate: ${name || 'Candidate'} (${title || 'Software Professional'})
Target Company: ${company}
Target Position: ${title}
Core Competencies: ${skills || 'Full Stack Engineering, System Design, Automation, Testing'}
Contact: ${contact || ''}

Requirements:
1. Paragraph 1: Enthusiastic, specific hook expressing alignment with ${company}.
2. Paragraph 2: Quantified technical achievements demonstrating Google XYZ impact.
3. Paragraph 3: Clear call-to-action requesting a discussion, signing off with contact details.
Return ONLY the formatted letter text ready to send.`;

    const letter = await callOpenRouter(prompt, systemPrompt);
    return NextResponse.json({ ok: true, letter });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
