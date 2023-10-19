const mongoose = require('mongoose');

const { Schema } = mongoose;
const textFieldSchema = new Schema({
  title: {
    type: String,
    require: [true, 'Text title not defined'],
  },
  type: {
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

const textObjectSchema = new Schema({
  type: textFieldSchema,
  required: [true, 'The text has no defined field schema'],
});

const textTypeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Provide the name of the text document'],
  },
  schema: {
    type: textObjectSchema,
    required: [true, 'Provide a valid text object schema'],
  },

});
module.exports = mongoose.model('TextType', textTypeSchema);
