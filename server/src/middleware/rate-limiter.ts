import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // Временной интервал в MS
    max: 60, // Количество запросов
    message: 'Request limit reached',
    standardHeaders: true,
    legacyHeaders: false,
});