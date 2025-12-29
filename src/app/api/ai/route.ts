import { prompt } from "@/lib/ai"
import { checkRateLimit, getRateLimitInfo } from "@/lib/rate-limiter"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { content } = await req.json()

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        {
          errors: [
            {
              field: "content",
              message: "Content is required and must be a non-empty string"
            }
          ]
        },
        { status: 400 }
      )
    }

    // Get user identifier (use IP or session ID)
    const identifier = req.headers.get('x-forwarded-for') || 'anonymous'

    // Check rate limit: 10 requests per minute
    if (!checkRateLimit(identifier, 10, 60000)) {
      const { resetIn } = getRateLimitInfo(identifier)
      return NextResponse.json(
        {
          errors: [
            {
              message: `Rate limit exceeded. Please wait ${Math.ceil(resetIn / 1000)} seconds.`
            }
          ]
        },
        { status: 429 }
      )
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResponse = await prompt(content)

          if (!streamResponse) {
            throw new Error("Failed to initialize AI stream")
          }

          for await (const chunk of streamResponse) {
            const text = chunk.text || ''
            if (text) {
              const data = `data: ${JSON.stringify({ text })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
          controller.close()
        } catch (e: any) {
          console.error('❌ Gemini streaming error:', {
            message: e.message,
            code: e.code,
            status: e.status,
            timestamp: new Date().toISOString()
          })

          // Handle 429 specifically
          if (e.code === 429 || e.status === 'RESOURCE_EXHAUSTED') {
            const errorData = `data: ${JSON.stringify({
              error: 'API rate limit exceeded. Using a slower model. Please wait 15 seconds.',
              code: 'RATE_LIMIT_EXCEEDED'
            })}\n\n`
            controller.enqueue(encoder.encode(errorData))
          } else {
            const errorData = `data: ${JSON.stringify({
              error: e.message || 'Stream generation failed',
              code: e.code || 'UNKNOWN_ERROR'
            })}\n\n`
            controller.enqueue(encoder.encode(errorData))
          }

          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('❌ API route error:', error)
    return NextResponse.json(
      {
        errors: [
          {
            message: error.message || 'Internal server error'
          }
        ]
      },
      { status: 500 }
    )
  }
}
