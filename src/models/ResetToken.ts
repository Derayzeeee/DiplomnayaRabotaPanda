import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 3600000) // токен на 1 час
  }
});

// Автоматически удалять просроченные токены
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ResetToken = mongoose.models.ResetToken || mongoose.model('ResetToken', resetTokenSchema);