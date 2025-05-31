import { Car } from "src/core/models/car";
import { Category } from "src/core/models/category";
import { Manager } from "src/core/models/manager";
import { CustomError } from "src/core/error/CustomError";
import { ErrorCode } from "src/core/enum/error";
import { HttpStatus } from "src/core/enum/httpCode";

import {
  CreateCarRequest,
  CreateCarResponse,
  GetAllCarsResponse,
  GetSingleCarResponse,
  DeleteCarResponse,
  UpdateCarRequest,
  UpdateCarResponse,
  CarFilters,
} from "src/core/interfaces/car";

export const processCreateCar = async (
  body: CreateCarRequest,
  userId: string,
  categoryId: string
): Promise<CreateCarResponse> => {
  const manager = await Manager.findById(userId);
  if (!manager) {
    throw new CustomError("Manager not found", ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  };

  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    throw new CustomError("Category not found", ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  };

  const newCar =new Car({
    category: categoryExists,
      brand: body.brand,
      carModel: body.carModel,
      price: body.price,
      year: body.year
  });

  await newCar.save();

  return {
    message: "Car created successfully",
    data: newCar,
  };
};

export const processUpdateCar = async (
  id: string,
  body: UpdateCarRequest
): Promise<UpdateCarResponse> => {
  const car = await Car.findById(id);
  if (!car) {
    throw new CustomError(`Car with ID ${id} not found`, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  };

  if (body.category) {
    const category = await Category.findById(body.category);
    if (!category) {
      throw new CustomError("Provided category not found", ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  const updatedCar = await Car.findByIdAndUpdate(id, body, { new: true });

  return {
    message: "Car updated successfully",
    data: updatedCar!,
  };
};

export const processDeleteCar = async (id: string): Promise<DeleteCarResponse> => {
  const car = await Car.findByIdAndDelete(id);
  if (!car) {
    throw new CustomError(`Car with ID ${id} not found`, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  return {
    message: "Car deleted successfully",
    data: null,
  };
};

export const processGetCarById = async (id: string): Promise<GetSingleCarResponse> => {
  const car = await Car.findById(id).populate("category");
  if (!car) {
    throw new CustomError(`Car with ID ${id} not found`, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  return {
    message: "Car fetched successfully",
    data: car,
  };
};

// export const processGetAllCars = async (
//   filters: CarFilters,
//   page: number,
//   limit: number
// ): Promise<GetAllCarsResponse> => {
//   const query: any = {};

//   if (filters.brand) {
//     query.brand = { $regex: filters.brand, $options: "i" };
//   }

//   if (filters.carModel) {
//     query.carModel = { $regex: filters.carModel, $options: "i" };
//   }

//   if (filters.minPrice || filters.maxPrice) {
//     query.price = {};
//     if (filters.minPrice) query.price.$gte = filters.minPrice;
//     if (filters.maxPrice) query.price.$lte = filters.maxPrice;
//   }

//   if (filters.available !== undefined) {
//     query.available = filters.available;
//   }

//   const total = await Car.countDocuments(query);
//   const cars = await Car.find(query)
//     .populate("category")
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .sort({ createdAt: -1 });

//   return {
//     message: "Cars fetched successfully",
//     data: cars,
//     pagination: {
//       total,
//       page,
//       limit,
//       pages: Math.ceil(total / limit),
//     },
//   };
// };
