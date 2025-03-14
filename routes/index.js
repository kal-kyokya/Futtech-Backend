// This file contain all the app's API endpoints
import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import UsersController from '../controllers/UsersController';
import VideosController from '../controllers/VideosController';

/**
 * Function routing endpoints to request handlers
 * @param { Object } app - Express server instance
 */
export default function routing(app) {
  // Create a router instance for all 'user' API endpoints
  const userRouter = new Router();

  // Mount the router on '/users' and all subsequent paths
  app.use('/users', userRouter);

  // UsersController
  userRouter.post('/signUp', UsersController.createNewUser);
  userRouter.get('/me', AuthMiddleware.loginRequired, UsersController.getMe);
  userRouter.get('/all', AuthMiddleware.loginRequired, UsersController.getAll);
  userRouter.get('/stats', AuthMiddleware.loginRequired, UsersController.getStats);
  userRouter.put('/:id', AuthMiddleware.loginRequired, UsersController.updateUser);
  userRouter.delete('/:id', AuthMiddleware.loginRequired, UsersController.deleteUser);

  // Create a router instance for all 'authentication' API endpoints
  const authRouter = new Router();

  // Mount the router on '/auth' and all subsequent paths
  app.use('/auth', authRouter);

  // AuthController
  authRouter.get('/signIn', AuthController.signingIn);
  authRouter.get('/signOut', AuthMiddleware.loginRequired, AuthController.signingOut);

  // Create a router instance for all 'video' API endpoints
  const videoRouter = new Router();

  // Mount the router on '/auth' and all subsequent paths
  app.use('/videos', videoRouter);

  // VideosController
  videoRouter.post('/', VideosController.createNewUser);
  videoRouter.get('/me', AuthMiddleware.loginRequired, VideosController.getMe);
  videoRouter.get('/all', AuthMiddleware.loginRequired, VideosController.getAll);
  videoRouter.get('/stats', AuthMiddleware.loginRequired, VideosController.getStats);
  videoRouter.put('/:id', AuthMiddleware.loginRequired, VideosController.updateUser);
  videoRouter.delete('/:id', AuthMiddleware.loginRequired, VideosController.deleteUser);
}
