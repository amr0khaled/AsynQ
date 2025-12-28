import prisma from '@/lib/prisma'
import { Prisma } from '@/lib/prisma/client'




async function user() {
  const users: Prisma.UserCreateInput[] = [
    {
      name: "Local",
      email: "local@local.com",
    },
    {
      name: "Local2",
      email: "local2@local.com",
    },
  ]
  for (const { name, email } of users) {
    if (!(await prisma.user.findFirst({ where: { email } }))) {
      await prisma.user.create({
        data: {
          name,
          email
        }
      })
    }
  }
}

async function main() {
  user()
}

main()
