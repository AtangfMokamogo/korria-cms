/**
 * Order Schema.
 * An Order is a collection of content model types(Parcels)
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Collection name missing'],
  },
  tags: {
    type: [String],
  },
  project: {
    type: String,
  },
  createdon: {
    type: Date,
    default: Date.now,
  },
  createdby: {
    type: String,
  },
  parcels: {
    type: [String],
  },
  permissions: {
    type: String,
    default: 'Admin',
  },

});

module.exports = mongoose.model('Orders', orderSchema);
