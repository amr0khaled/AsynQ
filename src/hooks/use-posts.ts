'use server'
import prisma from "@/lib/prisma"
import { type Post, type PostDelete, type PostUpdate, type PostCreate, type ActionResponse, SCHEMA_ERROR } from "@/lib/types"
import { getUserIdAndReturn } from "@/lib/auth"
import { cookies } from "next/headers"
import { newPostServerSchema, updatePostServerSchema } from "@/lib/input-schemas"
import z from "zod"

export async function getPosts(): Promise<ActionResponse<Post[]>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const response: ActionResponse<Post[]> = {
    success: true,
    data: []
  }
  const res = await getUserIdAndReturn(token?.value)
  if (!res.success) return res
  const { data: userId } = res
  const posts = await prisma.post.findMany({
    where: {
      userId
    },
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    omit: {
      userId: true,
      content: true
    },
  })
  response['data'] = posts

  return response
}

export async function getPost(id: string): Promise<ActionResponse<Post | null>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const response: ActionResponse<Post | null> = {
    success: true,
    data: null
  }
  const res = await getUserIdAndReturn(token?.value)
  if (!res.success) return res
  const { data: userId } = res
  const post = await prisma.post.findUnique({
    where: {
      userId,
      id
    },
    omit: {
      userId: true
    }
  })
  response['data'] = post
  return response
}

export async function newPost(post: PostCreate): Promise<ActionResponse<Post | null>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const response: ActionResponse<Post | null> = {
    success: true,
    data: null
  }
  const res = await getUserIdAndReturn(token?.value)
  if (!res.success) return res
  const { data: userId } = res
  const { data, success, error } = newPostServerSchema.safeParse(post)
  if (!success) return {
    ...SCHEMA_ERROR,
    message: z.prettifyError(error)
  }
  const { prompt, content } = data
  const newPost = await prisma.post.create({
    data: {
      prompt,
      content,
      userId
    },
    omit: {
      userId: true
    }
  })
  response['data'] = newPost
  return response
}
export async function updatePost(post: PostUpdate): Promise<ActionResponse<Post | null>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const response: ActionResponse<Post | null> = {
    success: true,
    data: null
  }
  const res = await getUserIdAndReturn(token?.value)
  if (!res.success) return res
  const { data: userId } = res
  const { data, success, error } = updatePostServerSchema.safeParse(post)
  if (!success) return {
    ...SCHEMA_ERROR,
    message: z.prettifyError(error)
  }
  const { id, content } = data
  const updatedPost = await prisma.post.update({
    where: {
      userId,
      id
    },
    data: {
      content,
    },
    omit: {
      userId: true
    }
  })
  response['data'] = updatedPost
  return response
}
export async function deletePost(id: PostDelete): Promise<ActionResponse<boolean>> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  const response: ActionResponse<boolean> = {
    success: true,
    data: false
  }
  const res = await getUserIdAndReturn(token?.value)
  if (!res.success) return res
  const { data: userId } = res

  await prisma.post.delete({
    where: {
      userId,
      id
    },
  })
  response['data'] = true
  return response
}
