import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { initDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (request, response) => {
    response.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const startServer = async () => {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();