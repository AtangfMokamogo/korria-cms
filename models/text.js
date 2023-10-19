const mongoose = require('mongoose');

const { Schema } = mongoose;

const fieldContentSchema = new Schema({
  title: {
    type: String,
    require: [true, 'Text title not defined'],
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

const textTypeSchema = new Schema({
  fieldtype: {
    type: String,
    required: [true, 'Field type not defined'],
  },
  content: {
    type: fieldContentSchema,
    required: [true, 'Field content schema not defined'],
  },
});
module.exports = mongoose.model('TextType', textTypeSchema);
