import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  // itemId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Item', 
  // },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  }
});

 export default mongoose.model('Inventory', inventorySchema);
