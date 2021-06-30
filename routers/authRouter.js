import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.get('/me', authController.me);

authRouter.post(
	'/register',
	check('email', 'Некорректный email').isEmail(),
	check('password', 'Короткий пароль').isLength({ min: 8 }),
	authController.register
);

authRouter.post('/login', authController.login);

authRouter.delete('/login', authController.logout);

export default authRouter;
