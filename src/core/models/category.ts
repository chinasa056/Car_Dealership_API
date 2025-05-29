// src/models/Category.ts
import { Schema, model } from 'mongoose';
import { ICategory } from '../interfaces/category';

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, {
  timestamps: true
});

export const Category = model<ICategory>('Category', categorySchema);
