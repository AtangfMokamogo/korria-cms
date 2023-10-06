require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');

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
const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
}));

/** Routes */
app.use(authRoutes);
// setup server to listen on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log('Server is live on port 8080');
});
