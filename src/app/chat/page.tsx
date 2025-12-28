'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export default function Page() {
  const [content, setContent] = useState('')
  const [response, setResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')

  const streamGemini = async () => {
    if (!content.trim()) return

    setIsStreaming(true)
    setResponse('')
    setError('')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))

            if (data.error) {
              setError(data.error)
            } else if (data.text) {
              setResponse(prev => prev + data.text)
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Streaming error:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gemini AI Chat</h1>

      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ask Gemini anything..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              streamGemini()
            }
          }}
          disabled={isStreaming}
          className="flex-1"
        />
        <Button
          onClick={streamGemini}
          disabled={isStreaming || !content.trim()}
        >
          {isStreaming ? <Spinner /> : 'Send'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="whitespace-pre-wrap">{response}</div>
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-gray-800 animate-pulse ml-1" />
          )}
        </div>
      )}
    </div>
  )
}
