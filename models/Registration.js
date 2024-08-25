const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
  },

  phone: {
    type: String,
    trim: true,
  },
  
  name: {
    type: String,
    trim: true,
  },

  preference: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Registration', registrationSchema);