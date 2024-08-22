import { Pinecone } from '@pinecone-database/pinecone';

let pineconeIndex: any = null;

export async function getPineconeIndex() {
  if (!pineconeIndex) {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });
    pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME!);
  }
  return pineconeIndex;
}