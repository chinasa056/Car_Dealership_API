import { RequestHandler } from "express";
import { processCustomerLogin, processCustomerRegistration } from "src/core/controllers/customer"
import { responseHandler } from "src/core/helpers/utilities";

export const createCustomer: RequestHandler = async (req, res, next) => {
    try {
         const customer = await processCustomerRegistration(req.body);
    res.json(responseHandler(customer, 'Customer creatd successfully'))
    } catch (error) {
        next(error)
    };
};


export const loginCustomer: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const response = await processCustomerLogin(req.body);

    res.json(responseHandler(response, 'Customer successfully loggedIn'));
  } catch (error) {
    next(error);
  }
};

