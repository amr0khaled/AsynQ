import { PrismaClient } from './prisma/client'
import { LogLevel, LogDefinition, PrismaClientOptions, Subset } from './prisma/internal/prismaNamespace'
import { env } from 'prisma/config'


const globalPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalPrisma.prisma || new PrismaClient({
  errorFormat: "pretty",
  accelerateUrl: env("DATABASE_URL"),
  log: ['error', 'warn', 'info', 'query']
} satisfies Subset<PrismaClientOptions, PrismaClientOptions>)


export default prisma
