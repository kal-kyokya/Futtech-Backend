import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    this.client.on('error', (err) => {
      console.error(err);
      this.isClientConnected = false;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    return asyncGet(key);
  }

  async set(key, value, duration) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    await asyncSet(key, duration, value);
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
