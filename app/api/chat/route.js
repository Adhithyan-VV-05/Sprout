import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GEMINI_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODEL = 'gemini-3.7-flash';

async function callGemini(apiKey, payload, model = GEMINI_MODEL) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    if (model !== FALLBACK_MODEL) {
      return callGemini(apiKey, payload, FALLBACK_MODEL);
    }
    const errText = await res.text();
    throw new Error(`Gemini call failed: ${errText}`);
  }
  return res.json();
}

// THREAD 1: Sprout Conversational Superhero Response Generator
async function threadSproutDialogue({ apiKey, message, visitorName, visitorAge, visitorLocation, visitorGender, visitorEmail, history, mode }) {
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

  const contents = [];
  
  if (Array.isArray(history) && history.length > 0) {
    const validHistory = history
      .filter((h) => h && h.text && h.text.trim())
      .slice(-6);

    for (const h of validHistory) {
      const role = h.sender === 'user' ? 'user' : 'model';
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        // Merge with previous message to guarantee alternation
        contents[contents.length - 1].parts[0].text += `\n${h.text.trim()}`;
      } else {
        contents.push({
          role,
          parts: [{ text: h.text.trim() }]
        });
      }
    }
  }

  // Ensure last message is 'user'
  const userPromptText = `${systemPrompt}\n\nVisitor Message: "${message}"`;
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += `\n\n${userPromptText}`;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: userPromptText }]
    });
  }

  const data = await callGemini(apiKey, {
    contents,
    generationConfig: {
      temperature: mode === 'help' ? 0.7 : 0.9,
      maxOutputTokens: 800
    }
  });

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { reply: rawText.trim(), analyzedIssue: null };
}

// THREAD 2: Parallel Entity & Profile Extraction Engine
async function threadEntityExtraction({ apiKey, message }) {
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

  // LLM Structured JSON Extraction
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

  try {
    const data = await callGemini(apiKey, {
      contents: [{ role: 'user', parts: [{ text: extractionPrompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 600,
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
    console.warn('Entity extraction fallback to heuristics:', err.message);
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

    // API Key Rotation Logic
    const availableKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2
    ].filter(Boolean); // Only keep keys that are actually defined in .env

    if (availableKeys.length === 0) {
      console.error('No Gemini API keys found in environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // Pick a random key for this request to distribute the load
    const apiKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];

    if (!message || !message.trim()) {
      return NextResponse.json({ reply: "I'm right here listening. What's on your mind today, friend?" });
    }

    if (!apiKey) {
      return NextResponse.json({
        reply: `I hear you deeply, ${visitorName || 'my friend'}. Small steps create mighty forests. I am right beside you.`,
        analyzedIssue: "General superhero support"
      });
    }

    // MULTI-THREAD PARALLEL EXECUTION VIA PROMISE.ALL
    const [dialogueResult, extractionResult] = await Promise.all([
      threadSproutDialogue({
        apiKey,
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
        apiKey,
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


