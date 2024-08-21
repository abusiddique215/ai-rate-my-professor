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
    const { message, filters } = await req.json();

    // 1. Create embedding for user query
    const embedding = await createEmbedding(message);

    // 2. Search Pinecone for relevant information
    const context = await searchPinecone(embedding, filters);

    // 3. Generate response using OpenAI
    const response = await generateResponse(message, context);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Error processing request:', error);
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

async function searchPinecone(embedding, filters = {}) {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  
  const queryResponse = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
    filter: buildPineconeFilter(filters)
  });

  return queryResponse.matches.map(match => match.metadata);
}

function buildPineconeFilter(filters) {
  const filterConditions = [];

  if (filters.department) {
    filterConditions.push({ department: { $eq: filters.department } });
  }

  if (filters.minRating) {
    filterConditions.push({ rating: { $gte: parseFloat(filters.minRating) } });
  }

  return filterConditions.length > 0 ? { $and: filterConditions } : {};
}

async function generateResponse(message, context) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that provides information about professors based on student reviews. Use the provided context to answer questions, but don't mention the context explicitly in your response. If you're unsure about something, say so rather than making up information." },
      { role: "user", content: `Context: ${context}\n\nUser question: ${message}` },
    ],
  });
  return completion.choices[0].message.content;
}

export async function POST_scrape(req) {
  const { url } = await req.json();
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract professor information and reviews
    const professorName = $('.NameTitle__Name-dowf0z-0').text().trim();
    const department = $('.NameTitle__Title-dowf0z-1').text().trim();
    const overallRating = $('.RatingValue__Numerator-qw8sqy-2').text().trim();
    
    const reviews = $('.Rating__RatingBody-sc-1rhvpxz-0').map((_, el) => {
      const $el = $(el);
      return {
        rating: $el.find('.Rating__RatingNumber-sc-1rhvpxz-1').text().trim(),
        comment: $el.find('.Comments__StyledComments-dzzyvm-0').text().trim(),
        date: $el.find('.TimeStamp__StyledTimeStamp-sc-9q2r30-0').text().trim()
      };
    }).get();

    // Create embedding for professor data
    const professorData = `Professor: ${professorName}\nDepartment: ${department}\nOverall Rating: ${overallRating}\nReviews: ${reviews.map(r => `${r.rating}: ${r.comment}`).join(' | ')}`;
    const embedding = await createEmbedding(professorData);

    // Store the scraped data in Pinecone
    await storeProfessorData(professorName, department, overallRating, reviews, embedding);

    return NextResponse.json({ message: "Data scraped and stored successfully" });
  } catch (error) {
    console.error('Error scraping data:', error);
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
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