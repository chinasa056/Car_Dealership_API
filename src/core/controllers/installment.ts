import { InstallmentStatus } from "../enum/appEnum";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import { CustomError } from "../error/CustomError";
import { CreatePlanResponse } from "../interfaces/installment";
import { Customer } from "../models/customer";
import { InstallmentPlan } from "../models/installmentPlan";
import { Purchase } from "../models/purchase";
import { InstallmentPayment } from "../models/installmentPayment"; 
import { differenceInDays } from 'date-fns';
import { sendMail } from '../utils/email'; 
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

  // Calculate plan Details
  const totalAmount = purchase.totalPrice;
  const monthlyAmount = parseFloat((totalAmount / numberOfMonths).toFixed(2));
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + numberOfMonths);

  // Create and save InstallmentPlan record
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
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  }

  // Save the generated installment payments at once
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
const PENALTY_RATE = 0.003;

export const sendPaymentReminders = async () => {
  try {
    console.log('Running scheduled payment reminder job...');
    const today = new Date();

    // Find all unpaid installment payments and populate the direct parent
    const unpaidPayments = await InstallmentPayment.find({
      isPaid: false,
    }).populate('installmentPlanId');

    //Loop through each unpaid payment
    for (const payment of unpaidPayments) {
      const installmentPlan: any = payment.installmentPlanId;

      if (!installmentPlan || !installmentPlan.purchaseId) {
        continue;
      }

      // Find the purchase and populate the related buyer and car in one step
      const purchase = await Purchase.findById(installmentPlan.purchaseId)
        .populate('buyer')
        .populate('car');

      if (!purchase || !purchase.buyer || !purchase.car) {
        continue;
      }

      const customer: any = purchase.buyer;
      const car: any = purchase.car;

      const daysUntilDue = differenceInDays(payment.nextDueDate, today);
      const paymentLink = `https://wheelcom/payment/${payment._id}`;

      // Check for and apply penalty
      if (daysUntilDue < -GRACE_PERIOD_DAYS && !payment.penaltyApplied) {
        const penaltyAmount = payment.amount * PENALTY_RATE;
        payment.amount += penaltyAmount;
        payment.penaltyApplied = true;

        const emailHtml = overduePaymentNotification({
          firstName: customer.name.split(' ')[0],
          originalAmount: payment.amount - penaltyAmount,
          penaltyAmount,
          carDetails: `${car.brand} ${car.carModel}`,
          paymentLink,
          companyName: 'WheelCom Enterprises'
        });

        await sendMail({
          email: customer.email,
          subject: 'Action Required: Your Payment is Overdue',
          html: emailHtml
        });

        await payment.save();
        installmentPlan.remainingBalance += penaltyAmount;
        await installmentPlan.save();
      }

      // Check for defaulted status
      if (daysUntilDue < -GRACE_PERIOD_DAYS && installmentPlan.status !== InstallmentStatus.DEFAULTED) {
        installmentPlan.status = InstallmentStatus.DEFAULTED;
        await installmentPlan.save();
        console.log(`Installment plan for ${customer.name} defaulted.`);
      }

      // Send reminders if the payment is NOT defaulted
      if (installmentPlan.status !== InstallmentStatus.DEFAULTED) {
        if (daysUntilDue === 5) {
          const emailHtml = upcomingPaymentReminder({
            firstName: customer.name.split(' ')[0],
            monthlyAmount: payment.amount,
            carDetails: `${car.brand} ${car.carModel}`,
            dueDate: payment.nextDueDate,
            paymentLink,
            companyName: 'WheelCom Enterprises'
          });
          await sendMail({
            email: customer.email,
            subject: 'Your Installment Payment is Due Soon!',
            html: emailHtml
          });

        } else if (daysUntilDue === 0) {
          const emailHtml = onDuePaymentReminder({
            firstName: customer.name.split(' ')[0],
            monthlyAmount: payment.amount,
            carDetails: `${car.brand} ${car.carModel}`,
            dueDate: payment.nextDueDate,
            paymentLink,
            companyName: 'WheelCom Enterprises'
          });
          await sendMail({
            email: customer.email,
            subject: 'Your Installment Payment is Due Today!',
            html: emailHtml
          });
        }
      }
    }
    console.log('Payment reminder job completed.');
  } catch (error) {
    console.error('Error during payment reminder job:', error);
  }
};