import mongoose from 'mongoose';
import { 
  processCreateCategory, 
  processGetAllCategories, 
  processDeleteCategory 
} from './categories';
import { Category } from '../models/category';
import { Manager } from '../models/manager';
import { CustomError } from '../error/CustomError';

// Mock the mongoose models
jest.mock('src/core/models/category', () => ({
  __esModule: true,
  Category: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn()
  }
}));

jest.mock('src/core/models/manager', () => ({
  __esModule: true,
  Manager: {
    findById: jest.fn()
  }
}));

describe('Category Controller - Create Category', () => {
  // Setup sample data
  const mockManagerId = 'manager-id-123';
  const mockCategory = {
    _id: 'category-id-123',
    name: 'SUV'
  };
  
  const mockManager = {
    _id: mockManagerId,
    name: 'Test Manager',
    email: 'manager@test.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a category successfully', async () => {
    // Setup mocks
    Manager.findById = jest.fn().mockResolvedValue(mockManager);
    Category.findOne = jest.fn().mockResolvedValue(null); // No existing category
    Category.create = jest.fn().mockResolvedValue(mockCategory);

    // Execute
    const result = await processCreateCategory(
      { name: 'SUV' } as any,
      mockManagerId
    );

    // Assert
    expect(Manager.findById).toHaveBeenCalledWith({ _id: mockManagerId });
    expect(Category.findOne).toHaveBeenCalledWith({ name: 'suv' }); // Should check lowercase name
    expect(Category.create).toHaveBeenCalledWith({ name: 'SUV' });
    expect(result).toEqual({
      message: 'Category created successfully',
      data: mockCategory
    });
  });

  it('should throw error if manager not found', async () => {
    // Setup mocks
    Manager.findById = jest.fn().mockResolvedValue(null);
    
    // Execute & Assert
    await expect(
      processCreateCategory(
        { name: 'SUV' } as any,
        mockManagerId
      )
    ).rejects.toThrow(CustomError);
    
    expect(Manager.findById).toHaveBeenCalledWith({ _id: mockManagerId });
    expect(Category.findOne).not.toHaveBeenCalled();
    expect(Category.create).not.toHaveBeenCalled();
  });

  it('should throw error if category already exists', async () => {
    // Setup mocks
    Manager.findById = jest.fn().mockResolvedValue(mockManager);
    Category.findOne = jest.fn().mockResolvedValue(mockCategory); // Existing category
    
    // Execute & Assert
    await expect(
      processCreateCategory(
        { name: 'SUV' } as any,
        mockManagerId
      )
    ).rejects.toThrow(CustomError);
    
    expect(Manager.findById).toHaveBeenCalledWith({ _id: mockManagerId });
    expect(Category.findOne).toHaveBeenCalledWith({ name: 'suv' });
    expect(Category.create).not.toHaveBeenCalled();
  });
});

describe('Category Controller - Get All Categories', () => {
  // Setup sample data
  const mockCategories = [
    { _id: 'category-id-1', name: 'SUV' },
    { _id: 'category-id-2', name: 'Sedan' },
    { _id: 'category-id-3', name: 'Truck' }
  ];

  const mockSelectFunction = jest.fn().mockResolvedValue(mockCategories);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all categories successfully', async () => {
    // Setup mocks
    Category.find = jest.fn().mockReturnValue({
      select: mockSelectFunction
    });

    // Execute
    const result = await processGetAllCategories();

    // Assert
    expect(Category.find).toHaveBeenCalled();
    expect(mockSelectFunction).toHaveBeenCalledWith('name');
    expect(result).toEqual({
      message: 'Categories fetched successfully',
      data: mockCategories
    });
  });

  it('should return empty array when no categories exist', async () => {
    // Setup mocks
    const emptySelectFunction = jest.fn().mockResolvedValue([]);
    Category.find = jest.fn().mockReturnValue({
      select: emptySelectFunction
    });

    // Execute
    const result = await processGetAllCategories();

    // Assert
    expect(Category.find).toHaveBeenCalled();
    expect(emptySelectFunction).toHaveBeenCalledWith('name');
    expect(result).toEqual({
      message: 'Categories fetched successfully',
      data: []
    });
  });
});

describe('Category Controller - Delete Category', () => {
  // Setup sample data
  const mockCategoryId = 'category-id-123';
  const mockCategory = {
    _id: mockCategoryId,
    name: 'SUV'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a category successfully', async () => {
    // Setup mocks
    Category.findByIdAndDelete = jest.fn().mockResolvedValue(mockCategory);

    // Execute
    const result = await processDeleteCategory(mockCategoryId);

    // Assert
    expect(Category.findByIdAndDelete).toHaveBeenCalledWith(mockCategoryId);
    expect(result).toEqual({
      message: 'Category deleted successfully',
      data: null
    });
  });

  it('should throw error if category not found for deletion', async () => {
    // Setup mocks
    Category.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    
    // Execute & Assert
    await expect(
      processDeleteCategory(mockCategoryId)
    ).rejects.toThrow(CustomError);
    
    expect(Category.findByIdAndDelete).toHaveBeenCalledWith(mockCategoryId);
  });
});