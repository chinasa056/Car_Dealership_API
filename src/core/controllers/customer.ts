import setting from "../config/application";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import { CustomError } from "../error/CustomError";
import { CustomerLoginRequest, ICustomer, RegisterCustomerResponse, LoginCustomerResponse } from "../interfaces/customer";
import { Car } from "../models/car";
import { Customer } from "../models/customer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const processCustomerRegistration = async (
  body: ICustomer
): Promise<RegisterCustomerResponse> => {
  const customerExist = await Customer.findOne({ email: body.email.toLowerCase() });

  if (customerExist) {
    throw new CustomError("User with this email already exist", ErrorCode.CONFLICT, HttpStatus.CONFLICT);
  };

  const saltPassword = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(body.password, saltPassword);

  const newCustomer = await Customer.create({
    name: body.name,
    email: body.email.toLowerCase(),
    password: hashPassword,
    phone: body.phone
  });

  return { message: "Customer registration successful", data: newCustomer };
};

export const processCustomerLogin = async (body: CustomerLoginRequest): Promise<LoginCustomerResponse> => {
  const customer = await Customer.findOne({ email: body.email.toLowerCase() });

  if (!customer) {
    throw new CustomError('Email or password incorrect', ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);
  };

  const customerPassword: string = customer.password;
  const isPassword = await bcrypt.compare(body.password, customerPassword);

  if (!isPassword) {
    throw new CustomError('Wrong password', ErrorCode.CONFLICT, HttpStatus.CONFLICT);
  };

  const token = jwt.sign({ userId: customer._id, email: customer.email }, setting.jwt.secret, { expiresIn: '1day' });

  console.log('login successful');

  const result: LoginCustomerResponse = {
    name: customer.name,
    email: customer.email,
    token: token
  };

  return result;
};
