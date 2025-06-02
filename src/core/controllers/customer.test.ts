import { 
  processCustomerRegistration, 
  processCustomerLogin 
} from './customer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/customer';
import { CustomError } from '../error/CustomError';
import setting from '../config/application';

// Mock dependencies
jest.mock('src/core/models/customer', () => ({
  __esModule: true,
  Customer: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  genSaltSync: jest.fn().mockReturnValue('mockedSalt'),
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-jwt-token')
}));

jest.mock('src/core/config/application', () => ({
  __esModule: true,
  default: {
    jwt: {
      secret: 'test-secret'
    }
  }
}));

describe('Customer Controller - Registration', () => {
  const mockCustomerData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '1234567890'
  };

  const mockCreatedCustomer = {
    _id: 'customer-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    password: 'hashedPassword'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a customer successfully', async () => {
    // Setup mocks
    Customer.findOne = jest.fn().mockResolvedValue(null); // No existing customer
    Customer.create = jest.fn().mockResolvedValue(mockCreatedCustomer);

    // Execute
    const result = await processCustomerRegistration(mockCustomerData as any);

    // Assert
    expect(Customer.findOne).toHaveBeenCalledWith({ email: mockCustomerData.email });
    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(mockCustomerData.password, 'mockedSalt');
    expect(Customer.create).toHaveBeenCalledWith({
      name: mockCustomerData.name,
      email: mockCustomerData.email,
      password: 'hashedPassword',
      phone: mockCustomerData.phone
    });
    expect(result).toEqual({
      message: 'Customer registration successful',
      data: mockCreatedCustomer
    });
  });

  it('should throw error if customer already exists', async () => {
    // Setup mocks
    Customer.findOne = jest.fn().mockResolvedValue(mockCreatedCustomer); // Existing customer

    // Execute & Assert
    await expect(
      processCustomerRegistration(mockCustomerData as any)
    ).rejects.toThrow(CustomError);

    expect(Customer.findOne).toHaveBeenCalledWith({ email: mockCustomerData.email });
    expect(Customer.create).not.toHaveBeenCalled();
  });
});

describe('Customer Controller - Login', () => {
  const mockLoginData = {
    email: 'john@example.com',
    password: 'password123'
  };

  const mockCustomer = {
    _id: 'customer-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login a customer successfully', async () => {
    // Setup mocks
    Customer.findOne = jest.fn().mockResolvedValue(mockCustomer);
    bcrypt.compare = jest.fn().mockResolvedValue(true); // Password matches

    // Execute
    const result = await processCustomerLogin(mockLoginData);

    // Assert
    expect(Customer.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockCustomer.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockCustomer._id, email: mockCustomer.email },
      setting.jwt.secret,
      { expiresIn: '1day' }
    );
    expect(result).toEqual({
      name: mockCustomer.name,
      email: mockCustomer.email,
      token: 'mocked-jwt-token'
    });
  });

  it('should throw error if customer email not found', async () => {
    // Setup mocks
    Customer.findOne = jest.fn().mockResolvedValue(null); // Customer not found

    // Execute & Assert
    await expect(
      processCustomerLogin(mockLoginData)
    ).rejects.toThrow(CustomError);

    expect(Customer.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw error if password is incorrect', async () => {
    // Setup mocks
    Customer.findOne = jest.fn().mockResolvedValue(mockCustomer);
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Password doesn't match

    // Execute & Assert
    await expect(
      processCustomerLogin(mockLoginData)
    ).rejects.toThrow(CustomError);

    expect(Customer.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockCustomer.password);
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
