import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
});

export async function GET() {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    
    // This is a simplified example. In a real-world scenario, you'd need to implement
    // more sophisticated querying and data processing logic here.
    const queryResponse = await index.query({
      topK: 1000,
      includeMetadata: true,
    });

    const trendData = processTrendData(queryResponse.matches);

    return NextResponse.json(trendData);
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function processTrendData(matches) {
  // This is a simplified example. You'd need to implement more sophisticated
  // data processing logic based on your specific data structure and requirements.
  const trendMap = new Map();

  matches.forEach(match => {
    const reviews = JSON.parse(match.metadata.reviews);
    reviews.forEach(review => {
      const date = new Date(review.date).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!trendMap.has(date)) {
        trendMap.set(date, { positive: 0, neutral: 0, negative: 0 });
      }
      trendMap.get(date)[review.sentiment]++;
    });
  });

  return Array.from(trendMap, ([date, sentiments]) => ({
    date,
    ...sentiments
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
}