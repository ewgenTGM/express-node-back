import config from 'config';
import jwt from 'jsonwebtoken';

export class TokenError extends Error {}

class TokenService {
	constructor() {
		try {
			this.secretKey = config.get('SECRET_KEY');
		} catch (error) {
			throw new TokenError(
				'Token service unable to get secret key fron config: ' +
					error.message
			);
		}
	}

	generateAccessToken(payload) {
		return jwt.sign(payload, config.get('SECRET_KEY'), {
			expiresIn: config.get('ACCESS_TOKEN_EXPIRIES_IN'),
		});
	}

	decodeToken(token) {
		try {
			return jwt.verify(token, this.secretKey);
		} catch (error) {
			throw new TokenError('Unable to verify token: ' + error.message);
		}
	}
}

export default new TokenService();
