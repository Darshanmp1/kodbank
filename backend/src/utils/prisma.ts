import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client instance for database operations
 * Single instance to prevent connection pooling issues
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
