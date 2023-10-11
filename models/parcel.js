/**
 * Parcels define the types of content eg a blog article
 * They have fields which define the individual pieces of data that make the content type
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const fieldSchema = new Schema({
  fields: {
    type: [Object],
    required: [true, 'The Parcel has no defined Fields'],
  },
});

const parcelSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Parcel Type Not Defined'],
  },
  project: {
    type: String,
    required: [true, 'Parcel does not define a project name'],
  },
  schema: {
    type: fieldSchema,
    required: [true, 'Parcel Has No Defined Fields'],
  },
  tags: {
    type: [String],
  },
  createdby: {
    type: String,
  },
  createdon: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Parcels', parcelSchema);
