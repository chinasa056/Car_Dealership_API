import { 
  processManagerRegistratin, 
  processManagerLogin 
} from './manager';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Manager } from '../models/manager';
import setting from '../config/application';
import { CustomError } from '../error/CustomError';

// Mock dependencies
jest.mock('src/core/models/manager', () => ({
  __esModule: true,
  Manager: {
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mockedSalt'),
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

describe('Manager Controller - Registration', () => {
  const mockManagerData = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  };

  const mockCreatedManager = {
    _id: 'manager-id-123',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedPassword',
    role: 'admin',
    save: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Manager constructor
    (Manager as any) = jest.fn().mockImplementation(() => mockCreatedManager);
  });

  it('should register a manager successfully', async () => {
    // Setup mocks
    Manager.findOne = jest.fn().mockResolvedValue(null); // No existing manager

    // Execute
    const result = await processManagerRegistratin(mockManagerData as any);

    // Assert
    expect(Manager.findOne).toHaveBeenCalledWith({ email: mockManagerData.email });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(mockManagerData.password, 'mockedSalt');
    expect(Manager).toHaveBeenCalledWith({
      name: mockManagerData.name,
      email: mockManagerData.email,
      password: 'hashedPassword'
    });
    expect(mockCreatedManager.save).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'New Manager successfully registered',
      data: mockCreatedManager
    });
  });

  it('should throw error if manager already exists', async () => {
    // Setup mocks
    Manager.findOne = jest.fn().mockResolvedValue(mockCreatedManager); // Existing manager

    // Execute & Assert
    await expect(
      processManagerRegistratin(mockManagerData as any)
    ).rejects.toThrow(CustomError);

    expect(Manager.findOne).toHaveBeenCalledWith({ email: mockManagerData.email });
    expect(Manager).not.toHaveBeenCalled();
  });
});

describe('Manager Controller - Login', () => {
  const mockLoginData = {
    email: 'admin@example.com',
    password: 'admin123'
  };

  const mockManager = {
    _id: 'manager-id-123',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedPassword',
    role: 'admin'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login a manager successfully', async () => {
    // Setup mocks
    Manager.findOne = jest.fn().mockResolvedValue(mockManager);
    bcrypt.compare = jest.fn().mockResolvedValue(true); // Password matches

    // Execute
    const result = await processManagerLogin(mockLoginData);

    // Assert
    expect(Manager.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockManager.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        user: {
          userId: mockManager._id,
          email: mockManager.email,
          role: mockManager.role
        }
      },
      setting.jwt.secret,
      { expiresIn: '1d' }
    );
    expect(result).toEqual({
      name: mockManager.name,
      email: mockManager.email,
      token: 'mocked-jwt-token'
    });
  });

  it('should throw error if manager email not found', async () => {
    // Setup mocks
    Manager.findOne = jest.fn().mockResolvedValue(null); // Manager not found

    // Execute & Assert
    await expect(
      processManagerLogin(mockLoginData)
    ).rejects.toThrow(CustomError);

    expect(Manager.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw error if password is incorrect', async () => {
    // Setup mocks
    Manager.findOne = jest.fn().mockResolvedValue(mockManager);
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Password doesn't match

    // Execute & Assert
    await expect(
      processManagerLogin(mockLoginData)
    ).rejects.toThrow(CustomError);

    expect(Manager.findOne).toHaveBeenCalledWith({ email: mockLoginData.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginData.password, mockManager.password);
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
