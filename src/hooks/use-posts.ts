'use server'
import prisma from "@/lib/prisma"
import type { Post, PostDelete, PostUpdate, PostCreate } from "@/lib/types"
import { getUserIdAndReturn } from "@/lib/auth"
import { cookies } from "next/headers"
import { newPostServerSchema, updatePostServerSchema } from "@/lib/input-schemas"
import z from "zod"

export async function getPosts(): Promise<Post[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) return []
  const userId = await getUserIdAndReturn(token.value)
  if (!userId) return []
  return await prisma.post.findMany({
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
}

export async function getPost(id: string): Promise<Post | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) return null
  const userId = await getUserIdAndReturn(token.value)
  if (!userId) return null
  return await prisma.post.findUnique({
    where: {
      userId,
      id
    },
    omit: {
      userId: true
    }
  })
}

export async function newPost(post: PostCreate): Promise<Post | null | string> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) return null
  const userId = await getUserIdAndReturn(token.value)
  if (!userId) return null
  const { data, success, error } = newPostServerSchema.safeParse(post)
  if (!success) return z.prettifyError(error)
  const { prompt, content } = data
  return await prisma.post.create({
    data: {
      prompt,
      content,
      userId
    },
    omit: {
      userId: true
    }

  })
}
export async function updatePost(post: PostUpdate): Promise<Post | null | string> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) return null
  const userId = await getUserIdAndReturn(token.value)
  if (!userId) return null
  const { data, success, error } = updatePostServerSchema.safeParse(post)
  if (!success) return z.prettifyError(error)
  const { id, content } = data
  return await prisma.post.update({
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
}
export async function deletePost(id: PostDelete): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) return false
  const userId = await getUserIdAndReturn(token.value)
  if (!userId) return false

  await prisma.post.delete({
    where: {
      userId,
      id
    },
  })
  return true
}
