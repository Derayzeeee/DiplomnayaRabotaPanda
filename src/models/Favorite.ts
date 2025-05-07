// models/Favorite.ts
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, {
  timestamps: true
});

// Создаем составной индекс для оптимизации поиска
favoriteSchema.index({ userId: 1 });

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);

export default Favorite;