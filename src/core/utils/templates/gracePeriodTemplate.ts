
interface OverduePaymentOptions {
  firstName: string;
  originalAmount: number;
  penaltyAmount: number;
  carDetails: string;
  paymentLink: string;
  companyName: string;
}

export const overduePaymentNotification = (options: OverduePaymentOptions): string => {
  const formattedOriginalAmount = options.originalAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const formattedPenaltyAmount = options.penaltyAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const newTotalAmount = options.originalAmount + options.penaltyAmount;
  const formattedNewTotalAmount = newTotalAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Overdue - Action Required</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .header { background-color: #FF5722; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #FF5722; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
            .footer { text-align: center; font-size: 0.8em; color: #666666; padding-top: 20px; border-top: 1px solid #eeeeee; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Your Payment is Overdue</h2>
            </div>
            <div class="content">
                <p>Hello ${options.firstName},</p>
                <p>Our records show that your installment payment of **${formattedOriginalAmount}** for your **${options.carDetails}** is now **7 days overdue**.</p>
                <p>As per our policy, a penalty of **${formattedPenaltyAmount}** has been applied to your outstanding balance. Your new payment amount is **${formattedNewTotalAmount}**.</p>
                <p>To prevent your purchase from being marked as defaulted, please make the payment immediately by clicking the button below.</p>
                <a href="${options.paymentLink}" class="button">Pay Now</a>
                <p>If you have any questions, please reply to this email.</p>
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