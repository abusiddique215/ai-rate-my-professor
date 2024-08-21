import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
});

export async function POST(req) {
  try {
    const { preferences } = await req.json();
    validatePreferences(preferences);

    const embedding = await createEmbedding(preferences);
    const recommendations = await searchPinecone(embedding);
    const response = await generateRecommendationResponse(recommendations);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Error processing recommendation request:', error);
    if (error instanceof Pinecone.PineconeError) {
      return NextResponse.json({ error: 'Error querying Pinecone database' }, { status: 500 });
    } else if (error instanceof OpenAI.OpenAIError) {
      return NextResponse.json({ error: 'Error generating AI response' }, { status: 500 });
    } else if (error instanceof SyntaxError || error.message === 'Invalid preferences format') {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function searchPinecone(embedding) {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    
    const queryResponse = await index.query({
      vector: embedding,
      topK: 3,
      includeMetadata: true,
    });

    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      console.warn('No matches found in Pinecone');
      return [];
    }

    return queryResponse.matches.map(match => match.metadata);
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    throw new Pinecone.PineconeError('Failed to query Pinecone database');
  }
}

async function generateRecommendationResponse(recommendations) {
  const recommendationText = recommendations.map(r => 
    `${r.name} (${r.department}): Overall Rating ${r.rating}`
  ).join('\n');

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that provides professor recommendations based on student preferences." },
      { role: "user", content: `Based on the user's preferences, here are some recommended professors:\n\n${recommendationText}\n\nPlease summarize these recommendations and provide a brief explanation for why they might be good choices.` },
    ],
  });
  return completion.choices[0].message.content;
}

function validatePreferences(preferences) {
  if (typeof preferences !== 'string' || preferences.trim().length === 0) {
    throw new Error('Invalid preferences format');
  }
}