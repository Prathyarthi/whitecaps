import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';
config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(morgan('dev'));
app.use(cookieParser());

import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import otherRoutes from './routes/otherRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1', otherRoutes);

app.all('*', (_req, res) => {
    res.status(404).send('OOPS!!! 404 Page Not Found');
});

app.use(errorMiddleware);

export default app;
