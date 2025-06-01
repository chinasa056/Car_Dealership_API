import { NextFunction, RequestHandler } from "express";
import { processDeleteManager, processManagerLogin, processManagerRegistratin, processUpdateManager } from "core/controllers/manager";
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

export const updateManagerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { managerId } = req.params;
    const result = await processUpdateManager(managerId, req.body);
    res.status(200).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

export const deleteManagerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { managerId } = req.params;
    const result = await processDeleteManager(managerId);
    res.status(200).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};
