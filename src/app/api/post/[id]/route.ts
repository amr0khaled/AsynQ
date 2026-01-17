import { checkUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"


type Params = { id: string }


export async function GET(req: NextRequest, { id }: Params) {
  const auth = await checkUser(req)
  if (auth instanceof NextResponse) {
    return auth
  }
  const userId = auth

  const post = await prisma.post.findUnique({
    where: {
      userId,
      id
    }
  })

  if (!post) return NextResponse.json(null, { status: 404 })

  return NextResponse.json(post)
}




const postUpdateSchema = z.object({
  content: z.string().optional()
})


export async function PATCH(req: NextRequest, { id }: Params) {
  const auth = await checkUser(req)
  if (auth instanceof NextResponse) {
    return auth
  }
  const userId = auth
  const { error, success, data } = postUpdateSchema.safeParse(req.body)

  if (!success) return NextResponse.json(z.treeifyError(error))
  const { content } = data
  const post = await prisma.post.update({
    where: {
      userId,
      id
    },
    data: {
      content,
    },
    omit: {
      userId: true,
    }
  })

  return NextResponse.json(post);
}


export async function DELETE(req: NextRequest, { id }: Params) {
  const auth = await checkUser(req)
  if (auth instanceof NextResponse) {
    return auth
  }
  const userId = auth

  const post = await prisma.post.delete({
    where: {
      userId,
      id
    },
  })

  return NextResponse.json(null);
}
