import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    industry: {
      type: String,
      default: 'Not Specified',
    },
    tier: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Organization', organizationSchema);