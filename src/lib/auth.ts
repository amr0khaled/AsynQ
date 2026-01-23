import { NextRequest } from "next/server";
import prisma from "./prisma";
import { getAuth } from "firebase-admin/auth";


export async function checkUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]
  if (!token) return 401

  try {
    const auth = getAuth()
    await auth.verifyIdToken(token)
    return true
  } catch {
    return 401
  }
}
export async function checkUserAndReturn(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]
  if (!token) return false

  try {
    const auth = getAuth()
    const { uid } = await auth.verifyIdToken(token)
    return uid
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function checkUserAndReturnFromDB(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]
  if (!token) return 401

  try {
    const auth = getAuth()
    const { uid, email } = await auth.verifyIdToken(token)
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
        email,
      }
    })
    if (!user) return 404
    return user
  } catch {
    return 401
  }
}

export async function getUserIdAndReturn(token: string | undefined) {
  if (!token) return null
  try {
    const auth = getAuth()
    const { uid } = await auth.verifyIdToken(token)
    // TODO: Add a reauthentication of revoked token
    return uid
  } catch (e: any) {
    // TODO: Handle revoked token
    console.error('Error in checking user token', e.code)
    return null
  }
}
export async function getUserAndReturnFromDB(token: string | undefined) {
  if (!token) return null

  try {
    const auth = getAuth()
    const { uid, email } = await auth.verifyIdToken(token)
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
        email,
      }
    })
    if (!user) return null
    return user
  } catch {
    return null
  }
}
