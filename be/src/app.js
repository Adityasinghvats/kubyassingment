import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './utils/auth.js';
import userRoutes from './routes/userRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { logger } from './utils/logger.js';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';

const app = express();

app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/slots', slotRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

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

app.use(errorHandler)

export { app };