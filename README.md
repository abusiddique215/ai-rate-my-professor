# AI Rate My Professor Assistant

This project is a Next.js application that uses AI to assist students in finding and evaluating professors based on reviews and preferences.

## Features

- Chat interface for asking questions about professors
- Professor recommendation system based on student preferences
- Sentiment analysis of professor reviews
- Trend visualization of professor ratings over time
- Web scraping functionality to gather professor data (currently using mock data)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm or yarn
- Pinecone account
- OpenAI API key

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai-rate-my-professor.git
   cd ai-rate-my-professor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=your_pinecone_index_name
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up Pinecone:
   - Create a new project in the Pinecone dashboard
   - Create a new index with the following settings:
     - Dimensions: 1536 (for OpenAI's text-embedding-3-small model)
     - Metric: Cosine
     - Pod Type: Choose based on your needs (e.g., s1.x1 for starter projects)

## Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project can be easily deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up or log in.
3. Click "New Project" and select your GitHub repository.
4. Configure your environment variables in the Vercel dashboard.
5. Deploy the project.

For more details on deployment, check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.