require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { connectToRabbitMQ, consumeEvent } = require('./utils/rabbitmq');
const searchRoutes = require('./routes/search-routes');
const { handlePostCreated, handlePostDeleted } = require('./eventHandler/search-event-handler');


const app = express();
const PORT = process.env.PORT || 3004;

// connect to mongodb
mongoose.connect(process.env.MONGODB_URL)
    .then(() => logger.info('connected to mongodb'))
    .catch((e) => logger.error('Mongo connection error', e));

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request Body, ${req.body}`);
    next();
})

//*** HomeWork - Implement Ip based rate limiting for sensititve endpoints */

//*** HomeWork - pass redisClient as part of your req -> */



app.use('/api/search', searchRoutes);

app.use(errorHandler)

async function startServer() {
    try {
        await connectToRabbitMQ();

        // consume the events or subscribe to the events
        await consumeEvent('post.created', handlePostCreated);
        await consumeEvent('post.deleted', handlePostDeleted);

        app.listen(PORT, () => {
            logger.info(`search service running on port ${PORT}`)
        })
    } catch (error) {
        logger.error(error, 'Failed to start search service');
        process.exit(1);
    }
}

startServer();

// unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
    logger.error('unhandled Rejection at ', promise, 'reason : ', reason)
})