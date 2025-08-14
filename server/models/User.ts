import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    smsAlerts: boolean;
    emailAlerts: boolean;
    language: string;
    currency: string;
  };
  profile: {
    bio?: string;
    occupation?: string;
    company?: string;
    website?: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  verification: {
    emailToken?: string;
    phoneToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    emailChangeToken?: string;
    emailChangeExpires?: Date;
    pendingEmail?: string;
  };
  loginHistory: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
    location?: string;
  }>;
  lastLogin?: Date;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "Nepal" },
      zipCode: String,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      smsAlerts: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
      language: { type: String, default: "en" },
      currency: { type: String, default: "NPR" },
    },
    profile: {
      bio: String,
      occupation: String,
      company: String,
      website: String,
      socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String,
      },
    },
    verification: {
      emailToken: String,
      phoneToken: String,
      resetPasswordToken: String,
      resetPasswordExpires: Date,
      emailChangeToken: String,
      emailChangeExpires: Date,
      pendingEmail: String,
    },
    loginHistory: [
      {
        ip: String,
        userAgent: String,
        timestamp: { type: Date, default: Date.now },
        location: String,
      },
    ],
    lastLogin: Date,
    lastActivity: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Update lastActivity on save
userSchema.pre("save", function (next) {
  this.lastActivity = new Date();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate auth token method
userSchema.methods.generateAuthToken = function (): string {
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = process.env.JWT_SECRET || "kanxasafari_jwt_secret_key";

  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verification;
  return user;
};

export default mongoose.model<IUser>("User", userSchema);
