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
    required: [true, 'Image slug not defined'],
  },
  createdon: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('ImageType', imageTypeSchema);
// module.exports = mongoose.model('TextType', textTypeSchema);
