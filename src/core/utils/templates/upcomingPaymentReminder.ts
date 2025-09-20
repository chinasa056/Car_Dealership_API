import {
  format,
  isFuture
} from 'date-fns';
interface UpcomingPaymentOptions {
  firstName: string;
  monthlyAmount: number;
  carDetails: string;
  dueDate: Date;
  paymentLink: string;
  companyName: string;
}

export const upcomingPaymentReminder = (options: UpcomingPaymentOptions): string => {
  const formattedDueDate = format(options.dueDate, 'PPPP'); // e.g., 'October 1, 2025'
  const formattedAmount = options.monthlyAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upcoming Installment Payment</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .header { background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; font-size: 0.8em; color: #666666; padding-top: 20px; border-top: 1px solid #eeeeee; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Upcoming Payment Reminder</h2>
            </div>
            <div class="content">
                <p>Hello ${options.firstName},</p>
                <p>Just a friendly reminder that your next installment payment of <strong>${formattedAmount}</strong> for your **${options.carDetails}** purchase is due in <strong>5 days</strong> on **${formattedDueDate}**.</p>
                <p>To avoid any delays, please ensure your payment is completed on or before the due date. You can make your payment by logging into your account and visiting the payments section.</p>
                <p>Thank you for your timely payments.</p>
                <a href="${options.paymentLink}" class="button">Make a Payment</a>
                <p>Best regards,<br>The **${options.companyName}** Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} **${options.companyName}**. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
