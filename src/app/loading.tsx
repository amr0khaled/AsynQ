import { Spinner } from "@/components/ui/spinner";


export default function Loading() {
  return <main className='flex justify-center items-center min-h-screen w-full'>
    <Spinner className='size-8' />
  </main>
}
