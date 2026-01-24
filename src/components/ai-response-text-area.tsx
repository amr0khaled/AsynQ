'use client'
import ReactMarkDown from 'react-markdown'
import remarkGFM from 'remark-gfm'
import { Button } from './ui/button'
import { Copy, Edit3 } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { FieldError, FieldGroup, Field } from './ui/field'
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form'
import { Textarea } from './ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePostServerSchema } from '@/lib/input-schemas'
import z from 'zod'
import { toast } from 'sonner'
import { updatePost } from '@/hooks/use-posts'
import sanitize from 'sanitize-html'
import { useChat } from '@/hooks/use-chat'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Spinner } from './ui/spinner'
import { Input } from './ui/input'
import { components } from '@/lib/syntax-highligher'


type Props = {
  isStreaming: boolean
  content?: string
  setContent: Dispatch<SetStateAction<string>>
}
export default function AiResponseTextarea({ isStreaming, content, setContent }: Props) {
  const { post } = useChat()
  const [isEditing, setEditMode] = useState(false)
  const { control, handleSubmit } = useForm<z.infer<typeof updatePostServerSchema>>({
    resolver: zodResolver(updatePostServerSchema),
    defaultValues: {
      content,
      id: post?.id
    }
  })
  const onError: SubmitErrorHandler<z.infer<typeof updatePostServerSchema>> = (errors) => {
    toast.error('Form has Validation Errors.', {
      description: <>
        {
          Object.keys(errors).map((error) => {
            if (Object.hasOwn(errors, error)) {
              return <span>{error}: {(errors as any)[error].message}</span>
            }
          })
        }
      </>
    });
  }
  if (isEditing) return <Card className='min-w-96 w-full border-transparent pt-0'>
    <CardContent>
      <form
        onSubmit={handleSubmit(({ content }) => {
          if (!post?.id) return
          toast.promise(updatePost({
            id: post.id,
            content: sanitize(content)
          }),
            {
              loading: <Spinner />,
              success: "Updated post successfully",
            }
          )
          setContent(content || '')
          setEditMode(false)
        }, onError)}
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
            </Field>
            }
          />
          <Controller
            name="id"
            control={control}
            render={({ field, fieldState }) => <Field>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className='hidden'
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
  </Card >
  return <div className='flex flex-col items-center'>
    <div className="p-4 text-white/85 bg-gray-50 dark:bg-transparent border rounded-lg max-w-10/12">
      <div className="text-wrap prose dark:prose-invert max-w-none">
        <ReactMarkDown remarkPlugins={[remarkGFM]} components={components}>
          {content}
        </ReactMarkDown>
      </div>
      {isStreaming && <span className="inline-block w-2 h-5 bg-gray-800 animate-pulse ml-1" />}
    </div>
    <div className='w-full flex justify-end items-center gap-x-2'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'ghost'}
            size='icon-sm'
            className='hover:translate-0'
            onClick={() => setEditMode(true)}
          >
            <Edit3 />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'ghost'}
            size='icon-sm'
            className='hover:translate-0'
            onClick={async () => {
              toast.promise(
                navigator.clipboard.writeText(content || await navigator.clipboard.readText()),
                {
                  loading: <Spinner />,
                  success: `Copied to clipboard.`,
                  error: "Couldn't copy to clipboard.",
                }
              )
            }}
          >
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </div>
}
