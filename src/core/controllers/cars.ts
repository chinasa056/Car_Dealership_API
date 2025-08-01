import { Car } from "src/core/models/car";
import { Category } from "src/core/models/category";
import { Manager } from "src/core/models/manager";
import { CustomError } from "src/core/error/CustomError";
import { ErrorCode } from "src/core/enum/error";
import { HttpStatus } from "src/core/enum/httpCode";

import {
  CreateCarResponse,
  DeleteCarResponse,
  UpdateCarRequest,
  FilterCarsRequest,
  PaginatedCarsResponse,
  ICar,
} from "src/core/interfaces/car";
import { Types } from "mongoose";
import cloudinary from "../config/cloudinary";


export const processCreateCar = async (
  body: ICar,
  userId: string,
  categoryId: Types.ObjectId,
  files: Express.Multer.File[]
): Promise<CreateCarResponse> => {
  const manager = await Manager.findById(userId);
  if (!manager) {
    throw new CustomError(
      "Manager not found",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }


  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    throw new CustomError(
      "Category not found",
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
  
  if (!files || files.length === 0) {
    throw new CustomError(
      "Please upload at least one car image",
      ErrorCode.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }

  const uploadedImages: { imageUrl: string; imagePublicId: string }[] = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "car_dealership/cars" },
      (error, result) => {
        if (error || !result) {
          throw new CustomError(
            `Cloudinary upload failed: ${error?.message || "Unknown error"}`,
            ErrorCode.SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
        uploadedImages.push({
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        });
      }
    );
  }


  const newCar = new Car({
    category: categoryId,
    brand: body.brand,
    carModel: body.carModel,
    price: body.price,
    year: body.year,
    images: uploadedImages,
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
): Promise<CreateCarResponse> => {
  const car = await Car.findById(id);
  if (!car) {
    throw new CustomError(`Car with ID ${id} not found`, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  };

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
  };

  return {
    message: "Car deleted successfully",
    data: null,
  };
};

export const processGetCarById = async (id: string): Promise<CreateCarResponse> => {
const car = await Car.findById(id)
  .select('-__v -createdAt -updatedAt')
  .populate('category', 'name'); 

  if (!car) {
    throw new CustomError(`Car with ID ${id} not found`, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  return {
    message: "Car fetched successfully",
    data: car,
  };
};


export const processGetALLCars = async (
  query: FilterCarsRequest
): Promise<PaginatedCarsResponse> => {
  const page = query.page || 1;
  const limit = query.limit || 5;
  const startIndex = (page - 1) * limit;

  const filters: any = {};
  if (query.brand) filters.brand = query.brand.toLowerCase();
  if (query.carModel) filters.carModel = query.carModel.toLowerCase();
  if (typeof query.available === 'boolean') filters.available = query.available;
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = query.minPrice;
    if (query.maxPrice) filters.price.$lte = query.maxPrice;
  }

  try {
    const total = await Car.countDocuments(filters);

    const cars = await Car.find(filters)
      .select('-__v -createdAt -updatedAt')
      .skip(startIndex)
      .limit(limit).populate('category', 'name');

    const totalPages = Math.ceil(total / limit);

    const pagination: any = {
      currentPage: page,
      totalPages,
      totalItems: total,
      results: cars,
    };

    if (page < totalPages) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (page > 1) {
      pagination.previous = {
        page: page - 1,
        limit,
      };
    }

    return {
      message: 'Cars retrieved successfully',
      data: pagination,
    };
  } catch (err) {
    throw new CustomError(
      'Failed to retrieve cars',
      ErrorCode.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
