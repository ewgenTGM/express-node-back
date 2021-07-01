import express from 'express';
import cors from 'cors';
import config from 'config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from './logger.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import defaultRouter from './routers/defaultRouter.js';
import useLogger from './middlewares/useLogger.js';
import useAuth from './middlewares/useAuth.js';
import injectCurrentUser from './middlewares/injectCurrentUser.js';

const app = express();

const PORT = process.env.PORT || config.get('PORT');

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/user', injectCurrentUser, useAuth, userRouter);
app.use('/auth', injectCurrentUser, useLogger, authRouter);
app.use(defaultRouter);

async function start() {
	const DB_URL = config.get('DB_URL');
	try {
		await mongoose.connect(DB_URL, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: true,
			useUnifiedTopology: true,
		});
		logger.info('MongoDB is connected');
		app.listen(PORT, () => {
			logger.info(`Application started on port ${PORT}`);
		});
	} catch (e) {
		logger.error(e.message);
	}
}

start();
