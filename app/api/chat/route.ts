import { NextResponse } from 'next/server';
import { generateChatResponse, generateEmbedding } from '../../lib/openai';
import { queryProfessors } from '../../lib/professorData';

export async function POST(request: Request) {
  console.log('Chat API called');
  
  try {
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));

    let userMessage: string;
    if (typeof body.message === 'string') {
      userMessage = body.message;
    } else if (Array.isArray(body.messages) && body.messages.length > 0) {
      userMessage = body.messages[body.messages.length - 1].content;
    } else {
      console.error('Invalid request format');
      return NextResponse.json({ error: 'Invalid request format. Expected "message" string or "messages" array.' }, { status: 400 });
    }

    console.log('User message:', userMessage);

    console.log('Querying professors...');
    const relevantProfessors = await queryProfessors(userMessage);
    console.log('Relevant professors:', JSON.stringify(relevantProfessors, null, 2));

    const context = relevantProfessors.map((prof: any) => 
      `${prof.name} is a professor in the ${prof.department} department. ${prof.bio}`
    ).join('\n\n');
    console.log('Generated context:', context);

    const aiMessages = [
      { role: "system", content: "You are a helpful assistant that provides information about professors based on the given context. Only use the information provided in the context to answer questions." },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${userMessage}` }
    ];

    console.log('Sending messages to OpenAI');
    const aiResponse = await generateChatResponse(aiMessages);
    console.log('AI response received:', aiResponse);

    const responseMessages = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    ];

    console.log('Sending response:', JSON.stringify(responseMessages, null, 2));

    return NextResponse.json({ messages: responseMessages });

  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ 
      error: 'An error occurred', 
      details: error.message, 
      stack: error.stack,
      name: error.name
    }, { status: 500 });
  }
}