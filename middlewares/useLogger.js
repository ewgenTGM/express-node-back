import logger from '../logger.js';

export default function useLogger(req, res, next) {
	try {
		const logEntry = {
			method: req.method,
			url: req.url,
			query: req.query,
			body: req.body,
			cookies: req.cookies,
		};
		logger.info(JSON.stringify(logEntry, null, 2));
	} catch (error) {}
	next();
}
