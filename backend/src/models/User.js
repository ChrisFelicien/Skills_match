import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const passwordValidator = function (password) {
  // At least one number, one letter, and one special character
  const regex =
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide name'],
      minlength: [3, 'Name must have at least 3 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Provide name'],
      minlength: [3, 'Name must have at least 3 characters'],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true, //Save always in lower case
      validator: {
        validate: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    password: {
      type: String,
      select: false,
      minlength: [8, 'Password must have at least 8 characters'],
      validate: {
        validator: passwordValidator,
        message: 'password must have number, letter and special characters',
      },
    },
    skills: {
      type: [String],
    },
    role: {
      type: String,
      enum: ['admin', 'client', 'freelancer'],
      default: 'freelancer',
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    location: {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.passwordBeenChanged = function (JWTTimeStamp) {
  if (!this.passwordChangedAt) return;

  return this.passwordChangedAt.getTime() / 1000 > JWTTimeStamp;
};

export default mongoose.model('User', UserSchema);
