import { checkUserAndReturn } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse, NOT_FOUND } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const res = await checkUserAndReturn(req.headers)
  if (!res.success) return NextResponse.json(res, { status: 401 })
  const { data: uid } = res
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    }
  })
  // Reset credits if a day has passed
  const dayAgo = 1000 * 60 * 60 * 24
  const lastReset = user?.lastReset.getTime()
  if (lastReset) {
    const timeDiff = Date.now() - lastReset
    if (timeDiff > dayAgo) {
      const now = new Date()
      await prisma.user.update({
        where: {
          id: uid
        },
        data: {
          credits: 5,
          lastReset: now,
          updatedAt: now
        }
      })
    }
  }
  if (!user) return NextResponse.json(NOT_FOUND, { status: 401 })
  return NextResponse.json({
    success: true,
    data: user.credits
  } as ActionResponse<number>)
}
