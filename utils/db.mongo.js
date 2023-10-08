const mongoose = require('mongoose');

const dbConnect = () => {
  try {
    mongoose.connect('mongodb://localhost:27017/korriadb', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('connected to db');
  } catch (error) {
    console.error(error);
  }
  process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection', error.message);
  });
};

module.exports = {
  dbConnect,
};
