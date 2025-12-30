import { Button } from "@/components/ui/button";
import '@/styles/pages/home.css'

export default function Home() {
  return <section className='hero'>
    <p className='main-paragraph'>
      <span className='your'>Your</span> Next tool for Writer's block<br />
      AI Content Creation Tool
    </p>
    <div className='operation-buttons'>
      <Button className='bg-secondary text-accent'>Learn more</Button>
      <Button className="bg-accent text-secondary">Get Started</Button>
    </div>
  </section>;
}
