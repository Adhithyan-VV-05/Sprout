import { NextResponse } from 'next/server';
import dns from 'node:dns';

// Ensure IPv4 first on Node to prevent IPv6 network connection timeouts to Cloudflare/OpenRouter
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if not supported in environment
}

export const dynamic = 'force-dynamic';

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';
const OPENROUTER_FALLBACK_MODEL = 'openai/gpt-4o-mini';
const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash';

// OpenRouter Fetch Helper
async function callOpenRouter(apiKey, messages, options = {}) {
  const model = options.model || OPENROUTER_MODEL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'SPROUT';

  const payload = {
    model,
    messages,
    max_tokens: options.max_tokens || 350,
    temperature: options.temperature ?? 0.8
  };

  if (options.response_format) {
    payload.response_format = options.response_format;
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': siteName,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    // If credit limit on gpt-4o, automatically fallback to gpt-4o-mini
    if (res.status === 402 && model !== OPENROUTER_FALLBACK_MODEL) {
      console.warn('OpenRouter credit threshold reached on gpt-4o, falling back to gpt-4o-mini');
      return callOpenRouter(apiKey, messages, { ...options, model: OPENROUTER_FALLBACK_MODEL });
    }
    throw new Error(`OpenRouter error (${res.status}): ${errText}`);
  }

  return res.json();
}

// Gemini Backup Helper
async function callGemini(apiKey, payload, model = GEMINI_MODEL) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    if (model !== GEMINI_FALLBACK_MODEL) {
      return callGemini(apiKey, payload, GEMINI_FALLBACK_MODEL);
    }
    const errText = await res.text();
    throw new Error(`Gemini call failed: ${errText}`);
  }
  return res.json();
}

