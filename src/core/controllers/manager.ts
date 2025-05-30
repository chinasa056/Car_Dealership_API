import setting from "../config/application";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import { CustomError } from "../error/CustomError";
import { IManager, ManagerLoginRequest, ManagerLoginResponse, RegisterManagerResponse } from "../interfaces/manager";
import { Manager } from "../models/manager";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const processManagerRegistratin = async (body: IManager): Promise<RegisterManagerResponse> => {
    const manager = await Manager.findOne({ email: body.email });

    if (manager) {
        throw new CustomError(`manager with email: ${body.email} already exist`, ErrorCode.CONFLICT, HttpStatus.CONFLICT)
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(body.password, saltedRound);

    const newManager = new Manager({
        name: body.name,
        email: body.email,
        password: hashedPassword
    });

    await newManager.save();

    return { message: 'New Manager successfully registered', data: newManager };
};

export const processManagerLogin = async (body: ManagerLoginRequest): Promise<ManagerLoginResponse> => {
  const manager = await Manager.findOne({ email: body.email });

  if (!manager) {
    throw new CustomError('Email or password incorrect', ErrorCode.CONFLICT, HttpStatus.CONFLICT);
  };

  const managerPassword: string = manager.password;
  const isPassword = await bcrypt.compare(body.password, managerPassword);

  if (!isPassword) {
    throw new CustomError('Wrong password', ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);
  };

  const token = jwt.sign({ userId: manager.id, email: manager.email, role: manager.role }, setting.jwt.secret, { expiresIn: '1day' });

  console.log('login successful');

  const result: ManagerLoginResponse = {
    name: manager.name,
    email: manager.email,
    token: token
  };

  return result
};