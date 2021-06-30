import { ResponseModel } from '../models/ResponseModel.js';
import { validationResult } from 'express-validator';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

function generateAccessToken(id, email) {
	const payload = { id, email };
	return jwt.sign(payload, config.get('SECRET_KEY'), { expiresIn: '30s' });
}

export function decodeToken(token) {
	const decoded = jwt.decode(token);
	if (decoded) {
		return decoded;
	}
	return null;
}

class AuthController {
	async register(req, res) {
		const response = new ResponseModel();
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				errors
					.array()
					.forEach((error) => response.errors.push(error.msg));
				response.success = false;
				return res.status(400).json(response);
			}
			const { email, password } = req.body;
			if (await User.findOne({ email })) {
				response.success = false;
				response.errors.push(`User ${email} already exist`);
				return res.status(400).json(response);
			}
			const hash = await bcrypt.hash(password, 6);
			const user = new User({ email: email, password: hash });
			await user.save();
			response.messages.push(`User ${email} created`);
			res.status(200).json(response);
		} catch (e) {
			response.errors.push(e.message);
			res.status(400).json(response);
		}
	}

	async login(req, res) {
		const response = new ResponseModel();
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
				response.success = false;
				response.errors.push(`Неверный пользователь и (или) пароль`);
				return res.status(400).json(response);
			}
			const passCompare = await bcrypt.compare(password, user.password);
			if (!passCompare) {
				response.success = false;
				response.errors.push(`Неверный пользователь и (или) пароль`);
				return res.status(400).json(response);
			}
			const token = generateAccessToken(user._id, user.email);
			response.data = { token };
			response.messages.push('Login success');
			res.json(response);
		} catch (e) {
			response.errors.push(e.message);
			res.status(400).json(response);
		}
	}

	async me(req, res) {
		const response = new ResponseModel();
		try {
			if (req.currentUser) {
				response.data = req.currentUser.email;
			}
			res.status(400).json(response);
		} catch (e) {
			response.errors.push(e.message);
			res.status(400).json(response);
		}
	}

	async logout(req, res) {
		const response = new ResponseModel();
		res.clearCookie('access_token');
		response.messages.push('Logout success');
		res.json(response);
		try {
		} catch (e) {
			response.errors.push(e.message);
			res.status(400).json(response);
		}
	}
}

export default new AuthController();
