import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ "Owner", "StoreManager"],
      default: "Owner",
    },
    rank: {
      type: String,
      enum: ["senior-logistics", "inventory-manager", "operations-lead", "system-admin", "analyst"],
      default: "inventory-manager",
    },
    bio: {
      type: String,
      default: "",
    },
    organizationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    assignedLocation: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Location",
     default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
