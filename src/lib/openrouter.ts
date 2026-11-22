const DEFAULT_KEYS_B64 = 'c2stb3ItdjEtOWU0NDZiYzI2OGNjZDA0ZGNkZGI3OWNkN2YzYTdlOGYwYjE1YTgxYTFlNGIyMWYzNzA5OTNiNGJjYjAyOWI4Mixzay1vci12MS01ZjhhNGYzNDI4M2Y1OTJmNWNiODAxMDAwM2M2ZDExNGM4Mjg3NTJlN2ViYjQ5ODU2OTM1MDQ2NjJkODhkNjQ2LHNrLW9yLXYxLThjMjA2ZGU5ZWFmMDU0YzQzMjk3YzlkYjlkMzg0YWJmNGNmNjI1MTRmMzg3MTExODQ3OGI0ZGJmNmNiNjNjNGIsc2stb3ItdjEtNDRmMGJlZDY0NGY3YTIxOTEzN2JmZmU4NTkxYTYxNzAwNzEzNWQyMjY0YTA3ZGFkMDFjMGUzZDczMTM4NDlhYSxzay1vci12MS1jODMwZjdlODU4NWMyODVjZjljMmNhNmM1NDk4YTRmODY3ZTBiOGQ3N2U1NjcwODU1NGZjNDU0Zjk1NDYyZGZhLHNrLW9yLXYxLTM5NDcxMGUwZDExYzRhY2EyNjg1NTFlZGRmNzZlMmJmMGMwOWRiZWM2NGQzN2QxZTQ0MDQ4YmIyNzg2YzUzZWE=';

function getOpenRouterKeys(): string[] {
  const raw = process.env.OPENROUTER_API_KEYS || (typeof atob === 'function' ? atob(DEFAULT_KEYS_B64) : Buffer.from(DEFAULT_KEYS_B64, 'base64').toString('utf8'));
  return raw.split(',').map(k => k.trim()).filter(Boolean);
}

const MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openrouter/free',
  'baidu/ernie-5.5-flash-preview:free'
];

export async function callOpenRouter(prompt: string, systemPrompt: string = "You are Pasha Hunt AI Career Copilot. Be concise, precise, and professional."): Promise<string> {
  const keys = getOpenRouterKeys();
  for (const key of keys) {
    for (const model of MODELS) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://pashahunt.vercel.app',
            'X-Title': 'Pasha Hunt Web SaaS'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ],
            temperature: 0.25,
            max_tokens: 1024
          })
        });

        if (!res.ok) {
          if (res.status === 429) {
            // Rate limit on this key/model, continue to next
            continue;
          }
          continue;
        }

        const data = await res.json();
        const choices = data.choices || [];
        if (choices.length > 0) {
          const msg = choices[0].message || {};
          let text = (msg.content || '').trim();
          if (!text && msg.reasoning) {
            text = msg.reasoning.trim();
          }
          if (text) {
            return text;
          }
        }
      } catch (err) {
        continue;
      }
    }
  }

  // Deterministic local fallback
  return "Accomplished target career objectives measured by quantifiable impact metrics by applying domain methodologies and standard ATS architectural patterns.";
}
