import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './utils/auth';
import { errorHandler } from './middleware/errorMiddleware';
import { logger } from './utils/logger';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';

const app = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);


app.use(
    cors({
        origin: '*',
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

import userRoutes from './routes/user.router';
import slotRoutes from './routes/slot.router';
import bookingRoutes from './routes/booking.router';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.get('/api-docs.json', (req, res) => {
    const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const spec = { ...swaggerSpec, servers: [{ url: baseUrl }] };
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
});

// add flag or auth for api-docs endpoint in production
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
    swaggerOptions: { url: '/api-docs.json' }
}));


app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler)

export { app };