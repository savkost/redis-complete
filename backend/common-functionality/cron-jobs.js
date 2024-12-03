const cron = require('node-cron');
const { consoleHandler } = require('./commonFunc');
const {checkIfRedisClientIsConnected, setItemToCacheNoTTL, constructJsonDataForStorage} = require("./redis-handler");
const {createRandomHex} = require("./security-methods");

// VARIABLES --------------------------------------------
// ------------------------------------------------------
const refreshRedisDataWithInterval = 24; // IN HOURS

// START CRON JOB TO REFRESH DATA IN REDIS
// RUNS EVERY 24 HOURS (ONCE EACH 24 HOURS)
exports.startRefreshRedisDataCronJob = () => {

    // Initialize the CRON Job
    cron.schedule(`0 0 */${refreshRedisDataWithInterval} * * *`, async function (done) {
        consoleHandler('\n----------------------------  CRON JOB - REFRESH REDIS CACHE DATA ----------------------------');
        consoleHandler(`Running every:  ${refreshRedisDataWithInterval} hours.`);
        consoleHandler('\n----------------------------  CRON JOB - REFRESH REDIS CACHE DATA ----------------------------');

        // Check if Redis Cache is enabled and connected
        if (checkIfRedisClientIsConnected()){

            // Now Time
            const nowTime = new Date().toISOString();

            // Generate an array with random data
            const arrayForStorage = [];
            let randomValue;

            let i = 0;
            while (i < 10){

                // Create a new random value
                randomValue = await createRandomHex();

                arrayForStorage.push(
                    {
                        id: i,
                        created_dt: new Date().toISOString(),
                        randomValue
                    }
                );
                i++;
            }

            // Construct the proper json data
            const dataForStorage = await constructJsonDataForStorage(arrayForStorage);

            // Store the generated array into Redis Cache
            await setItemToCacheNoTTL('random_array', dataForStorage);

            // Console the result of the CRON Job
            consoleHandler('\n--------------------------------------------------------');
            consoleHandler(`CRON Job 'startRefreshRedisDataCronJob' completed.`);
            consoleHandler('Generated array with values: ', arrayForStorage);
            consoleHandler(`Run at: ${nowTime}`);
            consoleHandler('--------------------------------------------------------\n');
        }
    });
}
