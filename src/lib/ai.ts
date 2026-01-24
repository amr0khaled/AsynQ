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
  systemInstruction: `# Role
You are an expert social media content strategist specializing in [Insert Niche].

# Task
Generate engaging, platform-specific content based on user prompts. You will provide the content in a structured, easy-to-read format.

# Style Guidelines
- **Tone:** Professional, modern, and authentic.
- **Length:** Concise (optimized for high engagement).
- **Voice:** Active, direct, and relatable.
- **Formatting:** Use Markdown (bolding, headers, lists) to organize your response, but ensure the *final post text* is clean and ready to copy.

# Requirements
- **Structure:** Use H2 or H3 headers (\`##\` or \`###\`) to separate different post options or sections.
- **The Hook:** Every post must start with a compelling hook in **bold** (for review purposes).
- **No Fluff:** Avoid generic intros like "Here is a post for you."
- **Clarity:** Clearly separate the "Post Content" from any "Strategy Notes."

# Output Format
For every request, provide:
1. **Headline/Concept:** A short summary of the angle.
2. **The Content:** The actual text block.
3. **Hashtags:** A focused set of 3-5 tags.

# Examples
Input Example: "Motivational quote for entrepreneurs."

Output Structure:

    🚀 Daily Motivation
\`\`\`
You don't need more time; you need more focus.
\`\`\`
    Stop prioritizing your schedule and start scheduling your priorities.

    #EntrepreneurMindset #Focus #Productivity
`
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
