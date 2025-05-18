import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название товара обязательно'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Описание товара обязательно'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Цена товара обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  oldPrice: {
    type: Number,
    min: [0, 'Старая цена не может быть отрицательной']
  },
  category: {
    type: String,
    required: [true, 'Категория товара обязательна']
  },
  sizes: {
    type: [String],
    required: [true, 'Хотя бы один размер обязателен'],
    validate: {
      validator: function(sizes: string[]) {
        return sizes.length > 0;
      },
      message: 'Должен быть указан хотя бы один размер'
    }
  },
  heights: {
    type: [String],
    default: []
  },
  color: {
    name: {
      type: String,
      required: [true, 'Название цвета обязательно']
    },
    code: {
      type: String,
      required: [true, 'Код цвета обязателен'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Неверный формат кода цвета. Используйте HEX формат (#RRGGBB или #RGB)'
      }
    }
  },
  images: {
    type: [String],
    required: [true, 'Хотя бы одно изображение обязательно'],
    validate: {
      validator: function(images: string[]) {
        return images.length > 0;
      },
      message: 'Должно быть загружено хотя бы одно изображение'
    }
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true, // Автоматически обновляет createdAt и updatedAt
  toJSON: { virtuals: true }, // Включаем виртуальные поля при преобразовании в JSON
  toObject: { virtuals: true } // Включаем виртуальные поля при преобразовании в объект
});

// Middleware для обновления updatedAt перед сохранением
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Виртуальное поле для идентификатора
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Индексы для оптимизации запросов
productSchema.index({ category: 1 });
productSchema.index({ isNewProduct: 1 });
productSchema.index({ isSale: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Метод для проверки, является ли товар новинкой
productSchema.methods.isNew = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt >= thirtyDaysAgo;
};

// Метод для проверки наличия скидки
productSchema.methods.hasDiscount = function() {
  return this.isSale && this.oldPrice > this.price;
};

// Метод для расчета процента скидки
productSchema.methods.getDiscountPercentage = function() {
  if (!this.isSale || !this.oldPrice) return 0;
  return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
};

// Проверяем существование модели перед созданием новой
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;