// THREAD 1: Sprout Conversational Superhero Response Generator
async function threadSproutDialogue({ openRouterKey, geminiKey, message, visitorName, visitorAge, visitorLocation, visitorGender, visitorEmail, history, mode }) {
  const userContext = [];
  if (visitorName) userContext.push(`Visitor Name: ${visitorName}`);
  if (visitorAge) userContext.push(`Age: ${visitorAge}`);
  if (visitorLocation) userContext.push(`Location/Home: ${visitorLocation}`);
  if (visitorGender) userContext.push(`Gender: ${visitorGender}`);
  if (visitorEmail) userContext.push(`Email: ${visitorEmail}`);

  let modeGuidance = mode === 'help'
    ? 'MODE: NEEDS HELP. Offer deep superhero reassurance, gentle grounding, and one small courageous step forward.'
    : 'MODE: CASUAL TALK. Be joyful, brave, fast-paced, and highly varied in your responses. Do not repeat standard greetings.';

  const systemPrompt = `You are Sprout, a brave, warm-hearted, and empathetic superhero Growth Guardian from the magical world of Asterra.
${modeGuidance}

Known Visitor Details: ${userContext.length > 0 ? userContext.join(', ') : 'None yet'}

Instructions:
1. Respond warmly and conversationally to what the visitor just said.
2. Be SMART, BRAVE, and highly DYNAMIC. Never repeat the exact same phrasing. Use rich, varied vocabulary that fits a simple, friendly superhero character.
3. If the visitor introduced themselves, greet them warmly by name.
4. Keep your reply fast-paced and concise (1 to 3 sentences maximum).
5. Do not use emoji symbols or markdown asterisks everywhere. Speak with genuine superhero heart.`;

  // Try OpenRouter (openai/gpt-4o) first
  if (openRouterKey) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      if (Array.isArray(history) && history.length > 0) {
        const validHistory = history
          .filter((h) => h && h.text && h.text.trim())
          .slice(-6);

        for (const h of validHistory) {
          messages.push({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.text.trim()
          });
        }
      }

      messages.push({
        role: 'user',
        content: message
      });

      const data = await callOpenRouter(openRouterKey, messages, {
        max_tokens: 350,
        temperature: mode === 'help' ? 0.7 : 0.85
      });

      const rawText = data?.choices?.[0]?.message?.content || '';
      if (rawText.trim()) {
        return { reply: rawText.trim(), analyzedIssue: null };
      }
    } catch (err) {
      console.warn('OpenRouter dialogue notice, checking fallback:', err.message);
      if (!geminiKey) throw err;
    }
  }

  // Gemini Fallback
  if (geminiKey) {
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      const validHistory = history
        .filter((h) => h && h.text && h.text.trim())
        .slice(-6);

      for (const h of validHistory) {
        const role = h.sender === 'user' ? 'user' : 'model';
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n${h.text.trim()}`;
        } else {
          contents.push({ role, parts: [{ text: h.text.trim() }] });
        }
      }
    }

    const userPromptText = `${systemPrompt}\n\nVisitor Message: "${message}"`;
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += `\n\n${userPromptText}`;
    } else {
      contents.push({ role: 'user', parts: [{ text: userPromptText }] });
    }

    const data = await callGemini(geminiKey, {
      contents,
      generationConfig: {
        temperature: mode === 'help' ? 0.7 : 0.9,
        maxOutputTokens: 500
      }
    });

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { reply: rawText.trim(), analyzedIssue: null };
  }

  return {
    reply: `I hear you deeply, ${visitorName || 'my friend'}. Small steps create mighty forests. I am right beside you.`,
    analyzedIssue: null
  };
}

// THREAD 2: Parallel Entity & Profile Extraction Engine
async function threadEntityExtraction({ openRouterKey, geminiKey, message }) {
  // Heuristic Regex Fast-Pass
  let regexAge = null;
  const ageMatch = message.match(/(?:i am|i'm|my age is|age is|age)\s*([0-9]{1,2})\b|\b([0-9]{1,2})\s*(?:years old|yrs old|years)\b/i);
  if (ageMatch) {
    const val = parseInt(ageMatch[1] || ageMatch[2], 10);
    if (val >= 4 && val <= 120) regexAge = val.toString();
  }

  let regexEmail = null;
  const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) regexEmail = emailMatch[0];

  let regexLocation = null;
  const locMatch = message.match(/(?:i live in|i am from|from|living in|located in|my city is|my country is|my home is in)\s+([A-Za-z\s,]{2,30})/i);
  if (locMatch && locMatch[1]) {
    let candidate = locMatch[1].split(/[\n.,;]|\band\b|\bemail\b|\byou can\b/i)[0].trim();
    if (candidate.length > 1) regexLocation = candidate;
  }

  let regexGender = null;
  const genderMatch = message.match(/\b(male|female|non-binary|boy|girl|man|woman|gentleman|lady)\b/i);
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    if (g === 'boy' || g === 'man' || g === 'gentleman') regexGender = 'Male';
    else if (g === 'girl' || g === 'woman' || g === 'lady') regexGender = 'Female';
    else regexGender = g.charAt(0).toUpperCase() + g.slice(1);
  }

  // OpenRouter JSON Extraction
  if (openRouterKey) {
    try {
      const data = await callOpenRouter(openRouterKey, [
        {
          role: 'system',
          content: 'You are an entity extraction engine. Extract user profile details strictly as JSON: {"name": null, "age": null, "location": null, "gender": null, "email": null}. Do NOT invent details.'
        },
        {
          role: 'user',
          content: message
        }
      ], {
        max_tokens: 150,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const text = data?.choices?.[0]?.message?.content;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          extractedName: parsed.name && parsed.name.toLowerCase() !== 'null' ? parsed.name.trim() : null,
          extractedAge: (parsed.age && parsed.age.toLowerCase() !== 'null' ? parsed.age.toString().trim() : regexAge),
          extractedLocation: parsed.location && parsed.location.toLowerCase() !== 'null' ? parsed.location.trim() : regexLocation,
          extractedGender: parsed.gender && parsed.gender.toLowerCase() !== 'null' ? parsed.gender.trim() : regexGender,
          extractedEmail: parsed.email && parsed.email.toLowerCase() !== 'null' ? parsed.email.trim() : regexEmail
        };
      }
    } catch (err) {
      console.warn('OpenRouter entity extraction notice:', err.message);
    }
  }

  // Gemini JSON Extraction Fallback
  if (geminiKey) {
    try {
      const extractionPrompt = `Extract user profile details from this message if explicitly stated by the user. Do NOT invent details.
Message: "${message}"

Respond strictly in JSON:
{
  "name": "User's real personal name if stated, or null",
  "age": "User's age in digits as string if stated, or null",
  "location": "City/country/location if stated, or null",
  "gender": "Gender (Male, Female, Non-binary) if stated, or null",
  "email": "Email address if stated, or null"
}`;

      const data = await callGemini(geminiKey, {
        contents: [{ role: 'user', parts: [{ text: extractionPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 300,
          responseMimeType: 'application/json'
        }
      });

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          extractedName: parsed.name && parsed.name.toLowerCase() !== 'null' ? parsed.name.trim() : null,
          extractedAge: (parsed.age && parsed.age.toLowerCase() !== 'null' ? parsed.age.toString().trim() : regexAge),
          extractedLocation: parsed.location && parsed.location.toLowerCase() !== 'null' ? parsed.location.trim() : regexLocation,
          extractedGender: parsed.gender && parsed.gender.toLowerCase() !== 'null' ? parsed.gender.trim() : regexGender,
          extractedEmail: parsed.email && parsed.email.toLowerCase() !== 'null' ? parsed.email.trim() : regexEmail
        };
      }
    } catch (err) {
      console.warn('Gemini extraction notice:', err.message);
    }
  }

  // Heuristic Name Fallback
  let fallbackName = null;
  const nameMatch = message.match(/(?:my name is|i am|i'm called|call me|name's)\s+([A-Z][a-z]+|[a-z]+)/i);
  if (nameMatch && nameMatch[1]) {
    const raw = nameMatch[1].trim();
    const banned = ['happy', 'sad', 'tired', 'here', 'ready', 'fine', 'good', 'sprout', 'robot', 'user'];
    if (!banned.includes(raw.toLowerCase()) && raw.length >= 2) {
      fallbackName = raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  return {
    extractedName: fallbackName,
    extractedAge: regexAge,
    extractedLocation: regexLocation,
    extractedGender: regexGender,
    extractedEmail: regexEmail
  };
}

export async function POST(req) {
  try {
    const { message, history = [], mode = 'casual', visitorName, visitorAge, visitorLocation, visitorGender, visitorEmail } = await req.json();

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const availableGeminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2
    ].filter(Boolean);
    const geminiKey = availableGeminiKeys.length > 0
      ? availableGeminiKeys[Math.floor(Math.random() * availableGeminiKeys.length)]
      : null;

    if (!openRouterKey && !geminiKey) {
      console.error('No OpenRouter or Gemini API keys configured.');
      return NextResponse.json(
        { error: 'Server configuration error: No AI key configured.' },
        { status: 500 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ reply: "I'm right here listening. What's on your mind today, friend?" });
    }

    // MULTI-THREAD PARALLEL EXECUTION VIA PROMISE.ALL
    const [dialogueResult, extractionResult] = await Promise.all([
      threadSproutDialogue({
        openRouterKey,
        geminiKey,
        message,
        visitorName,
        visitorAge,
        visitorLocation,
        visitorGender,
        visitorEmail,
        history,
        mode
      }).catch((err) => {
        console.error('Thread 1 error:', err);
        return {
          reply: `I'm standing right beside you, ${visitorName || 'friend'}. Even the tallest oak started as a small seed that never gave up. What shall we protect next?`,
          analyzedIssue: null
        };
      }),

      threadEntityExtraction({
        openRouterKey,
        geminiKey,
        message
      }).catch((err) => {
        console.error('Thread 2 error:', err);
        return {};
      })
    ]);

    return NextResponse.json({
      reply: dialogueResult.reply,
      analyzedIssue: dialogueResult.analyzedIssue || (mode === 'help' ? 'Guidance and support request' : 'Conversation with Sprout'),
      extractedName: extractionResult.extractedName || null,
      extractedAge: extractionResult.extractedAge || null,
      extractedLocation: extractionResult.extractedLocation || null,
      extractedGender: extractionResult.extractedGender || null,
      extractedEmail: extractionResult.extractedEmail || null
    });

  } catch (error) {
    console.error('Error in multi-threaded /api/chat handler:', error);
    return NextResponse.json({
      reply: "Take a deep breath with me. I'm right here with you, always.",
      analyzedIssue: "Connection notice"
    });
  }
}
