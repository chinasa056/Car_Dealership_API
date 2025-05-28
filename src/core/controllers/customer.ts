import { ICustomer, RegisterCustomerResponse } from "../interfaces/customer";
import { Customer } from "../models/customer";
import bcrypt from 'bcrypt';

export const processCustomerRegistration = async (
  body: ICustomer
): Promise<RegisterCustomerResponse> => {
  const customerExist = await Customer.findOne({ email: body.email });

  if (customerExist) {
    throw new Error("User with this email already exist");
  }

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
