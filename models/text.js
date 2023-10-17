const mongoose = require('mongoose');

const { Schema } = mongoose;

const textTypeSchema = new Schema({
  title: {
    type: String,
    require: [true, 'Text title not defined'],
  },
  data_type: {
    type: String,
    required: [true, 'Data type not defined'],
  },
  payload: {
    type: String,
    required: [true, 'Text payload not defined'],
  },
  tags: {
    type: [String],
  },
  project: {
    type: String,
  },
  order: {
    type: String,
  },
  createdon: {
    type: Date,
    default: Date.now,
  },

});
module.exports = mongoose.model('TextType', textTypeSchema);
