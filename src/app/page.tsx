import { Button } from "@/components/ui/button";
import '@/styles/pages/home.css'

export default function Home() {
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
      <Button variant='primary'>Get Started</Button>
    </div>
  </section>;
}
