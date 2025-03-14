// This file contains a class protecting routes that require login or logout
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthMiddleWare {
  /**
   * Ensures the request comes from a logged in user
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   * @param { function } next - Function relaying control
   */
  static async loginRequired(req, res, next) {
    // Extract the Authentication token and make a key
    const token = req.headers['x-token'];
    const key = `auth_${token}`;

    // Validate login status
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Query user from DB and append it to the request object
    const user = await (await dbClient.client.db()).collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    req.user = user;

    // Append the key to the request object and relay control
    req.key = key;
    return next();
  }

  /**
   * Ensure the request comes from a logged out user
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   * @param { function } next - Function relaying control
   */
  static async logoutRequired(req, res, next) {
    if (req.headers['x-token']) {
      return res.redirect('/users/me');
    }
    return next();
  }
}
