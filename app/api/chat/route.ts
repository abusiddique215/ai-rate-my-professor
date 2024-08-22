import { NextResponse } from 'next/server';
import { generateChatResponse } from '../../lib/openai';
import { queryProfessors } from '../../lib/professorData';

export async function POST(request: Request) {
  try {
    console.log('Chat API called');
    const { messages } = await request.json();
    console.log('Received messages:', messages);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid or empty messages array');
    }

    const lastUserMessage = messages[messages.length - 1].content;
    console.log('User message:', lastUserMessage);

    console.log('Querying professors...');
    const relevantProfessors = await queryProfessors(lastUserMessage);
    console.log('Relevant professors:', relevantProfessors);

    const context = relevantProfessors.map((prof: any) => 
      `${prof.name} is a professor in the ${prof.department} department. ${prof.bio}`
    ).join('\n\n');
    console.log('Generated context:', context);

    const aiMessages = [
      { role: "system", content: "You are a helpful assistant that provides information about professors based on the given context. Only use the information provided in the context to answer questions." },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${lastUserMessage}` }
    ];

    console.log('Sending messages to OpenAI:', aiMessages);

    const aiResponse = await generateChatResponse(aiMessages);
    console.log('AI response:', aiResponse);

    return NextResponse.json({ result: aiResponse });

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