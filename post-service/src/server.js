require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const cors = require('cors');
const helmet = require('helmet');
const postRoutes = require('./routes/post-routes')
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { connectToRabbitMQ } = require('./utils/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3002;

// connect to database
mongoose.connect(process.env.MONGODB_URL)
    .then(() => logger.info('Connected to mongodb'))
    .catch((e) => logger.error('Mongo connection error', e));

// Redis connection
const redisClient = new Redis(process.env.REDIS_URL);

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request Body, ${req.body}`);
    next();
});

///*** implement Ip based rate limiting for sensitive endpoints */


// routes -> pass redisClient to routes
app.use('/api/posts', (req, res, next) => {
    req.redisClient = redisClient;
    next();
}, postRoutes)

app.use(errorHandler);


async function startServer() {
    try {
        await connectToRabbitMQ();
        app.listen(PORT, () => {
            logger.info(`post service running on port ${PORT}`)
        })
    } catch (error) {
        logger.error('Failed to connect to server', error);
        process.exit(1);
    }
}

startServer();



// unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
    logger.error('unhandled Rejection at ', promise, 'reason : ', reason)
})
