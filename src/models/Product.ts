import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: undefined },
  category: { type: String, required: true },
  sizes: [{ type: String }],
  colors: [{
    name: { type: String, required: true },
    code: { type: String, required: true }
  }],
  images: [{ type: String }],
  isNewProduct: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true }
}, {
  timestamps: true
});

productSchema.pre('save', function(next) {
  if (this.isModified('isSale')) {
    if (this.isSale && !this.oldPrice) {
      this.oldPrice = this.price;
    } else if (!this.isSale) {
      this.oldPrice = undefined;
    }
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;