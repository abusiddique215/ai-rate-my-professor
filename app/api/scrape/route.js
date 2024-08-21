import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Here you would implement the actual scraping logic
    // For now, we'll just use mock data
    const mockData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'mockProfessorData.json'), 'utf8'));
    const professor = mockData[0];

    const embedding = await createEmbedding(`Professor: ${professor.name}\nDepartment: ${professor.department}\nOverall Rating: ${professor.overallRating}`);
    await storeProfessorData(professor.name, professor.department, professor.overallRating, professor.reviews, embedding);

    return NextResponse.json({ message: "Professor data processed and stored successfully" });
  } catch (error) {
    console.error('Error processing professor data:', error);
    return NextResponse.json({ error: 'Failed to process professor data' }, { status: 500 });
  }
}

async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function storeProfessorData(name, department, rating, reviews, embedding) {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  
  await index.upsert({
    vectors: [{
      id: name.replace(/\s+/g, '-').toLowerCase(),
      values: embedding,
      metadata: {
        name,
        department,
        rating,
        reviews: JSON.stringify(reviews)
      }
    }]
  });
}