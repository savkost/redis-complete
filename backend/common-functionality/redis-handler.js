const Redis = require('redis');
const catchAsync = require("./catchAsync");
const {consoleHandler, checkUndefinedNull} = require('../common-functionality/commonFunc');
const {checkNecessaryCases} = require("./commonFunc");

// Redis Client
let redisClient;
let isConnected = false;

/**
 * This method creates and connects the client
 * Runs if enabled by ENV Variable
 * @type {(function(*, *, *): void)|*}
 */
exports.initiateRedisClient = async () => {

    // Check if Redis is available and enabled
    const REDIS_ENABLED = process.env.REDIS_ENABLED;
    if (checkUndefinedNull(REDIS_ENABLED) && Number(REDIS_ENABLED) === 1) {

        consoleHandler('\n-------------- REDIS --------------');
        consoleHandler(`Redis Enabled: ${REDIS_ENABLED}`);
        consoleHandler('-----------------------------------\n');

        // Create the Redis Client
        const port = checkUndefinedNull(process.env.REDIS_PORT)? Number(process.env.REDIS_PORT) : 6379;
        consoleHandler(`Connect to port: ${port}`);
        redisClient = await Redis.createClient({
            url: process.env.REDIS_HOST + port
        });

        // Connect to the Redis Client
        try {
            await redisClient.connect();
            consoleHandler('Connection to Redis client successful');

            // Set isConnected to true
            isConnected = true;

        } catch (err) {
            consoleHandler('Connection to Redis client failed with error: ', err);
        }
    }
};

/**
 * This method checks if the Redis client is connected
 */
exports.checkIfRedisClientIsConnected = () => {
    return isConnected;
}

/**
 * This method sets and stores data to the cache
 * @param keyTag
 * @param ttlOfData
 * @param dataToStore
 */
exports.setItemToCache = async (keyTag, ttlOfData, dataToStore) => {

    // Console the data to store
    consoleHandler('----------------------------------------------');
    consoleHandler(`Key tag of data: ${keyTag}`);
    consoleHandler(`TTL: ${ttlOfData}`);
    consoleHandler('Data to store to cache: ', dataToStore);
    consoleHandler('----------------------------------------------');

    // Set the data to the Redis cache
    await redisClient.setEx(keyTag, ttlOfData, JSON.stringify(dataToStore));
}

/**
 * This method sets and stores data to the cache
 * @param keyTag
 * @param dataToStore
 */
exports.setItemToCacheNoTTL = async (keyTag, dataToStore) => {

    // Console the data to store
    consoleHandler('----------------------------------------------');
    consoleHandler(`Key tag of data: ${keyTag}`);
    consoleHandler('Data to store to cache: ', dataToStore);
    consoleHandler('----------------------------------------------');

    // Set the data to the Redis cache
    await redisClient.set(keyTag, JSON.stringify(dataToStore));
}

/**
 * This method retrieves data from the Redis Cache
 * @param keyTag
 * @returns {Promise<void>}
 */
exports.retrieveItemFromCache = async (keyTag) => {

    // Check data existence on Redis
    const dataOnRedis = await redisClient.get(keyTag);
    if (checkUndefinedNull(dataOnRedis)){
        return JSON.parse(dataOnRedis);
    } else {
        return null;
    }
}

/**
 * This method deletes an item from the Redis Cache
 * @param keyTag
 * @returns {Promise<number>}
 */
exports.deleteItemFromCache = async (keyTag) => {

    // Check the existence of the keyTag
    if (checkNecessaryCases(keyTag)){

        // Check the existence of the key in the Redis Cache
        const existsInCache = await redisClient.exists(keyTag);
        if (existsInCache === 1){

            // Delete from Redis Cache
            return await redisClient.del(keyTag);

        } else {
            return 0;
        }

    } else {
        return 0;
    }
}

/**
 * This method retrieves all the keys from the Redis Cache
 * (OPTIONAL) withTTL: If true, then the TTL of each key is included in the response
 * @param withTTL
 * @returns {Promise<void>}
 */
exports.getAllKeysFromCache = async (withTTL) => {

    // Retrieve all the keys from cache
    const allRedisKeys = await redisClient.keys('*');
    consoleHandler('All Redis Keys response: ', allRedisKeys);

    // Set the response array
    let responseArray = [];
    if (checkUndefinedNull(allRedisKeys) && Array.isArray(allRedisKeys) && allRedisKeys.length > 0){
        responseArray = allRedisKeys.map((key) => {
            return {keyName: key};
        });
    }

    // If withTTL then find for every key the TTL and return it with the response
    if (checkUndefinedNull(withTTL) && withTTL){
        if (checkUndefinedNull(allRedisKeys) && Array.isArray(allRedisKeys) && allRedisKeys.length > 0){

            // Erase the info on responseArray
            responseArray = [];

            for (let keyFound of allRedisKeys){

                // Find the TTL of each key
                const TTL_KEY = await redisClient.ttl(keyFound);

                // Set the response for each key
                responseArray.push({
                    keyName: keyFound,
                    ttl: TTL_KEY
                });
            }
        }
    }

    // Return the response
    return responseArray;
}

/**
 * This method removes ALL keys from the Redis Cache
 * @returns {Promise<void>}
 */
exports.removeAllKeysFromCache = async () => {

    // First retrieve and count all the keys
    const allRedisKeys = await redisClient.keys('*');
    consoleHandler('All Redis Keys response: ', allRedisKeys);

    // Flush all
    const flushAllResponse = await redisClient.flushAll('ASYNC');
    consoleHandler('Flush all response: ', flushAllResponse);

    // Return the response
    return {
        keysDeleted: allRedisKeys.length,
        response: flushAllResponse
    };
}

/**
 *
 * @param keysToDelete
 * @returns {Promise<void>}
 */
exports.deleteListOfItemsFromCache = async (keysToDelete) => {

    // Delete the specified keys from Redis
    return await redisClient.del(keysToDelete);
}
