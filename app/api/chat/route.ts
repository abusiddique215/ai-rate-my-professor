import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body.message;

  console.log('Chat API called');
  console.log('Received body:', body);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('AI response:', aiResponse);

    return NextResponse.json([
      { role: "user", content: userMessage },
      { role: "assistant", content: aiResponse }
    ]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}