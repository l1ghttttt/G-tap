import winston from "winston";

const logger = winston.createLogger({
    //level: 'warn',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'src/logs/info.log', level: 'info' }),
    ],
});

export default logger;