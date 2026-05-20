import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL environment variable is not set");

const parsedUrl = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
	host: parsedUrl.hostname,
	user: parsedUrl.username,
	password: parsedUrl.password,
	port: parsedUrl.port ? Number(parsedUrl.port) : undefined,
	database: parsedUrl.pathname ? parsedUrl.pathname.replace(/^\//, "") : undefined,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ["error", "warn"], });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;