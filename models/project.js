const mongoose = require('mongoose');

const { Schema } = mongoose;

/** Define the users schema */
const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Project name not provided'],
  },
  createdby: {
    type: String,
  },
  createdon: {
    type: Date,
    default: Date.now,
  },
  permissions: {
    type: String,
    default: 'Admin',
  },
});

module.exports = mongoose.model('Projects', projectSchema);
