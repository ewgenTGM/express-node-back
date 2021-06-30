import Logger from 'simple-node-logger';

const log_options = {
	logFilePath: 'mylogfile.log',
	timestampFormat: 'YYYY-MM-DD HH:mm:ss',
};

export default Logger.createSimpleLogger(log_options);
