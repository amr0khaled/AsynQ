import { Spinner } from "@/components/ui/spinner";


export default function Loading() {
  return <section className='bg-transparent flex justify-center mx-auto my-auto items-center min-h-[calc(100vh-80px)] w-full pt-20'>
    <Spinner className='size-12 border border-white' />
  </section>
}
