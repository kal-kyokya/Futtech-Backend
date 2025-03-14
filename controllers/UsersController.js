// This is a Script containing a class whose methods handle API routes
import crypto-js from 'crypto-js';
import User from '../models/User';

export default class UsersController {
  /**
   * Creates a new user by saving their username, email and password
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async createNewUser(req, res) {
    // Validate the 'username' sent
    const username = req.body ? req.body.username : null;
    if (!username) {
      res.status(400).send({ error: 'Missing username' });
      return;
    }

    // Validate the 'email' sent
    const email = req.body ? req.body.email : null;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
      return;
    }

    // Validate the 'password' sent
    const password = req.body ? req.body.password : null;
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
      return;
    }

    const user = await User.findOne({ email });

    // Verify that the 'email' not in Database
    if (user && user.email === email) {
      res.status(400).send({ error: 'Email already in use' });
      return;
    }

    // Hash 'password' using 'AES'
    const hashedPwd = crypto-js.AES.encrypt(
	password, 
	process.env.PASSWORD_KEY
    ).toString();

    // Save 'new user' to MongoDB
    const newUser = new User({
	username,
	email,
	password: hashedPwd
    });

    const { password, ...details } = newUser._doc;

    // Return all user data except the password
    res.status(200).send(details);
  }

  /**
   * Retrieves the user based on the token in the request object
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async getMe(req, res) {
    const { user } = req;
    return res.send({ id: user._id.toString(), email: user.email });
  }
}
