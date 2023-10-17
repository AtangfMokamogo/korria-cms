require('dotenv').config();
const fs = require('fs');
const express = require('express');
const YAML = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const { dbConnect } = require('./utils/db.mongo');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const orderRoutes = require('./routes/order.routes');
const parcelRoutes = require('./routes/parcel.routes');
const typeRoutes = require('./routes/type.routes');

const swaggerJsdoc = YAML.load(fs.readFileSync('./api.yaml', 'utf8'));

dbConnect();
const app = express();
app.use(
  '/korria-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc, { explorer: true }),
);

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
}));

/** Routes */
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/users/projects', projectRoutes);
app.use('/api/v1/users/projects', orderRoutes);
app.use('/api/v1/users/projects', parcelRoutes);
app.use('/api/v1/users/projects', typeRoutes);

// setup server to listen on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log('Server is live on port 8080');
});
