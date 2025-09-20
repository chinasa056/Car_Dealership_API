import cron from 'node-cron';
import { sendPaymentReminders } from '../controllers/installment';

export const startPaymentCronJob = () => {
    cron.schedule('* * * * *', async () => {
        console.log('Running daily payment reminder job...');
        await sendPaymentReminders();
    });
};