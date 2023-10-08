const mongoose = require('mongoose');

const { Schema } = mongoose;

/** Define the users schema */
const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'fullname not provided'],
  },
  email: {
    type: String,
    required: [true, 'email not provided'],
    unique: [true, 'email already exists in database'],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastlogin: {
    type: Date,
  },
});

module.exports = mongoose.model('User', userSchema);
