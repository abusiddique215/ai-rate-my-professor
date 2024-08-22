import { NextResponse } from 'next/server';
import { PineconeClient } from '@pinecone-database/pinecone';
import { Configuration, OpenAIApi } from 'openai';

const pinecone = new PineconeClient();
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

export async function POST(req: Request) {
  const { message } = await req.json();

  // Implement RAG logic
  // 1. Create embedding for user query
  const userQueryEmbedding = await pinecone.createEmbedding(message);

  // 2. Search Pinecone for relevant professor reviews
  const searchResults = await pinecone.query(userQueryEmbedding, {
    filter: {
      match: {
        type: 'professor_review',
      },
    },
    includeMetadata: true,
  });

  // 3. Combine retrieved information with user query
  const combinedInfo = searchResults.map((result) => ({
    ...result.metadata,
    review: result.data,
  }));

  // 4. Generate response using OpenAI
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Provide a response based on the user\'s query and the retrieved professor review information.',
      },
      {
        role: 'user',
        content: message,
      },
      ...combinedInfo.map((info) => ({
        role: 'system',
        content: `Professor: ${info.name}\nRating: ${info.rating}\nReview: ${info.review}`,
      })),
    ],
  });

  return NextResponse.json({ role: 'assistant', content: aiResponse.choices[0].message.content });
}