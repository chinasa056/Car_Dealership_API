import { RequestHandler } from "express";
import { processDeleteManager, processManagerLogin, processManagerRegistratin } from "src/core/controllers/manager";
import { responseHandler } from "src/core/helpers/utilities";

export const registerManager: RequestHandler = async (req, res, next) => {
    try {
      
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

export const deleteManagerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { managerId } = req.params;
    const result = await processDeleteManager(managerId);
    res.status(200).json(responseHandler(result, 'Account deleted successfully'));
  } catch (error) {
    next(error);
  }
};
