import pino from 'pino';

export const logger = pino({
    redact: ["DATABASE_CONNECTION"],
    transport: {
        target: 'pino-pretty',
    },
    level: 'debug',
});