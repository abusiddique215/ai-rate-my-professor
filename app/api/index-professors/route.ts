import { NextResponse } from 'next/server';
import { loadAndIndexProfessors } from '../../lib/professorData';

export async function POST() {
  try {
    console.log('Starting professor indexing process');
    await loadAndIndexProfessors();
    console.log('Professor indexing process completed');
    return NextResponse.json({ message: 'Professors indexed successfully' });
  } catch (error: any) {
    console.error('Error in /api/index-professors:', error);
    return NextResponse.json({ 
      error: 'An error occurred while indexing professors', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}