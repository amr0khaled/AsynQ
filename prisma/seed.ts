import prisma from '@/lib/prisma'
import { Prisma } from '@/lib/prisma/client'




async function user() {
  const users: Prisma.UserCreateInput[] = [
    {
      id: "12",
      name: "Local",
      email: "local@local.com",
    },
    {
      id: "1",
      name: "Local2",
      email: "local2@local.com",
    },
  ]
  for (const { name, email, id } of users) {
    if (!(await prisma.user.findFirst({ where: { email } }))) {
      await prisma.user.create({
        data: {
          id,
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
