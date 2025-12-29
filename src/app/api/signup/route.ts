import { NextApiHandler } from "next"
import { loginSchema } from "../login/route"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from '@firebase/auth'

export const POST: NextApiHandler = async (req) => {
  'use server'
  const { method } = req.query
  const { success, error, data } = loginSchema.safeParse(req.body!)
  if (!success) {
    return NextResponse.json(z.treeifyError(error))
  }
  const { email, password } = data
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

  } catch (error) {
    if (error) {
      redirect("/error")
    }
  }
  revalidatePath('/signup', 'page')
  redirect('/success')
}
