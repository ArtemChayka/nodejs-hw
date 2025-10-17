import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Видаляємо пароль із об'єкта перед відправкою у відповідь
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// При створенні користувача встановлюємо username таким самим як email
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

export const User = model('User', userSchema);
