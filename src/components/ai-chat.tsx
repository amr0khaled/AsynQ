'use client'
import { useEffect, useRef, useState } from "react"
import AiResponseTextarea from "./ai-response-text-area"
import { useChat } from "@/hooks/use-chat"
import { useDebounce } from "@/hooks/use-debounce"
import api from "@/lib/axios.client"
import { toast } from "sonner"
import { Righteous } from "next/font/google"
import AiPromptInput from "./ai-prompt-input"

const righteous = Righteous({
  weight: ['400'],
  preload: true
})

export default function AiChat() {
  const { post, newPost } = useChat()
  const [prompt, setPrompt] = useState(post?.prompt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const didStreamFinished = useRef(false)
  useEffect(() => {
    if (!isStreaming && didStreamFinished.current && content.trim().length > 0) {
      newPost({
        prompt,
        content
      })
      //console.debug("NEWWWW")
      didStreamFinished.current = false
    }
  }, [isStreaming, content, prompt, newPost])
  const streamGemini = async () => {
    if (!prompt.trim()) return
    didStreamFinished.current = false

    setIsStreaming(true)
    setContent('')
    setError('')

    try {
      const res = await api.post('/api/ai', {
        content: prompt,
      }, {
        adapter: 'fetch',
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.headers.getContentType === 'application/json' && !res.data.success) toast.error(`${res.data.code}: ${res.data.message}`)

      const reader = (res.data as ReadableStream | null)?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))

            if (data.error) {
              setError(data.error)
            } else if (data.text) {
              setContent(prev => prev + data.text)
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Streaming error:', err)
      setError(err.message || 'An error occurred')
      toast.error(error)
    } finally {
      didStreamFinished.current = true
      setIsStreaming(false)
    }
  }
  return <div className="w-full md:max-w-4xl md:min-w-xl mx-auto py-4 px-4 md:px-0 md:py-2">
    <div className='mx-auto max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col gap-y-4 md:gap-y-2 justify-start mb-5 md:mb-10'>
      <h1 className={`text-2xl  ${righteous.className}`}>Content Generation AI Tool</h1>

      <div className="flex gap-2">
        <AiPromptInput
          prompt={prompt}
          isStreaming={isStreaming}
          setPrompt={setPrompt}
          streamGemini={streamGemini}
        />
      </div>

    </div>

    {content && <AiResponseTextarea
      isStreaming={isStreaming}
      content={content}
      setContent={setContent}
    />}
  </div>
}
