import cron from 'node-cron';
import { prisma } from '../utils/db';
import { logger } from './logger';

const deleteOldSlots = async () => {
    try {
        await prisma.$connect();
        const result = await prisma.slot.deleteMany({
            where: {
                endTime: { lt: new Date() }
            }
        });
        logger.info(`Deleted ${result.count} old slots`);
    } catch (error) {
        logger.error('Error deleting old slots:', error);
    }
}

const startCronJobs = () => {
    // Example cron job: runs every day at midnight
    cron.schedule('*/60 * * * *', async () => {
        logger.info('Running daily cleanup job at midnight');
        await deleteOldSlots();
        logger.info('Daily cleanup job completed');
    });
}

export { startCronJobs };