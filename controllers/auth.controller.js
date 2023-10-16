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
        console.log(result);
        res.status(201).send({
          status: 'Success',
          created_at: result.created,
          id: result._id,
          email: result.email,
          role: result.role,
        });
      },
    ).catch(
      (error) => {
        if (error.code === 11000) {
          res.status(400).send({ status: 'Failed', message: `email ${req.body.email} exists` });
        }
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
      res.status(401).send({ status: 'Failed', message: `email: ${req.body.email} is not registered` });
    }

    /** Validate password and issue token if valid */
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        status: 'Failed',
        message: 'Password Invalid!',
        token: null,
      });
    }

    const userToken = jwt.sign(
      { firstname: user.fullname, email: user.email },
      process.env.KORRIA_TOKENIZER_SECRET,
      { expiresIn: '24h' },
    );
    return res.status(200).send({
      status: 'Success',
      message: 'User Logged in',
      token: userToken,
      User: {
        name: user.fullname,
        email: user.email,
      },
    });
  }
}

module.exports = AuthController;
