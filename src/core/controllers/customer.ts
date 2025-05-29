import setting from "../config/application";
import { CustomerLoginRequest, ICustomer, RegisterCustomerResponse, LoginCustomerResponse } from "../interfaces/customer";
import { Customer } from "../models/customer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const processCustomerRegistration = async (
  body: ICustomer
): Promise<RegisterCustomerResponse> => {
  const customerExist = await Customer.findOne({ email: body.email });

  if (customerExist) {
    throw new Error("User with this email already exist");
  };

  const saltPassword = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(body.password, saltPassword);

  const newCustomer = await Customer.create({
    name: body.name,
    email: body.email,
    password: hashPassword,
    phone: body.phone
  });

  return { message: "Customer registration successful", data: newCustomer };
};

export const processCustomerLogin = async (body: CustomerLoginRequest): Promise<LoginCustomerResponse> => {
  const customer = await Customer.findOne({ email: body.email });

  if (!customer) {
    throw new Error('Email or password incorrect');
  };

  const customerPassword: string = customer.password;
  const isPassword = await bcrypt.compare(body.password, customerPassword);

  if (!isPassword) {
    throw new Error('Wrong password');
  };

  const token = jwt.sign({ userId: customer.id, email: customer.email }, setting.secret, { expiresIn: '1day' });

  console.log('login successful');

  const result: LoginCustomerResponse = {
    name: customer.name,
    email: customer.email,
    token: token
  };

  return result;
};
