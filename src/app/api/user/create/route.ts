import { checkUserAndReturn } from "@/lib/auth";
import { signupServerSchema } from "@/lib/input-schemas";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


export const POST = async (req: NextRequest) => {
  console.info("SSSSS")
  const res = await checkUserAndReturn(req.headers)
  if (!res.success) return NextResponse.json(res, { status: 401 })
  const { data: uid } = res
  const { error, success, data } = signupServerSchema.safeParse(await req.json())
  if (!success) return NextResponse.json(z.treeifyError(error), { status: 400 })
  const { name, email } = data
  let user = await prisma.user.findUnique({
    where: {
      id: uid,
    }
  })
  if (user) return NextResponse.json(null)
  user = await prisma.user.create({
    data: {
      name,
      id: uid,
      email
    }
  })
  if (!user) return NextResponse.json({ errors: [{ internal: "Internal Error" }] }, { status: 502 })
  return NextResponse.json(null)
}
