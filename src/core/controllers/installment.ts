import { InstallmentStatus } from "../enum/appEnum";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import { CustomError } from "../error/CustomError";
import { CreatePlanResponse } from "../interfaces/installment";
import { Customer } from "../models/customer";
import { InstallmentPlan } from "../models/installmentPlan";
import { Purchase } from "../models/purchase";
import { InstallmentPayment } from "../models/installmentPayment"; // Import the InstallmentPayment model
import { differenceInDays } from 'date-fns';
import { sendMail } from '../utils/email'; // Assuming your sendMail function is here
import { onDuePaymentReminder } from "../utils/templates/dueDateReminder";
import { upcomingPaymentReminder } from "../utils/templates/upcomingPaymentReminder";
import { overduePaymentNotification } from "../utils/templates/gracePeriodTemplate";
export const createInstallmentPlan = async (
  purchaseID: string,
  userId: string,
  body: any
): Promise<CreatePlanResponse> => {
  const purchase = await Purchase.findById(purchaseID);
  if (!purchase) {
    throw new CustomError(
      "Purchase not found",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
  const user = await Customer.findById(userId);
  if (!user) {
    throw new CustomError(
      "User not found",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  // Validate numberOfMonths
  const numberOfMonths = body.numberOfMonths;
  if (![3, 6, 12].includes(numberOfMonths)) {
    throw new CustomError(
      "Please select 3, 6 or 12 months",
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }

  // Calculate plan details
  const totalAmount = purchase.totalPrice;
  const monthlyAmount = parseFloat((totalAmount / numberOfMonths).toFixed(2));
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + numberOfMonths);

  // Create and save the InstallmentPlan record
  const installmentPlan = new InstallmentPlan({
    purchaseId: purchase._id,
    userId: user._id,
    totalAmount,
    numberOfMonths,
    monthlyAmount,
    startDate,
    endDate,
    remainingBalance: totalAmount,
    status: InstallmentStatus.PENDING,
  });

  await installmentPlan.save();

  //Pre-create all InstallmentPayment records
  const installmentPayments = [];
  let nextDueDate = new Date(startDate);

  for (let i = 0; i < numberOfMonths; i++) {
    const paymentRecord = {
      installmentPlanId: installmentPlan._id,
      dueDate: nextDueDate,
      amount: monthlyAmount,
      isPaid: false,
      penaltyApplied: false,
    };
    installmentPayments.push(paymentRecord);

    // Increment the date for the next installment.
    // This handles month-end dates correctly.
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  }

  // Save all generated installment payments at once for efficiency
  await InstallmentPayment.insertMany(installmentPayments);

  const installmentPlanId = installmentPlan._id;
  if (!installmentPlanId) {
    throw new CustomError(
      "Invalid installment plan",
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return {
    message:
      "Installment plan created successfully, these are your installment details.You will make a down payment now to validate your purchase",
    data: {
      installmentPlanId: installmentPlanId.toString(),
      totalAmountToPay: installmentPlan.totalAmount,
      numberOfMonthsToPay: installmentPlan.numberOfMonths,
      monthlyAmount: installmentPlan.monthlyAmount,
      paymentStartsFrom: installmentPlan.startDate,
      endsOn: installmentPlan.endDate,
    },
  };
};

const GRACE_PERIOD_DAYS = 7;
const PENALTY_RATE = 0.003; // 0.3%

export const sendPaymentReminders = async () => {
    try {
        console.log('Running scheduled payment reminder job...');
        const today = new Date();

        // Find all unpaid installment payments
        const unpaidPayments = await InstallmentPayment.find({
            isPaid: false,
        })
        .populate({
            path: 'installmentPlanId',
            populate: {
                path: 'purchaseId',
                model: 'Purchase',
                populate: [{ path: 'buyer', model: 'Customer' }, { path: 'car', model: 'Car' }]
            }
        });

        for (const payment of unpaidPayments) {
            const plan: any = payment.installmentPlanId;
            const purchase: any = plan.purchaseId;
            const customer: any = purchase.buyer;
            const car: any = purchase.car;

            if (!customer || !purchase || !car) {
                console.error(`Skipping reminder for payment ${payment._id}: Related data not found.`);
                continue;
            }

            const daysUntilDue = differenceInDays(payment.nextDueDate, today);
            const paymentLink = `https://your-car-dealership.com/payment/${payment._id}`; // Example link

            // Determine which email to send
            if (daysUntilDue === 5) {
                // Send 5-day reminder
                const emailHtml = upcomingPaymentReminder({
                    firstName: customer.name.split(' ')[0], // Use first name
                    monthlyAmount: payment.amount,
                    carDetails: `${car.make} ${car.model}`,
                    dueDate: payment.nextDueDate,
                    paymentLink,
                    companyName: 'Your Company Name'
                });
                await sendMail({
                    email: customer.email,
                    subject: 'Your Installment Payment is Due Soon!',
                    html: emailHtml
                });

            } else if (daysUntilDue === 0) {
                // Send on-due-date reminder
                const emailHtml = onDuePaymentReminder({
                    firstName: customer.name.split(' ')[0],
                    monthlyAmount: payment.amount,
                    carDetails: `${car.make} ${car.model}`,
                    dueDate: payment.nextDueDate,
                    paymentLink,
                    companyName: 'Your Company Name'
                });
                await sendMail({
                    email: customer.email,
                    subject: 'Your Installment Payment is Due Today!',
                    html: emailHtml
                });

            } else if (daysUntilDue < -GRACE_PERIOD_DAYS && !payment.penaltyApplied) {
                // Payment is overdue and penalty has not been applied
                const penaltyAmount = payment.amount * PENALTY_RATE;
                payment.amount += penaltyAmount; // Apply penalty to the payment amount
                payment.penaltyApplied = true;
                
                const emailHtml = overduePaymentNotification({
                    firstName: customer.name.split(' ')[0],
                    originalAmount: payment.amount - penaltyAmount, // Pass original amount before penalty
                    penaltyAmount,
                    carDetails: `${car.make} ${car.model}`,
                    paymentLink,
                    companyName: 'Your Company Name'
                });
                
                await sendMail({
                    email: customer.email,
                    subject: 'Action Required: Your Payment is Overdue',
                    html: emailHtml
                });
                
                // IMPORTANT: Update the records in the database
                await payment.save();
                
                // Update the remaining balance on the main plan
                const installmentPlan = await plan;
                if (installmentPlan) {
                    installmentPlan.remainingBalance += penaltyAmount;
                    await installmentPlan.save();
                }
            }
        }
        console.log('Payment reminder job completed.');

    } catch (error) {
        console.error('Error during payment reminder job:', error);
    }
};