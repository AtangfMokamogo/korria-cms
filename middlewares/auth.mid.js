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
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = verifyToken;
