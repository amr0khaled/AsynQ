import { checkUserAndReturn } from "@/lib/auth";
import { signupServerSchema } from "@/lib/input-schemas";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


export const POST = async (req: NextRequest) => {
  const uid = await checkUserAndReturn(req)
  if (!uid) return NextResponse.json(null, { status: 401 })
  const { error, success, data } = signupServerSchema.safeParse(req.json())
  if (!success) return NextResponse.json(z.treeifyError(error), { status: 400 })
  const { name, email } = data
  const user = await prisma.user.create({
    data: {
      name,
      id: uid,
      email
    }
  })
  if (!user) return NextResponse.json({ errors: [{ internal: "Internal Error" }] }, { status: 502 })
  return NextResponse.json(null)
}
