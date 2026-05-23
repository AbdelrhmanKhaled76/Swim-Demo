import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // ownerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Admin', // Commented out reference to Admin for now
  // }
});

export default mongoose.model('Organization', organizationSchema);
