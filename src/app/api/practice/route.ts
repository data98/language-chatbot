import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Session } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
    }

    const { session, userAnswer }: { session: Session; userAnswer?: string } = await request.json();

    if (!session) {
      return NextResponse.json({ error: 'Session data required' }, { status: 400 });
    }

    const { nativeLanguage, targetLanguage, difficulty, scenario, currentPrompt } = session;

    const systemPrompt = `
      You are a language tutor helping a student practice ${targetLanguage} (native: ${nativeLanguage}).
      Difficulty Level: ${difficulty}.
      Scenario: ${scenario}.

      Your goal is to provide immediate feedback on the user's answer and generate the next short practice prompt.
      Output must be valid JSON matching this schema:
      {
      "corrected": "string (the corrected version of the user's answer, or N/A if starting)",
      "explanation": "string (brief 1-3 sentences explaining errors or grammar)",
      "alternatives": ["string", "string"] (1-2 natural alternative phrasings),
      "next_prompt": "string (the next short question or task for the user)"
      }

      If this is the START of the session (no user answer provided), set "corrected", "explanation", and "alternatives" to null or empty strings, and provide only the first "next_prompt".
          `;

    const userMessage = userAnswer
      ? `Current Prompt: "${currentPrompt}"\nMy Answer: "${userAnswer}"\nPlease correct me and give the next prompt.`
      : `Start the session. Generate the first prompt based on the scenario: "${scenario}".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content from OpenAI');
    }

    const data = JSON.parse(content);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
