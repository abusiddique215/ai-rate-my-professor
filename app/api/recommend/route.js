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
    
    if (!preferences || preferences.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide more detailed preferences (at least 10 characters).' }, { status: 400 });
    }

    const embedding = await createEmbedding(preferences);
    const recommendations = await searchPinecone(embedding);
    
    if (recommendations.length === 0) {
      return NextResponse.json({ error: 'No matching professors found. Please try different preferences.' }, { status: 404 });
    }
    
    const response = await generateRecommendationResponse(recommendations, preferences);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Error processing recommendation request:', error);
    if (error instanceof Pinecone.PineconeError) {
      console.error('Pinecone Error:', error);
      return NextResponse.json({ error: 'Error querying professor database. Please try again later.' }, { status: 500 });
    } else if (error instanceof OpenAI.OpenAIError) {
      console.error('OpenAI Error:', error);
      return NextResponse.json({ error: 'Error generating AI response. Please try again later.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
  }
}

async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

async function searchPinecone(embedding) {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    
    const queryResponse = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    return queryResponse.matches.map(match => ({
      ...match.metadata,
      score: match.score,
    }));
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    throw error;
  }
}

async function generateRecommendationResponse(recommendations, preferences) {
  try {
    const recommendationText = recommendations.map(r => 
      `${r.name} (${r.department}): Overall Rating ${r.rating}, Similarity Score: ${r.score.toFixed(2)}`
    ).join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides professor recommendations based on student preferences. Provide a concise summary of each recommended professor, highlighting how they match the student's preferences. Include the similarity score in your explanation, where a higher score indicates a better match." },
        { role: "user", content: `Based on the user's preferences: "${preferences}", here are some recommended professors:\n\n${recommendationText}\n\nPlease summarize these recommendations, explain why they might be good choices, and suggest which professor might be the best fit.` },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating recommendation response:', error);
    throw error;
  }
}