import { checkUserAndReturn } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const uid = await checkUserAndReturn(req.headers)
  if (!uid) return NextResponse.json(null, { status: 401 })
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    }
  })
  console.log(user, 'user')
  if (!user) return NextResponse.json(null, { status: 401 })
  return NextResponse.json({
    credits: user.credits
  })
}
