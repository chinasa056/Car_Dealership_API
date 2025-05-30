import { RequestHandler } from "express";
import { processManagerLogin, processManagerRegistratin } from "core/controllers/manager";
import { responseHandler } from "core/helpers/utilities";

export const registerManager: RequestHandler = async (req, res, next) => {
    try {
        console.log('request body', req.body);
        
        const manager = await processManagerRegistratin(req.body);
        res.json(responseHandler(manager, 'Manager created successfully'))
    } catch (error) {
        next(error)
    }
};

export const loginManager: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const response = await processManagerLogin(req.body);

    res.json(responseHandler(response, 'Manager successfully loggedIn'));
  } catch (error) {
    next(error);
  }
};
