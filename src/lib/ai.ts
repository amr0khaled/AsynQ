import { DynamicRetrievalConfigMode, FeatureSelectionPreference, GenerateContentConfig, GoogleGenAI, HarmBlockThreshold, HarmCategory, ThinkingLevel } from '@google/genai'

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
  modelSelectionConfig: {
    featureSelectionPreference: FeatureSelectionPreference.PRIORITIZE_COST
  },
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
  systemInstruction: "Create a concise professional and modern content for social media platforms"
} satisfies GenerateContentConfig
let ai
let model
if (apiKey === undefined) {
  ai = undefined
  model = undefined
} else {
  ai = globalAi.ai || new GoogleGenAI({
    apiKey,
    project: 'gen-lang-client-0135610369',
  })
}


const prompt = async (contents: string) => {
  if (!ai) {
    return false
  }
  return await ai.models.generateContentStream({
    model: 'gemini-2.0-flash-001',
    contents,
    config
  })
}

export default ai
export {
  prompt
}

