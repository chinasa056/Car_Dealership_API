import { Schema, model } from 'mongoose';
import { IManager } from '../interfaces/manager';

const managerSchema = new Schema<IManager>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager'], default: 'manager' },
}, {
  timestamps: true
});

export const Manager = model<IManager>('Manager', managerSchema);
