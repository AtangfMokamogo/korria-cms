require('dotenv').config();
const express = require('express');
const { dbConnect } = require('./utils/db.mongo');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

dbConnect();
const app = express();

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
}));

/** Routes */
app.use(authRoutes);
app.use(projectRoutes);
// setup server to listen on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log('Server is live on port 8080');
});
