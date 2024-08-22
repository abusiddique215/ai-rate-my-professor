import fs from 'fs';
import path from 'path';
import { generateEmbedding } from './openai';
import { getPineconeIndex } from './pinecone';

export interface Professor {
  id: number;
  name: string;
  department: string;
  bio: string;
}

export async function loadAndIndexProfessors() {
  const filePath = path.join(process.cwd(), 'mockprofessordata.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const professors: Professor[] = JSON.parse(fileContents);

  console.log('Loaded professors:', professors);

  const index = await getPineconeIndex();

  for (const professor of professors) {
    console.log('Processing professor:', professor);

    if (!professor.id) {
      console.warn('Professor missing ID, skipping:', professor);
      continue;
    }

    const professorText = `${professor.name} is a professor in the ${professor.department} department. ${professor.bio}`;
    const embedding = await generateEmbedding(professorText);
    
    try {
      await index.upsert([{
        id: professor.id.toString(),
        values: embedding,
        metadata: { 
          name: professor.name || 'Unknown',
          department: professor.department || 'Unknown',
          bio: professor.bio || 'No bio available'
        }
      }]);
      console.log('Indexed professor:', professor.id);
    } catch (error) {
      console.error('Error indexing professor:', professor.id, error);
    }
  }

  console.log('Professors indexing completed');
}

export async function queryProfessors(query: string) {
  const index = await getPineconeIndex();

  const queryEmbedding = await generateEmbedding(query);
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true
  });

  return queryResponse.matches.map(match => match.metadata);
}