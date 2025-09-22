import {
  format
} from 'date-fns';

interface InstallmentPlanEndedOptions {
  firstName: string;
  planName: string;
  outstandingBalance: number;
  startDate: Date;
  endDate: Date;
  refundLink: string;
  extensionLink: string;
  companyName: string;
}

export const installmentPlanEnded = (options: InstallmentPlanEndedOptions): string => {
  const formattedStartDate = format(options.startDate, 'PPPP');
  const formattedEndDate = format(options.endDate, 'PPPP');
  const formattedBalance = options.outstandingBalance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Installment Plan Has Ended</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 0; padding: 0; background-color: #f7f7f7; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
            .header { background-color: #31572C; color: #ffffff; padding: 40px 20px; text-align: center; }
            .content { padding: 20px 40px; color: #4b5563; line-height: 1.6; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px; }
            .button-primary { background-color: #31572C; color: #ffffff; }
            .button-secondary { background-color: #e5e7eb; color: #4b5563; }
            .footer { text-align: center; font-size: 12px; color: #9ca3af; padding: 20px; border-top: 1px solid #e5e7eb; }
            .highlight { color: #31572C; font-weight: bold; }
            @media (max-width: 600px) {
                .content { padding: 20px; }
                .button { display: block; width: 80%; margin: 10px auto; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Your Installment Plan Has Ended</h1>
            </div>
            <div class="content">
                <p>Hello ${options.firstName},</p>
                <p>We are writing to inform you that your <strong>${options.planName}</strong> installment plan, which began on <strong>${formattedStartDate}</strong>, has now reached its scheduled end date of <strong>${formattedEndDate}</strong>.</p>
                <p>Our records show an outstanding balance of <span class="highlight">${formattedBalance}</span> on your account. Because the plan period has elapsed, we want to give you two clear options to resolve this:</p>
                <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 18px; font-weight: bold; margin-top: 0;">Option 1: Request an Extension</p>
                    <p style="margin-bottom: 20px;">If you would like more time to complete your payments, you can request an extension to your plan.</p>
                    <p style="font-size: 18px; font-weight: bold; margin-top: 0;">Option 2: Request a Refund</p>
                    <p style="margin-bottom: 0;">Alternatively, you may request a refund for the payments you have made so far.</p>
                </div>
                <div class="button-container">
                    <a href="${options.extensionLink}" class="button button-primary">Request an Extension</a>
                    <a href="${options.refundLink}" class="button button-secondary">Request a Refund</a>
                </div>
                <p>Please choose one of the options above to proceed.</p>
                <p>If you have any questions, please feel free to reach out to us.</p>
                <p>Sincerely,<br>${options.companyName} Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${options.companyName}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};