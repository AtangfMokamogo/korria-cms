require('dotenv').config();
const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.KORRIA_TOKENIZER_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error in verifyToken function', error);
    if (error.message === 'jwt expired') {
      res.status(403).send({ message: 'Token expired please login again' });
    }
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = verifyToken;
