// OpenAI client configuration
import OpenAI from 'openai'

// Initialize OpenAI client
export const openaiClient = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false // Only for server-side usage
    })
  : null

// Helper function to check if OpenAI is configured
export function isOpenAIConfigured() {
  return !!process.env.OPENAI_API_KEY
}

// Helper function to create completion
export async function createCompletion(prompt: string, options?: {
  model?: string
  maxTokens?: number
  temperature?: number
}) {
  if (!openaiClient) {
    throw new Error('OpenAI client not configured')
  }
  
  const response = await openaiClient.chat.completions.create({
    model: options?.model || 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options?.maxTokens || 2000,
    temperature: options?.temperature || 0.7,
  })
  
  return response.choices[0]?.message?.content || ''
}

// Export for usage in API routes
export { openaiClient as openai }
