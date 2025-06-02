
import mongoose from 'mongoose';
import { processCreateCar, processUpdateCar, processDeleteCar } from './cars';
import { Manager } from '../models/manager';
import { Category } from '../models/category';
import { CustomError } from '../error/CustomError';
import { Car } from '../models/car';

// Mock the mongoose models
jest.mock('src/core/models/car', () => ({
  __esModule: true,
  Car: function() {
    return {
      save: jest.fn().mockResolvedValue({
        _id: 'mock-id',
        brand: 'Toyota',
        carModel: 'RAV4',
        price: 35000,
        year: 2023,
        available: true
      })
    };
  }
}));

jest.mock('src/core/models/category');
jest.mock('src/core/models/manager');

describe('Car Controller - Create Car', () => {
  // Setup sample data
  const mockManagerId = 'manager-id';
  const mockCategoryId = 'category-id';
  
  const mockManager = {
    _id: mockManagerId,
    name: 'Test Manager',
    email: 'manager@test.com'
  };

  const mockCategory = {
    _id: mockCategoryId,
    name: 'SUV'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a car successfully', async () => {
    // Setup mocks
    Manager.findById = jest.fn().mockResolvedValue(mockManager);
    Category.findById = jest.fn().mockResolvedValue(mockCategory);

    // Execute
    const result = await processCreateCar(
      {
        brand: 'Toyota',
        carModel: 'RAV4',
        price: 35000,
        year: 2023
      } as any,
      mockManagerId,
      mockCategoryId as any
    );

    // Assert
    expect(Manager.findById).toHaveBeenCalledWith(mockManagerId);
    expect(Category.findById).toHaveBeenCalledWith(mockCategoryId);
    expect(result).toEqual({
      message: 'Car created successfully',
      data: expect.anything()
    });
  });

  it('should throw error if manager not found', async () => {
    // Setup mocks
    Manager.findById = jest.fn().mockResolvedValue(null);
    
    // Execute & Assert
    await expect(
      processCreateCar(
        {
          brand: 'Toyota',
          carModel: 'RAV4',
          price: 35000,
          year: 2023
        } as any,
        mockManagerId,
        mockCategoryId as any
      )
    ).rejects.toThrow(CustomError);
    
    expect(Manager.findById).toHaveBeenCalledWith(mockManagerId);
    expect(Category.findById).not.toHaveBeenCalled();
  });

  it('should throw error if category not found', async () => {
    // Setup mocks
    Manager.findById = jest.fn().mockResolvedValue(mockManager);
    Category.findById = jest.fn().mockResolvedValue(null);
    
    // Execute & Assert
    await expect(
      processCreateCar(
        {
          brand: 'Toyota',
          carModel: 'RAV4',
          price: 35000,
          year: 2023
        } as any,
        mockManagerId,
        mockCategoryId as any
      )
    ).rejects.toThrow(CustomError);
    
    expect(Manager.findById).toHaveBeenCalledWith(mockManagerId);
    expect(Category.findById).toHaveBeenCalledWith(mockCategoryId);
  });
});

describe('Car Controller - Update Car', () => {
  // Setup sample data
  const mockCarId = 'car-id-123';
  const mockCar = {
    _id: mockCarId,
    brand: 'Toyota',
    carModel: 'RAV4',
    price: 35000,
    year: 2023,
    available: true
  };

  const updatedCar = {
    ...mockCar,
    price: 38000,
    year: 2024
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a car successfully', async () => {
    // Setup mocks
    Car.findById = jest.fn().mockResolvedValue(mockCar);
    Car.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedCar);

    const updateData = { 
      price: 38000,
      year: 2024
    };

    // Execute
    const result = await processUpdateCar(mockCarId, updateData);

    // Assert
    expect(Car.findById).toHaveBeenCalledWith(mockCarId);
    expect(Car.findByIdAndUpdate).toHaveBeenCalledWith(mockCarId, updateData, { new: true });
    expect(result).toEqual({
      message: 'Car updated successfully',
      data: updatedCar
    });
  });

  it('should throw error if car not found for update', async () => {
    // Setup mocks
    Car.findById = jest.fn().mockResolvedValue(null);
    
    const updateData = { price: 38000 };

    // Execute & Assert
    await expect(
      processUpdateCar(mockCarId, updateData)
    ).rejects.toThrow(CustomError);
    
    expect(Car.findById).toHaveBeenCalledWith(mockCarId);
    expect(Car.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});

describe('Car Controller - Delete Car', () => {
  // Setup sample data
  const mockCarId = 'car-id-123';
  const mockCar = {
    _id: mockCarId,
    brand: 'Toyota',
    carModel: 'RAV4',
    price: 35000,
    year: 2023,
    available: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a car successfully', async () => {
    // Setup mocks
    Car.findByIdAndDelete = jest.fn().mockResolvedValue(mockCar);

    // Execute
    const result = await processDeleteCar(mockCarId);

    // Assert
    expect(Car.findByIdAndDelete).toHaveBeenCalledWith(mockCarId);
    expect(result).toEqual({
      message: 'Car deleted successfully',
      data: null
    });
  });

  it('should throw error if car not found for deletion', async () => {
    // Setup mocks
    Car.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    
    // Execute & Assert
    await expect(
      processDeleteCar(mockCarId)
    ).rejects.toThrow(CustomError);
    
    expect(Car.findByIdAndDelete).toHaveBeenCalledWith(mockCarId);
  });
});