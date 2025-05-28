import { RequestHandler } from "express";
import { processCustomerRegistration } from "src/core/controllers/customer"

export const createCustomer: RequestHandler = async (req, res) => {
const customer = await processCustomerRegistration(req.body)
};