import { Types } from 'mongoose';
import { Car } from '../models/car';
import { Purchase } from '../models/purchase';
import { CustomError } from '../error/CustomError';
import { ErrorCode } from '../enum/error';
import { HttpStatus } from '../enum/httpCode';
import { Category } from '../models/category';
import { Customer } from '../models/customer';

export const processPurchaseCar = async (
  body: any, 
  carId: string,
  buyerId: Types.ObjectId
) => {

    const user = await Customer.findById(buyerId);  
    if(!user) {
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

  if ('quantity' in car && typeof car.quantity === 'number') {
    if (car.quantity < 1) {
      throw new CustomError(
        'Car is out of stock',
        ErrorCode.BAD_REQUEST,
        HttpStatus.BAD_REQUEST
      );
    }

    car.quantity -= 1;

    if (car.quantity <= 0) {
      car.available = false;
    }
  } else {
    car.available = false;
  };

  await car.save();
const category = await Category.findById(car.category._id);
  if (!category) { 
    throw new CustomError(
      'Category not found',
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }

  const purchase = await Purchase.create({
    buyer: buyerId,
    car: car._id,
    purchaseDate: new Date(),
    priceSold: car.price,
    quantity: body.quantity || 1,
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

export const getPurchaseDetails = async (purchaseId: string) => {
  
}
