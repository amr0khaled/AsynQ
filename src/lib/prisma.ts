import 'server-only'
import { PrismaClient } from './prisma/index'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from "pg"


const globalPrisma = global as unknown as { prisma: PrismaClient }
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = globalPrisma.prisma || new PrismaClient({
  errorFormat: "pretty",
  adapter,
  log: ['error', 'warn', 'info', 'query']
})


export default prisma
