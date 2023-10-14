require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { dbConnect } = require('./utils/db.mongo');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const orderRoutes = require('./routes/order.routes');
const parcelRoutes = require('./routes/parcel.routes');
const typeRoutes = require('./routes/type.routes');

dbConnect();
const app = express();
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Korria Headless CMS API',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Atang F Mokamogo',
        url: 'http://atangfino.tech',
        email: 'atangfmokamogo@outlook.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./routes/*.routes.js'],
};

const specs = swaggerJsdoc(options);
app.use(
  '/korria-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
}));

/** Routes */
app.use(authRoutes);
app.use(projectRoutes);
app.use(orderRoutes);
app.use(parcelRoutes);
app.use(typeRoutes);

// setup server to listen on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log('Server is live on port 8080');
});
