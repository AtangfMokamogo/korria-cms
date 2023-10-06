require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

/**
 * This class defines controllers that handle user account creation, validation and authorisation
 * @class
 */
class AuthController {
  /**
    * This function creates a new user in database [i.e Account Sign Up]
    */
  static async signup(req, res) {
    /** create a new user by obtaining credentials from request */
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    /** Attempt to save the new user to database */
    user.save(user).then(
      (result) => {
        res.status(201).send({ message: 'User Registered Succesfully', date: result.created });
      },
    ).catch(
      (error) => {
        res.status(500).send({ message: error });
      },
    );
  }

  /**
   * This function logs a user into the api.
   * @returns sends a response containing user auth token if successfully logged in
   */
  static async signin(req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send({ message: 'User Not Found' });
    }

    /** Validate password and issue token if valid */
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        token: null,
        message: 'Password Invalid!',
      });
    }

    const userToken = jwt.sign(
      { firstname: user.firstname, email: user.email },
      process.env.KORRIA_TOKENIZER_SECRET,
      { expiresIn: '24h' },
    );
    return res.status(200).send({
      User: {
        name: user.fullname,
        email: user.email,
      },
      message: 'Successful Login',
      token: userToken,
    });
  }
}

module.exports = AuthController;
