import { Types } from 'mongoose';
import { Car } from '../models/car';
import { Purchase } from '../models/purchase';
import { CustomError } from '../error/CustomError';
import { ErrorCode } from '../enum/error';
import { HttpStatus } from '../enum/httpCode';
import { Category } from '../models/category';
import { Customer } from '../models/customer';
import { PaymentOption } from '../enum/appEnum';

export const processPurchaseCar = async (
  body: any,
  carId: string,
  buyerId: Types.ObjectId
) => {

  const user = await Customer.findById(buyerId);
  if (!user) {
    throw new CustomError(
      'User not found',
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  };

  const car = await Car.findById(carId).populate('category');

  if (!car) {
    throw new CustomError(
      'Car not found',
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  };

  if (!car.available) {
    throw new CustomError(
      'Car is not available for purchase',
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  };

  if (car.quantity < 1) {
    throw new CustomError(
      'Car is out of stock',
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }

  // if ('quantity' in car && typeof car.quantity === 'number') {
  //   if (car.quantity < 1) {
  //     throw new CustomError(
  //       'Car is out of stock',
  //       ErrorCode.BAD_REQUEST,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  //   car.quantity -= 1;

  //   if (car.quantity <= 0) {
  //     car.available = false;
  //   }
  // } else {
  //   car.available = false;
  // };

  await car.save();
  const category = await Category.findById(car.category._id);
  if (!category) {
    throw new CustomError(
      'Category not found',
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
  const totalAmount = car.price * body.quantity;

  const purchase = await Purchase.create({
    buyer: buyerId,
    car: car._id,
    purchaseDate: new Date(),
    priceSold: car.price,
    quantity: body.quantity || 1,
    totalPrice: totalAmount,
    brand: car.brand,
    carModel: car.carModel,
    categoryId: category._id,
    categoryName: category.name,
    status: 'Pending',
  });

  return {
    message: 'Purchase created successfully',
    data: purchase,
  };
};

export const viewSinglePurchaseDetail = async (purchaseId: string) => {
  const purchase = await Purchase.findById(purchaseId)
  if (!purchase) {
    throw new CustomError(
      'Purchase not found',
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }; return {
    message: 'Purchase fetched successfully',
    data: purchase,
  };
}

export const viewAllPurchases = async () => {
  const purchases = await Purchase.find()
  if (purchases.length === 0) {
    return []
  }
  return purchases;
}

export const selectPaymentOption = async (
  purchaseId: string,
  paymentOption: PaymentOption
) => {
  const purchase = await Purchase.findById(purchaseId);
  if (!purchase) {
    throw new CustomError(
      'Purchase not found',
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  };
  if (purchase.paymentOption === paymentOption) {
    return
  }

  purchase.paymentOption = paymentOption;
  await purchase.save();
  return {
    message: 'Payment option selected successfully',
    data: purchase,
  };
};
