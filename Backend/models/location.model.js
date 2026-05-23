import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  type: {
    type: String,
    enum: ['Warehouse', 'Store'],
    required: true,
  },
  locationDetails: {
    type: String, 
  }
});

export default mongoose.model('Location', locationSchema);
