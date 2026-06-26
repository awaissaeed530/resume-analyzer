const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-5-pro';

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY is not set. Please set it in the .env file');
}

export const OPENAI_CONFIG = { API_KEY, MODEL };
