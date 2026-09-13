import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, visitorName, visitorAge, visitorLocation, history, mode = 'casual', isNameSetup = false } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Handle Name Setup & Validation mode specifically
    if (isNameSetup) {
      // Fallback name extraction helper
      let extracted = message.replace(/my name is|i am|i'm|call me|this is|they call me/gi, '').trim();
      extracted = extracted.replace(/[^a-zA-Z\s'-]/g, '').trim();

      const invalidWords = ['idk', 'no', 'why', 'who', 'what', 'hello', 'hi', 'hey', 'nothing', 'skip', 'asdf', 'test', 'user'];
      const isHeuristicValid = extracted.length >= 2 && !invalidWords.includes(extracted.toLowerCase());

      let finalExtractedName = isHeuristicValid ? extracted.split(' ')[0] : null;
      if (finalExtractedName) {
        finalExtractedName = finalExtractedName.charAt(0).toUpperCase() + finalExtractedName.slice(1).toLowerCase();
      }

      if (!apiKey) {
        if (finalExtractedName) {
          return NextResponse.json({
            isNameSetup: true,
            isValidName: true,
            extractedName: finalExtractedName,
            reply: `It's so wonderful to meet you, ${finalExtractedName}! I'm Sprout, your Growth Guardian superhero. How can I help or support you today?`
          });
        } else {
          return NextResponse.json({
            isNameSetup: true,
            isValidName: false,
            reply: `I want to make sure I greet you properly! What is your name?`
          });
        }
      }

      // If Gemini API is available, ask Gemini to validate and extract cleanly without inventing anything
      const nameValidationPrompt = `You are Sprout, a superhero chatbot. A user was asked "What is your name?".
User input: "${message}"

CRITICAL RULE: Extract the EXACT human name provided by the user. Do NOT invent, guess, or make up any name. If the user did NOT provide their name in the input, set "isValidName": false.

Respond in exact JSON format:
{
  "isValidName": boolean,
  "extractedName": "ExactUserGivenName" or null,
  "reply": "Warm greeting acknowledging their exact name if valid, or polite request asking for their real name if not valid. Do NOT use emojis."
}`;

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: nameValidationPrompt }] }],
            generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            if (parsed.isValidName && parsed.extractedName) {
              const cleaned = parsed.extractedName.charAt(0).toUpperCase() + parsed.extractedName.slice(1);
              return NextResponse.json({
                isNameSetup: true,
                isValidName: true,
                extractedName: cleaned,
                reply: parsed.reply || `It's so wonderful to meet you, ${cleaned}! How can I support you today?`
              });
            }
          }
        }
      } catch (err) {
        console.warn('Gemini name validation fallback:', err);
      }

      if (finalExtractedName) {
        return NextResponse.json({
          isNameSetup: true,
          isValidName: true,
          extractedName: finalExtractedName,
          reply: `It's so wonderful to meet you, ${finalExtractedName}! I'm Sprout, your Growth Guardian superhero. How can I help or support you today?`
        });
      } else {
        return NextResponse.json({
          isNameSetup: true,
          isValidName: false,
          reply: `I want to make sure I greet you properly! What is your name?`
        });
      }
    }

    // Automatic Profile Field Extraction from Message
    let extractedAge = null;
    const ageRegex = /(?:i am|i'm|my age is|age is|age)\s*([0-9]{1,2})\b|\b([0-9]{1,2})\s*(?:years old|yrs old|years)\b/i;
    const ageMatch = message.match(ageRegex);
    if (ageMatch) {
      const rawVal = parseInt(ageMatch[1] || ageMatch[2], 10);
      if (rawVal >= 5 && rawVal <= 120) {
        extractedAge = rawVal.toString();
      }
    }

    let extractedLocation = null;
    const locRegex = /(?:i live in|i am from|my home is in|located in|from)\s+([A-Za-z\s,]{2,30})/i;
    const locMatch = message.match(locRegex);
    if (locMatch && locMatch[1]) {
      extractedLocation = locMatch[1].trim();
    }

    let extractedEmail = null;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const emailMatch = message.match(emailRegex);
    if (emailMatch) {
      extractedEmail = emailMatch[0];
    }

    // Normal Conversation Prompts based on Mode
    const activeAge = visitorAge || extractedAge;
    const userContext = [];
    if (visitorName) userContext.push(`Visitor Name: ${visitorName}`);
    if (activeAge) userContext.push(`Age: ${activeAge}`);
    if (visitorLocation || extractedLocation) userContext.push(`Location: ${visitorLocation || extractedLocation}`);

    let modeDescription = "";
    if (mode === 'help') {
      modeDescription = `MODE: ACTION HELP & GUIDANCE. Focus on clear, empowered, step-by-step superhero solutions, actionable advice, practical guidance, and strong superhero support to solve their problem.`;
    } else {
      modeDescription = `MODE: CASUAL TALK. Focus on lighthearted, friendly superhero conversation, chatting about Asterra city lore, daily life, hobbies, and superhero companionship.`;
    }

    const systemPrompt = `You are Sprout, an empathetic, caring superhero Growth Guardian from the magical city of Asterra.
Your mission is to help visitors grow, navigate personal struggles, feel truly heard, and find hope.
${modeDescription}

Visitor Context: ${userContext.length > 0 ? userContext.join(', ') : 'No name/profile provided yet'}

CRITICAL MEMORY & GLOBAL STATE RULES:
1. Speak directly to the visitor in a personal, authentic superhero tone with memory continuity.
2. Address the visitor by Visitor Name ONLY if explicitly provided in Visitor Context. NEVER invent, guess, or make up any name.
3. DO NOT ask the user for their Age, Name, Location, or Email if it is ALREADY PROVIDED in Visitor Context! Use known details naturally and conversationally (e.g. "Since you are ${activeAge || 'growing'}...").
4. Adapt your tone strictly to the selected mode (${mode.toUpperCase()}).
5. Keep your response concise (2-4 sentences max), clear, and easy to read.
6. Do NOT include emoji symbols in your text output.
7. If the visitor is expressing a worry or issue, summarize their core concern in 1 short line under "ANALYZED_ISSUE: [short summary]".`;

    if (!apiKey) {
      const nameClause = visitorName ? `, ${visitorName}` : '';
      let fallbackReply = `I hear you deeply${nameClause}. Every seed goes through dark soil before reaching the sunlight. You don't have to carry the whole world today.`;

      if (mode === 'casual') {
        fallbackReply = `That's wonderful to talk about${nameClause}! In Asterra, we always share stories like this under the great heartwood tree.`;
      } else if (mode === 'help') {
        fallbackReply = `Here is what we can do together${nameClause}: First, take one deep breath. Second, focus on one small action you can take right now. I'm right here with you!`;
      }

      return NextResponse.json({
        reply: fallbackReply,
        analyzedIssue: "Visitor seeking guidance & listening care.",
        extractedAge,
        extractedLocation,
        extractedEmail
      });
    }

    const contents = [];

    if (Array.isArray(history) && history.length > 0) {
      history.slice(-8).forEach((msg) => {
        if (msg.text) {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nVisitor Message: "${message}"` }]
    });

    const models = ['gemini-1.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.6-flash'];
    let aiRawText = null;

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: mode === 'help' ? 0.4 : 0.8,
              maxOutputTokens: 1000,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiRawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiRawText) break;
        } else {
          const errText = await response.text();
          console.warn(`Gemini model ${model} failed:`, errText);
        }
      } catch (e) {
        console.warn(`Error connecting to Gemini model ${model}:`, e);
      }
    }

    if (aiRawText) {
      let replyText = aiRawText;
      let analyzedIssue = null;

      if (aiRawText.includes('ANALYZED_ISSUE:')) {
        const parts = aiRawText.split('ANALYZED_ISSUE:');
        replyText = parts[0].trim();
        analyzedIssue = parts[1]?.trim();
      }

      return NextResponse.json({
        reply: replyText,
        analyzedIssue: analyzedIssue || "Personal concern shared by visitor.",
        extractedAge,
        extractedLocation,
        extractedEmail
      });
    } else {
      const nameClause = visitorName ? `, ${visitorName}` : '';
      return NextResponse.json({
        reply: `I'm right here with you${nameClause}. Whatever you're facing, you have the strength to grow through it.`,
        analyzedIssue: "Visitor seeking personal support and superhero guidance.",
        extractedAge,
        extractedLocation,
        extractedEmail
      });
    }

  } catch (error) {
    console.error('Error in /api/chat Gemini endpoint:', error);
    return NextResponse.json({
      reply: "Take a gentle breath. I'm right here listening with care.",
      analyzedIssue: "General inquiry"
    });
  }
}


