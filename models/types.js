const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageTypeSchema = new Schema({
  title: {
    type: String,
    require: [true, 'Image title not defined'],
  },
  data_type: {
    type: String,
    required: [true, 'Data type not defined'],
  },
  src: {
    type: String,
    required: [true, 'Image slug not defined'],
  },
  alt: {
    type: String,
    required: [true, 'Image alt text not define'],
  },
  project: {
    type: String,
    required: [true, 'Image project name not defined'],
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
  title: {
    type: String,
    require: [true, 'Image title not defined'],
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

module.exports = mongoose.model('ImageField', imageTypeSchema);
module.exports = mongoose.model('TextType', textTypeSchema);
