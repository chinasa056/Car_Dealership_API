const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
const transactionUrl = "https://api.paystack.co/transaction/initialize";
const verifyUrl = "https://api.paystack.co/transaction/verify";
import { Payment } from "../models/payment";
import { Purchase } from "../models/purchase";
import { CustomError } from "../error/CustomError";
import axios from "axios";
import { Customer } from "../models/customer";
import { Types } from "mongoose";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import {
  PaymentInitializationResponse,
  PaymentVerificationResponse,
} from "../interfaces/payment_and_purchase";
import { InstallmentStatus, PaymentOption, Status } from "../enum/appEnum";
import { Car } from "../models/car";
import { InstallmentPlan } from "../models/installmentPlan";
import { InstallmentPayment } from "../models/installmentPayment";

export const processPaymentInitialization = async (
  purchaseId: Types.ObjectId,
  userId: string
): Promise<PaymentInitializationResponse> => {
  const user = await Customer.findById(userId);
  if (!user) {
    throw new CustomError(
      " Payment failed: User not found",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  const purchase = await Purchase.findById(purchaseId);
  if (!purchase) {
    throw new CustomError(
      "Payment failed: Purchase not found",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  let paystackAmount;
  let installmentPaymentId: Types.ObjectId | null = null;

  const paymentOption = purchase.paymentOption;
  if (paymentOption === PaymentOption.FULL_PAYMENT) {
    paystackAmount = purchase.totalPrice;
  } else if (paymentOption === PaymentOption.INSTALLMENTS) {
    const installmentPlan = await InstallmentPlan.findOne({
      purchaseId: purchaseId,
      userId: userId,
    });

    if (!installmentPlan) {
      throw new CustomError(
        "Payment failed: Installment plan not found",
        ErrorCode.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (installmentPlan.status === InstallmentStatus.DEFAULTED) {
      throw new CustomError(
        "Payment failed: Installment plan has ended,please request an extension or a refund",
        ErrorCode.BAD_REQUEST,
        HttpStatus.BAD_REQUEST
      );
    }

    const installmentPayment = await InstallmentPayment.findOne({
      installmentPlanId: installmentPlan._id,
      isPaid: false,
    });

    if (!installmentPayment) {
      throw new CustomError(
        "Payment failed: Installment payment not found",
        ErrorCode.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    paystackAmount = installmentPayment.amount;
    installmentPaymentId = installmentPlan._id as Types.ObjectId;
  } else {
    throw new CustomError(
      "Invalid payment option",
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }

  const paymentDetails = {
    amount: paystackAmount,
    email: user.email,
  };

  const response = await axios.post(transactionUrl, paymentDetails, {
    headers: { Authorization: `Bearer ${paystackSecret}` },
  });

  const { data } = response.data;

  const payment = new Payment({
    purchase: purchaseId,
    email: user.email,
    customerName: user.name,
    amount: paystackAmount,
    reference: data.reference,
    status: "pending",
    paymentType: purchase.paymentOption,
    installmentPaymentId: installmentPaymentId,
    provider: "Paystack",
  });

  await payment.save();

  return {
    message: "Payment initialization successful",
    data: {
      authorization_url: data?.authorization_url,
      reference: data?.reference,
      transactionDetails: payment,
    },
  };
};

export const verifyPayment = async (
  reference: string
): Promise<PaymentVerificationResponse> => {
  const payment = await Payment.findOne({ reference: reference });

  if (!payment) {
    throw new CustomError(
      `Payment record not found for reference ${reference}`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  if (payment.status === "Success") {
    return {
      message: "Payment already verified and transaction completed",
      data: {
        payment,
      },
    };
  }

  const purchase = await Purchase.findById(payment.purchase);
  if (!purchase) {
    throw new CustomError(
      "Purchase record not found for this payment",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  if (purchase.status === "Completed") {
    return {
      message: "Payment already verified and transaction completed",
    };
  }
  const car = await Car.findById(purchase.car);
  if (!car) {
    throw new CustomError(
      "Car not found for this purchase",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  const user = await Customer.findById(purchase.buyer);
  if (!user) {
    throw new CustomError(
      "User not found for this purchase",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  const response = await axios.get(`${verifyUrl}/${reference}`, {
    headers: { Authorization: `Bearer ${paystackSecret}` },
  });

  const { data } = response;
  console.log("response data: ", data);

  if (data?.status && data.data?.status === "success") {
    payment.status = "Success";
    await payment.save();

    if (purchase.paymentOption === PaymentOption.INSTALLMENTS) {
      const installmentPayment = await InstallmentPayment.findById(
        payment.installmentPaymentId
      );
      if (!installmentPayment) {
        throw new CustomError(
          "Installment payment not found",
          ErrorCode.NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      installmentPayment.isPaid = true;
      installmentPayment.paymentDate = new Date();
      await installmentPayment.save();

      const installmentPlanId = installmentPayment.installmentPlanId;

      const installmentPlan = await InstallmentPlan.findOne({
        _id: installmentPlanId,
      });
      if (!installmentPlan) {
        throw new CustomError(
          "Installment plan not found",
          ErrorCode.NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      installmentPlan.remainingBalance -= installmentPayment.amount;

      if (installmentPlan.status === InstallmentStatus.DEFAULTED_GRACE_PERIOD) {
        installmentPlan.status = InstallmentStatus.ACTIVE
      }

      const checkUncompletedPayments = await InstallmentPayment.findOne({
        installmentPlanId: installmentPlan._id,
        isPaid: false,
      });

      if (!checkUncompletedPayments || installmentPlan.remainingBalance <= 0) {
        installmentPlan.status = InstallmentStatus.COMPLETED;
        purchase.status = Status.COMPLETED;

        car.quantity -= 1;
        if (car.quantity <= 0) {
          car.available = false;
        } else {
          car.available = true;
        }
        await purchase.save();
        await car.save();
      }
      await installmentPlan.save();
    } else if (purchase.paymentOption === PaymentOption.FULL_PAYMENT) {
      purchase.status = Status.COMPLETED;

      car.quantity -= 1;
      if (car.quantity <= 0) {
        car.available = false;
      } else {
        car.available = true;
      }
      await purchase.save();
      await car.save();
    }

    return {
      message: "Payment verified successfully",
      data: {
        payment,
        purchase,
      },
    };
  } else if (data?.status && data.data?.status !== "success") {
    payment.status = "Failed";
    purchase.status = Status.FAILED;

    await payment.save();
    await purchase.save();

    return {
      message: "Payment Failed please try again later",
      data: {
        payment,
      },
    };
  }

  // Fallback return statement to satisfy all code paths
  return {
    message: "Unable to verify payment",
    data: {
      payment,
    },
  };
};
