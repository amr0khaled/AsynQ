'use client'
<<<<<<< Updated upstream
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import z from 'zod'
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form'
import { Edit3 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { Righteous } from 'next/font/google'
import { useDebounce } from '@/hooks/use-debounce'
import ReactMarkDown from 'react-markdown'
import remarkGFM from 'remark-gfm'
import api from '@/lib/axios.client'
import { toast } from 'sonner'
import '@/styles/pages/ai.css'
import { useChat } from '@/hooks/use-chat'
import { updatePostServerSchema } from '@/lib/input-schemas'

const righteous = Righteous({
  weight: ['400'],
  preload: true
})

const contentSchema = z.object({
  content: z.string()
    .min(1)
})

export default function Page() {
  const { post, isPending, newPost, updatePost } = useChat()
  const [prompt, setPrompt] = useState(post?.prompt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const { control, handleSubmit } = useForm<z.infer<typeof updatePostServerSchema>>({
    resolver: zodResolver(updatePostServerSchema),
    defaultValues: {
      content
    }
  })
  const debouncedPrompt = useDebounce(prompt, 700)

  const streamGemini = async () => {
    if (!debouncedPrompt.trim()) return

    setIsStreaming(true)
    setContent('')
    setError('')

    try {
      const res = await api.post('/api/ai', {
        content: debouncedPrompt,
      }, {
        adapter: 'fetch',
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const reader = res.data?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No reader available')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          newPost({
            prompt,
            content
          })
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
      setIsStreaming(false)
    }
  }

  const onError: SubmitErrorHandler<z.infer<typeof updatePostServerSchema>> = (errors) => {
    let message = ""
    for (const error of Object.keys(errors)) {
      if (Object.hasOwn(errors, error)) {
        message += `${(errors as any)[error].message}\n`
      }
    }
    toast.error('Form has Validation Errors. ' + message);
  }

  return (
    <div className="max-w-6xl min-w-3xl mx-auto p-6 space-y-4">
      <div className='mx-auto max-w-2xl flex flex-col gap-y-2 justify-start mb-10'>
        <h1 className={`text-2xl  ${righteous.className}`}>Content Generation AI Tool</h1>

        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What caption do you need?"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                streamGemini()
              }
            }}
            disabled={isStreaming}
            className="min-w-lg max-w-xl"
          />
        </div>

      </div>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 dark:text-red-200 text-red-600 rounded-lg">
          Error: {error}
        </div>
      )}

      {content && (
        !editMode ?
          <div className='flex flex-col items-center'>
            <div className="p-4 text-white/85 bg-gray-50 dark:bg-transparent border rounded-lg max-w-10/12">
              <div className="whitespace-pre-wrap text-wrap markdown">
                <ReactMarkDown remarkPlugins={[remarkGFM]} >
                  {content}
                </ReactMarkDown>
              </div>
              {isStreaming && <span className="inline-block w-2 h-5 bg-gray-800 animate-pulse ml-1" />}
            </div>
            <div className='w-full flex justify-end items-center'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'ghost'}
                    size='icon-sm'
                    onClick={() => setEditMode(true)}
                  >
                    <Edit3 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          : <Card className='min-w-96 w-full border-transparent pt-0'>
            <CardContent>
              <form
                onSubmit={handleSubmit(updatePost, onError)}
                id='edit-post-form'>
                <FieldGroup>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field, fieldState }) => <Field>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className='resize-none min-h-64'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                    }
                  />
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter>
              <FieldGroup className='flex flex-row items-center justify-end'>
                <Button
                  className='w-24'
                  variant={'outline'}
                  type='button'
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  className='w-24 shadow-sm'
                  variant='primary'
                  type='submit'
                  form='edit-post-form'
                >
                  Save
                </Button>
              </FieldGroup>
            </CardFooter>
          </Card>
      )}
    </div>
=======
import '@/styles/pages/ai.css'
import AiChat from '@/components/ai-chat'
import { useChat } from '@/hooks/use-chat'

export default function Page() {
  const { post } = useChat()
  return (
    <>
      <AiChat key={post?.id || 'new'} />
    </>
>>>>>>> Stashed changes
  )
}
