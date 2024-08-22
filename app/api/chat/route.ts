import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimit } from '@/lib/rate-limit';
import { generateAIResponse, generateEmbedding } from '@/lib/openai';
import { getPineconeClient } from '@/lib/pinecone';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = await rateLimit.limit(session.user.email!);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { messages } = await request.json();

    // Generate embedding for the latest user message
    const latestUserMessage = messages[messages.length - 1].content;
    console.log('Generating embedding for:', latestUserMessage);
    const embedding = await generateEmbedding(latestUserMessage);

    // Store the embedding in Pinecone
    console.log('Storing embedding in Pinecone');
    const pinecone = await getPineconeClient();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    
    await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: `${session.user.id}-${Date.now()}`,
            values: embedding,
            metadata: {
              userId: session.user.id,
              message: latestUserMessage,
            },
          },
        ],
      },
    });

    // Generate AI response
    console.log('Generating AI response');
    const aiMessage = await generateAIResponse(messages);

    // Save the conversation to the database
    console.log('Saving conversation to database');
    await prisma.conversation.create({
      data: {
        userId: session.user.id,
        messages: {
          create: [
            ...messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: aiMessage.role,
              content: aiMessage.content,
            },
          ],
        },
      },
    });

    return NextResponse.json(aiMessage);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.', details: error.message }, { status: 500 });
  }
}