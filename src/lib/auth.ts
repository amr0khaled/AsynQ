import prisma from "./prisma";
import { getAuth } from "firebase-admin/auth";
import { ActionResponse, ERROR_TOKEN_CHECK, ErrorCodes, ID_TOKEN_EXPIRED, NOT_FOUND, UNAUTHENTICATED } from "./types";
import { AppRouterContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";
import { User } from "./prisma/index";



export async function checkUser(headers: Headers): Promise<ActionResponse<null>> {
  const authHeader = headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]
  if (!token) return ErrorCodes["UNAUTHENTICATED"]

  try {
    const auth = getAuth()
    await auth.verifyIdToken(token)
    return {
      success: true,
      data: null
    }
  } catch (e: any) {
    return ErrorCodes[e.code || 'TOKEN']
  }
}
export async function checkUserAndReturn(headers: Headers): Promise<ActionResponse<string>> {
  const authHeader = headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]
  if (!token) return ErrorCodes["UNAUTHENTICATED"]

  try {
    const auth = getAuth()
    const { uid } = await auth.verifyIdToken(token)
    return {
      success: true,
      data: uid
    }
  } catch (e: any) {
    return ErrorCodes[e.code || 'TOKEN']
  }
}

export async function checkUserAndReturnFromDB(headers: Headers): Promise<ActionResponse<User>> {
  const authHeader = headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]
  if (!token) return ErrorCodes["UNAUTHENTICATED"]

  try {
    const auth = getAuth()
    const { uid, email } = await auth.verifyIdToken(token)
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
        email,
      }
    })
    if (!user) return ErrorCodes["NOT_FOUND"]
    return {
      success: true,
      data: user
    }
  } catch (e: any) {
    return ErrorCodes[e.code || 'TOKEN']
  }
}

export async function getUserIdAndReturn(token: string | undefined): Promise<ActionResponse<string>> {
  if (!token) return ErrorCodes["UNAUTHENTICATED"]
  try {
    const auth = getAuth()
    const { uid } = await auth.verifyIdToken(token)
    return {
      success: true,
      data: uid
    }
  } catch (e: any) {
    return ErrorCodes[e.code || 'TOKEN']
  }
}
export async function getUserAndReturnFromDB(token: string | undefined): Promise<ActionResponse<User>> {
  if (!token) return ErrorCodes["UNAUTHENTICATED"]

  try {
    const auth = getAuth()
    const { uid, email } = await auth.verifyIdToken(token)
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
        email,
      }
    })
    if (!user) return ErrorCodes["NOT_FOUND"]
    return {
      success: true,
      data: user
    }
  } catch (e: any) {
    return ErrorCodes[e.code || 'TOKEN']
  }
}
