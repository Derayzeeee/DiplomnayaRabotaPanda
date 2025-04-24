import mongoose, { Model } from 'mongoose';

export interface Category {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

const CategoryModel = mongoose.models.Category || mongoose.model<Category>('Category', categorySchema);

export default CategoryModel as Model<Category>;