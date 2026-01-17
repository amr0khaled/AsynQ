import { checkUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


export async function GET(req: NextRequest) {
  const auth = await checkUser(req)
  if (auth instanceof NextResponse) {
    return auth
  }
  const userId = auth
  const posts = await prisma.post.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      prompt: true,
      createdAt: true
    },
  })

  return NextResponse.json(posts)
}


const postCreateSchema = z.object({
  prompt: z.string(),
  content: z.string()
})

export async function POST(req: NextRequest) {
  const auth = await checkUser(req)
  if (auth instanceof NextResponse) {
    return auth
  }
  const userId = auth

  const { error, success, data } = postCreateSchema.safeParse(req.body)

  if (!success) return NextResponse.json(z.treeifyError(error))
  const { prompt, content } = data
  const post = await prisma.post.create({
    data: {
      userId: userId,
      prompt,
      content,
    },
    omit: {
      userId: true,
    }
  })

  return NextResponse.json(post, { status: 201 });

}

