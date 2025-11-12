import { app } from "./app";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { prisma } from "./utils/db";

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    logger.info(`App running a port :${port}`);
})

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});