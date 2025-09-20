import {
  format,
  isFuture
} from 'date-fns';


interface OnDuePaymentOptions {
  firstName: string;
  monthlyAmount: number;
  carDetails: string;
  dueDate: Date;
  paymentLink: string;
  companyName: string;
}

export const onDuePaymentReminder = (options: OnDuePaymentOptions): string => {
  const formattedDueDate = format(options.dueDate, 'PPPP');
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
        <title>Payment Due Today</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .header { background-color: #2196F3; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #2196F3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; font-size: 0.8em; color: #666666; padding-top: 20px; border-top: 1px solid #eeeeee; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Payment Due Today</h2>
            </div>
            <div class="content">
                <p>Hello ${options.firstName},</p>
                <p>This is a reminder that your installment payment of <strong>${formattedAmount}</strong> for your **${options.carDetails}** is due today, **${formattedDueDate}**.</p>
                <p>Please log in and complete your payment to keep your plan active and on track.</p>
                <a href="${options.paymentLink}" class="button">Pay Now</a>
                <p>If you have already made this payment, please disregard this email.</p>
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
