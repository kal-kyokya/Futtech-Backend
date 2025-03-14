// This file contain all the app's API endpoints
import { Router } from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import UsersController from '../controllers/UsersController';
import PostsController from '../controllers/PostsController';

/**
 * Function routing endpoints to request handlers
 * @param { Object } app - Express server instance
 */
export default function routing(app) {
  // Create a router instance
  const router = new Router();

  // Mount the router on '/' and all subsequent paths
  app.use('/', router);

  // AppController
  router.get('/status', AppController.getStatus);
  router.get('/stats', AppController.getStats);

  // UsersController
  router.post('/users/signUp', UsersController.createNewUser);
  router.get('/users/me', AuthMiddleware.loginRequired, UsersController.getMe);
  router.get('/users/all', AuthMiddleware.loginRequired, UsersController.getAll);
  router.put('/users/:id', AuthMiddleware.loginRequired, UsersController.updateUser);
  router.delete('/users/:id', AuthMiddleware.loginRequired, UsersController.deleteUser);

  // AuthController
  router.get('/signIn', AuthController.signingIn);
  router.get('/signOut', AuthMiddleware.loginRequired, AuthController.signingOut);

  // PostController
  router.post('/newPost', AuthMiddleware.loginRequired, PostsController.addNewPost);
  router.get('/viewpost/:post_id', PostsController.viewPost);
}
