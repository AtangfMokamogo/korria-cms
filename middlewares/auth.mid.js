require('dotenv').config();
const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      res.status(401).send({ status: 'Failed', message: 'Missing token' });
    }
    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.KORRIA_TOKENIZER_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error in verifyToken function', error);
    if (error.message === 'jwt expired') {
      res.status(403).send({ message: 'Token expired please login again' });
    }
    if (error.message === 'invalid signature') {
      res.status(403).send({ status: 'Failed', message: error.message });
    }
    if (error.message === 'invalid token') {
      res.status(403).send({ status: 'Failed', message: error.message });
    }
    if (error.message === 'jwt malformed') {
      res.status(403).send({ status: 'Failed', message: error.message });
    }
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = verifyToken;
