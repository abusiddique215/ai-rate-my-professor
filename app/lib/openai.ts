import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string) {
  try {
    console.log('Generating embedding for:', text);
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    console.log('Embedding generated successfully');
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function generateChatResponse(messages: any[]) {
  try {
    console.log('Generating chat response for messages:', messages);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    console.log('Chat response generated successfully');
    if (!completion.choices[0].message.content) {
      throw new Error('No content in OpenAI response');
    }
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}