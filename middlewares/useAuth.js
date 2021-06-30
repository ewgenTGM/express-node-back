import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import config from 'config';

function getTokenFromHeader(req) {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(' ')[0] === 'Bearer'
	) {
		return req.headers.authorization.split(' ')[1];
	}
}

export default async function useAuth(req, res, next) {
	try {
		const token = getTokenFromHeader(req);
		if (token) {
			const verify = jwt.verify(token, config.get('SECRET_KEY'));
			const user = await User.findById(verify.id);
			if (user) {
				req.currentUser = user;
				return next();
			}
		}
		res.status(401).json({ message: 'You are not authorized' });
	} catch (error) {
		res.status(401).json({ message: 'You are not authorized' });
	}
}
