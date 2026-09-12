import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, visitorName, visitorAge, visitorLocation, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const userContext = [];
    if (visitorName) userContext.push(`Visitor Name: ${visitorName}`);
    if (visitorAge) userContext.push(`Age: ${visitorAge}`);
    if (visitorLocation) userContext.push(`Location: ${visitorLocation}`);

    const systemPrompt = `You are Sprout, an empathetic, caring, superhero Growth Guardian from the magical city of Asterra.
Your mission is to help visitors grow, navigate personal struggles, feel truly heard, and find hope.
You speak with gentle superhero warmth, compassion, and comforting wisdom. Use simple, heartwarming language and gentle nature metaphors (leaves, seeds, light, roots, growing). Do NOT include emoji symbols in your responses.

Visitor Context: ${userContext.length > 0 ? userContext.join(', ') : 'New friend'}

Guidelines:
1. Speak directly to the visitor in a personal, empathetic superhero tone with memory continuity.
2. Analyze what they are feeling or going through (e.g. stress, loneliness, self-doubt, confusion, relationship or life worries).
3. Keep your response concise (2-4 sentences max), easy to read, and supportive.
4. Do NOT use emoji symbols in your reply text.
5. If the visitor is expressing a personal worry or struggle, also summarize their core concern in 1 short line under "ANALYZED_ISSUE: [short summary]".`;

    if (!apiKey) {
      const nameStr = visitorName || 'my friend';
      let fallbackReply = `I hear you deeply, ${nameStr}. Every seed goes through dark soil before reaching the sunlight. You don't have to carry the whole world today.`;

      if (message.toLowerCase().includes('asterra')) {
        fallbackReply = `Asterra is our home of green towers and open waterfalls, ${nameStr}. Kindness is what keeps it alive and growing.`;
      } else if (message.toLowerCase().includes('power') || message.toLowerCase().includes('hero')) {
        fallbackReply = `My superhero power is listening to what words leave unsaid, ${nameStr} — and helping people find the light inside themselves.`;
      }

      return NextResponse.json({
        reply: fallbackReply,
        analyzedIssue: "Visitor seeking guidance & listening care."
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

    const models = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.6-flash', 'gemini-pro-latest'];
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
              temperature: 0.7,
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
          console.warn(`Gemini model ${model} request failed:`, errText);
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
        analyzedIssue: analyzedIssue || "Personal concern shared by visitor."
      });
    } else {
      const nameStr = visitorName || 'friend';
      return NextResponse.json({
        reply: `I'm right here with you, ${nameStr}. Whatever you're facing, you have the strength to grow through it. 🌱`,
        analyzedIssue: "Visitor seeking personal support and superhero guidance."
      });
    }

  } catch (error) {
    console.error('Error in /api/chat Gemini endpoint:', error);
    return NextResponse.json({
      reply: "Take a gentle breath, my friend. I'm right here listening with care. 🌱",
      analyzedIssue: "General inquiry"
    });
  }
}
