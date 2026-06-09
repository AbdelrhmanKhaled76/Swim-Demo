import mongoose from 'mongoose';

const transactionItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unitPrice: {
    type: Number,
    default: 0
  }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sale', 'transfer', 'restock', 'dump'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'usd'
  },
  stripePaymentIntentId: {
    type: String,
    default: null
  },
  stripeRefundId: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  fromLocationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  toLocationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  relatedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  items: {
    type: [transactionItemSchema],
    default: []
  },
  notes: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
