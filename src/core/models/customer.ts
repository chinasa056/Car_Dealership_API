import { Schema, model } from 'mongoose';
import { ICustomer } from '../interfaces/customer';

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {type: String, require: true},
  purchasesId: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
}, {
  timestamps: true
});

export const Customer = model<ICustomer>('Customer', customerSchema);
