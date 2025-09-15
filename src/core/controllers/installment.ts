import { InstallmentStatus } from "../enum/appEnum";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import { CustomError } from "../error/CustomError";
import { CreatePlanResponse } from "../interfaces/installment";
import { Customer } from "../models/customer";
import { InstallmentPlan } from "../models/installmentPlan";
import { Purchase } from "../models/purchase"


export const createInstallmentPlan = async (
    purchaseID: string,
    userId: string,
    body:any
): Promise<CreatePlanResponse> => {
    const purchase = await Purchase.findById(purchaseID);
    if (!purchase) {
        throw new CustomError(
            'Purchase not found',
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        );
    };
    const user = await Customer.findById(userId);
    if (!user) {
        throw new CustomError(
            'User not found',
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        );
    };

    const numberOfMonths = body.numberOfMonths;
    if (![3, 6, 12].includes(numberOfMonths)) {
        throw new CustomError(
            'Invalid number of months',
            ErrorCode.BAD_REQUEST,
            HttpStatus.BAD_REQUEST
        );
    };

    const totalAmount = purchase.totalPrice;
    const monthlyAmount = parseFloat((totalAmount / numberOfMonths).toFixed(2));
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + numberOfMonths);

    const installmentPlan = new InstallmentPlan({
        purchaseId: purchase._id,
        userId: user._id,
        totalAmount,
        numberOfMonths,
        monthlyAmount,
        startDate,
        endDate,
        remainingBalance: totalAmount,
        status: InstallmentStatus.PENDING
    })

    await installmentPlan.save();
    const installmentPlanId = installmentPlan._id;
    if (!installmentPlanId) {
        throw new CustomError(
            'Invalid installment plan',
            ErrorCode.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    };

    return {
        message: "Installment plan created successfully, these are your installment details.You will make a down payment now to validate your purchase",
        data: {
            installmentPlanId: installmentPlanId.toString(),
            totalAmountToPay: installmentPlan.totalAmount,
            numberOfMonthsToPay: installmentPlan.numberOfMonths,
            monthlyAmount: installmentPlan.monthlyAmount,
            paymentStartsFrom: installmentPlan.startDate,
            endsOn: installmentPlan.endDate,
        }
    }

}