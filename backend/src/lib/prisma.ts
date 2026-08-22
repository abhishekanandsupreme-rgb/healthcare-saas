import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 *
 * Ensures a single instance of Prisma Client is created across the application.
 * Prevents multiple instances from being created during development (hot reload).
 */

let prisma: PrismaClient | null = null;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Attach event listeners for logging
    prisma.$on('query', (e: unknown) => {
      // In production, send to structured logging service
      // console.log('Query:', JSON.stringify(e));
    });

    prisma.$on('error', (e: Error) => {
      console.error('Prisma error:', e);
    });

    prisma.$on('warn', (e: unknown) => {
      console.warn('Prisma warning:', JSON.stringify(e));
    });
  }

  return prisma;
}

// Singleton pattern for development hot-reload
if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = getPrismaClient();
  }
  prisma = globalForPrisma.prisma;
} else {
  prisma = getPrismaClient();
}

// Graceful shutdown helper
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export default getPrismaClient();
