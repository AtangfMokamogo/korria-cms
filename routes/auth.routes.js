/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - password
 *       properties:
 *         fullname:
 *           type: string
 *           description: User fullname
 *         email:
 *           type: string
 *           description: User's registered email
 *         password:
 *           type: string
 *           description: The password for user
 *       example:
 *         fullname: ALX tester
 *         email: tester@mail.com
 *         password: 1234asdf
 *
 *     Login:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *          type: string
 *          description: The state of the request
 */

/**
 * @swagger
 * tags:
 *   name: Authentication and Authorization
 *   description: Endpoints that manage user creation and login
 * /register:
 *   post:
 *     summary: Create a new book
 *     tags: [Authentication and Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: The created user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 *
 */
const express = require('express');

const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.signup);
router.post('/login', AuthController.signin);

module.exports = router;
