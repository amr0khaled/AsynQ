import { createClient } from "@/lib/supabase/server";
import { NextApiHandler } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import z from 'zod'


export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})


export const POST: NextApiHandler = async (req, res) => {
  'use server'
  const { success, error, data } = loginSchema.safeParse(req.body!)
  if (!success) {
    return NextResponse.json(z.treeifyError(error))
  }
  const supabase = await createClient()

  const { error: supaError, data: supaData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/error")
  }

  revalidatePath('/login', 'page')
  redirect('/success')
}
