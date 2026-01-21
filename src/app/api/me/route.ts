import { checkUserAndReturn } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const uid = await checkUserAndReturn(req)
  if (!uid) return NextResponse.json(null, { status: 401 })
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
  if (!user) return NextResponse.json(null, { status: 401 })
  return NextResponse.json({
    credits: user.credits
  })
}
