// File containing endpoints authenticating a user
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import User from '../models/User';
import crypto-js from 'crypto-js';
import jwt from 'jsonwebtoken';

export default class AuthController {
  /**
   * Sign in a user by generating a new Auth Token
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async signingIn(req, res) {
    // Sign in a user using 'Basic Authentication'
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Extract user information from the encoded header
    const credentials = Buffer.from(header.split(' ')[1], 'base64').toString('utf-8');
    // const credentials = header.split(' ')[1];
    const email = credentials.split(':')[0];

    // Ensure the DB contains a user with the input email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    user.password !== crypto-js.AES.encrypt(
	credentials.split(':')[1],
	process.env.PASSWORD_KEY
    ) && return res.status(401).send({ error: 'Unauthorized' });

    // Generate an Auth Token and associate it to the user
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id, 86400);
    return res.status(200).send({ token });
  }

  /**
   * Sign out a user based on an Auth Token
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async signingOut(req, res) {
    const { key } = req.key;
    await redisClient.del(key);
    return res.status(204).send({});
  }
}
