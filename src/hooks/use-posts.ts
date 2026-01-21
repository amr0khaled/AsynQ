'use server'
import prisma from "@/lib/prisma"
import type { Post, PostDelete, PostUpdate, PostCreate } from "@/lib/types"
import { getUserAndReturnFromDB } from "@/lib/auth"
import { cookies } from "next/headers"
import { newPostServerSchema, updatePostServerSchema } from "@/lib/input-schemas"
import z from "zod"

export async function getPosts(): Promise<Post[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) return []
  const user = await getUserAndReturnFromDB(token.value)
  if (!user) return []
  return await prisma.post.findMany({
    where: {
      userId: user.id
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
  const user = await getUserAndReturnFromDB(token.value)
  if (!user) return null
  return await prisma.post.findUnique({
    where: {
      userId: user.id,
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
  const user = await getUserAndReturnFromDB(token.value)
  if (!user) return null
  const { data, success, error } = newPostServerSchema.safeParse(post)
  if (!success) return z.prettifyError(error)
  const { prompt, content } = data
  return await prisma.post.create({
    data: {
      prompt,
      content,
      userId: user.id
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
  const user = await getUserAndReturnFromDB(token.value)
  if (!user) return null
  const { data, success, error } = updatePostServerSchema.safeParse(post)
  if (!success) return z.prettifyError(error)
  const { id, content } = data
  return await prisma.post.update({
    where: {
      userId: user.id,
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
  const user = await getUserAndReturnFromDB(token.value)
  if (!user) return false

  await prisma.post.delete({
    where: {
      userId: user.id,
      id
    },
  })
  return true
}
