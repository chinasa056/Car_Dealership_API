// src/models/Manager.ts
import { Schema, model, Document } from 'mongoose';

export interface IManager extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
}

const managerSchema = new Schema<IManager>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager'], default: 'manager' },
}, {
  timestamps: true
});

export const Manager = model<IManager>('Manager', managerSchema);
