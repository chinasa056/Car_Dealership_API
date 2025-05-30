import { IManager, RegisterManagerResponse } from "../interfaces/manager";
import { Manager } from "../models/manager";
import bcrypt from 'bcrypt'


export const processManagerRegistratin = async (body: IManager): Promise<RegisterManagerResponse> => {
    const manager = await Manager.findOne({ email: body.email });

    if (manager) {
        throw new Error(`manager with email: ${body.email} already exist`)
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