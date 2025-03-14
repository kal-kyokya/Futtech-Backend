// This file contains a class whose methods handle
// any request linked to the app's functioning

// eslint-disable-next-line import/no-named-as-default
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  /**
   * Query the statuses of redis and MongoDB
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static getStatus(req, res) {
    const serverStatus = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).send(serverStatus);
  }

  /**
   * Query the number of users and files in the DB
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async getStats(req, res) {
    const dbStats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).send(dbStats);
  }
}
