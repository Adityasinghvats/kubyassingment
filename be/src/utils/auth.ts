import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { configDotenv } from "dotenv";
configDotenv();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        // remember to remove it for production deployments
        disableCSRFCheck: process.env.NODE_ENV !== 'production'
    },
    trustedOrigins: [process.env.FRONTEND_ORIGIN || "http://localhost:3000"],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "CLIENT",
                input: true
            },
        }
    },
});