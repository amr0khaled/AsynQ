'use client'
import '@/styles/pages/ai.css'
import AiChat from '@/components/ai-chat'
import { useChat } from '@/hooks/use-chat'

export default function Page() {
  const { post } = useChat()
  return (
    <>
      <AiChat key={post?.id || 'new'} />
    </>
  )
}
