const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const globalErrorHandler = require('./common-functionality/error');
const AppError = require('./common-functionality/appError');
const { consoleHandler, checkNecessaryCases, checkUndefinedNull} = require('./common-functionality/commonFunc');
const i18n = require('./i18n.config');
const cors = require("cors");
const {initiateRedisClient} = require("./common-functionality/redis-handler");

// Register all the routes here
const redisAPIsRoutes = require('./routes/redis-apis');
const {initializeEncryption} = require("./common-functionality/security-methods");
const {startRefreshRedisDataCronJob} = require("./common-functionality/cron-jobs");

/**
 * This method initiates the Redis Server
 */
setTimeout(() => {

    // Check if Redis is available and enabled --------
    initiateRedisClient();
    // ------------------------------------------------

    // Set up the CRON Jobs ------------
    // --------------------------------
    consoleHandler('\n-------------- CRON JOBS --------------');
    consoleHandler(`1. Refresh data in Redis Cache: ${process.env.REFRESH_DATA_IN_REDIS}`);
    consoleHandler('---------------------------------------\n');

    // Check and start the CRON Jobs only those with '1' as value from the .env file
    if (checkUndefinedNull(process.env.REFRESH_DATA_IN_REDIS)) {
        if (!isNaN(Number(process.env.REFRESH_DATA_IN_REDIS)) && Number(process.env.REFRESH_DATA_IN_REDIS) === 1){
            startRefreshRedisDataCronJob();
        }
    }

    // Initiate encryption initialization
    initializeEncryption();

}, 200);

/**
 * Set up the languages here
 */
consoleHandler('-------------- LANGUAGES --------------');
consoleHandler('Supported languages: ', i18n.getLocales());
consoleHandler(`Selected Language: ${i18n.getLocale()}`);
consoleHandler('---------------------------------------');

/**
 * Security Headers Set
 */
app.use(helmet());

/**
 * First for all requests check the headers
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );

    // Continue to the next middleware
    next();
});

/**
 * Parse the body on POST requests
 */
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

/**
 * Max JSON Limits
 */
app.use(express.json({limit: 50000000}));
app.use(express.urlencoded({ extended: false, limit: 50000000}));

/**
 * Data Sanitization against XSS (Cross Site Scripting Attacks)
 */
app.use(xss());

/**
 * CORS POLICIES MIDDLEWARE
 */
app.use(cors());

/**
 * Rate Limit - 300 Requests per minute
 */
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 1000,
    message: 'Too Many Requests inside one minute.',
});

/**
 * The Limiter affects all routes
 */
app.use('/api', limiter);

/**
 * Navigate to redis API if the path is /api/v1/redis/...
 */
app.use('/api/v1/redis', redisAPIsRoutes.router);

/**
 * ------------ ROUTE ERROR HANDLING -------------
 * IF THE CONTROL REACHES THIS POINT, IT MEANS THAT THE REQUESTED
 * ROUTE WAS NOT FOUND ANYWHERE ABOVE
 */
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
})

/**
 * ------------ GENERAL ERROR HANDLING -------------
 */
app.use(globalErrorHandler)

/**
 * Export now the app
 */
module.exports = app;
