'use client'
import { Button } from "@/components/ui/button";
import '@/styles/pages/home.css'
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter()
  return <section className='hero'>
    <p className='main-paragraph'>
      <span>
        <span className='your'>Your</span> Next tool for Writer's block<br />
      </span>
      <span className='gradient'>
        AI Content Creation Tool
      </span>
    </p>
    <div className='operation-buttons'>
      <Button variant='secondary'>Learn more</Button>
      <Button variant='primary' onClick={() => push('/post/create')}>Get Started</Button>
    </div>
  </section>;
}
