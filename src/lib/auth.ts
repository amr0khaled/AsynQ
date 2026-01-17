import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";


export const checkUser = async (req: NextRequest) => {

  const userId = req.nextUrl.searchParams.get("uid")
  if (!userId)
    return NextResponse.json(null, { status: 401 })
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!user)
    return NextResponse.json(null, { status: 404 });
  return userId;
}

export const checkUserAndReturn = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("uid")
  if (!userId)
    return NextResponse.json(null, { status: 401 })
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!user)
    return NextResponse.json(null, { status: 404 });
  return user;
}
