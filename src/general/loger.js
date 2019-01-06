import winston from 'winston'

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ]
})

export const httpLogger = (req, res, next) => {
    const startAt = new Date()

    next()

    logger.silly([
        req.method,
        req.url,
        res.statusCode,
        new Date() - startAt, 'ms'
    ].join(' '))
}