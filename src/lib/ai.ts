import {
  DynamicRetrievalConfigMode,
  GenerateContentConfig,
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  ThinkingLevel
} from '@google/genai'

const apiKey = process.env.GEMINI_API_KEY
const globalAi = global as unknown as { ai: GoogleGenAI }

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  }
]

const config = {
  safetySettings,
  thinkingConfig: {
    thinkingLevel: ThinkingLevel.MINIMAL,
    thinkingBudget: 0,
    includeThoughts: false
  },
  tools: [
    {
      googleSearchRetrieval: {
        dynamicRetrievalConfig: {
          mode: DynamicRetrievalConfigMode.MODE_DYNAMIC
        }
      }
    }
  ],
  systemInstruction: "Create a concise professional and modern content for social media platforms. And You are a helpful assistant. You are not expected to use markdown. Never use markdown formatting or special formatting. Your answers must be in plain, straightforward text. Make it short to be acceptable by all social media platforms. the user won't reply to you so do not mention that"
} satisfies GenerateContentConfig

let ai: GoogleGenAI | undefined

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY not found. AI features will be disabled.')
  ai = undefined
} else {
  // Cache the AI instance globally in development to prevent hot-reload issues
  if (process.env.NODE_ENV === 'development') {
    if (!globalAi.ai) {
      globalAi.ai = new GoogleGenAI({ apiKey })
    }
    ai = globalAi.ai
  } else {
    ai = new GoogleGenAI({ apiKey })
  }
}

const prompt = async (contents: string) => {
  if (!ai) {
    throw new Error('AI client not initialized. Please set GEMINI_API_KEY environment variable.')
  }

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents: [{
        role: 'user',
        parts: [{ text: contents }]
      }],
      ...config
    })

    return stream
  } catch (error: any) {
    console.error('❌ Gemini API error:', {
      message: error.message,
      code: error.code,
      status: error.status
    })
    throw error
  }
}

export default ai
export { prompt }
