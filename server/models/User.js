import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide a name"] },
    email: { type: String, required: [true, "Please provide an email"], unique: true, lowercase: true },
    phone: { type: String, required: [true, "Please provide a phone number"] },
    password: { type: String, required: [true, "Please provide a password"], minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
    address: { type: String, default: "" },
    company: { type: String, default: "" }, // Added
    bio: { type: String, default: "" }, // Added
    emailVerificationCode: String, // Added
    emailVerificationExpires: Date, // Added
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);