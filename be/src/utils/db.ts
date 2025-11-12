import { PrismaClient } from "../generated/prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
type GlobalForPrisma = typeof globalThis & { prisma?: PrismaClient };

const globalForPrisma = global as GlobalForPrisma;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
