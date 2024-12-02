const {translateText} = require('../common-functionality/language-translation');
const {checkNecessaryCases, checkUndefinedNull, consoleHandler} = require('../common-functionality/commonFunc');
const AppError = require('../common-functionality/appError');
const catchAsync = require('../common-functionality/catchAsync');
const {checkIfRedisClientIsConnected, getAllKeysFromCache, retrieveItemFromCache, deleteItemFromCache,
  removeAllKeysFromCache, deleteListOfItemsFromCache, setItemToCache, setItemToCacheNoTTL
} = require("../common-functionality/redis-handler");
const {encryptInputData} = require("../common-functionality/security-methods");

// REDIS - GET ALL KEYS
// THIS API RETURNS ALL THE REDIS STORED KEYS
// (OPTIONAL) withTTL
exports.retrieveAllRedisKeys = catchAsync(async (req, res, next) => {

  // Extract the withTTL parameter
  const withTTL = req.query.withTTL;
  consoleHandler(`With TTL: ${withTTL}`);

  // Check withTTL
  let searchWithTTL = false;
  if (checkNecessaryCases(withTTL)){
    searchWithTTL = withTTL === '1';
  }

  // Retrieve all the keys from Redis Cache
  // Check if redis is allowed and connected
  if (checkIfRedisClientIsConnected()){

    const allRedisKeys = await getAllKeysFromCache(searchWithTTL);

    // Return the success response
    res.status(200).json({
      status: 200,
      message: translateText(req, 'redis_all_keys_retrieved_successfully'),
      rows: allRedisKeys.length,
      data: allRedisKeys
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - GET SINGLE KEY DATA
exports.getSpecificKeyData = catchAsync(async (req, res, next) => {

  // Retrieve the key from the query parameters
  const key = req.params.key;
  if (!checkNecessaryCases(key)){
    return next(new AppError(translateText(req, 'provide_key_for_search'), 400));
  }

  if (checkIfRedisClientIsConnected()){

    // Find Specific Data by key
    const findDataByKey = await retrieveItemFromCache(key);

    // Return the response
    res.status(200).json({
      status: 200,
      message: translateText(req, 'search_in_redis_completed'),
      rows: checkUndefinedNull(findDataByKey)? 1 : 0,
      data: checkUndefinedNull(findDataByKey)? [findDataByKey] : []
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - CREATE KEYS-VALUE
exports.createKeyValue = catchAsync(async (req, res, next) => {

  const {key, actualData, ttl} = req.body;

  // 0. Console the body for creating a new key-value pair in Redis
  consoleHandler('Create new key-value pair body:', {key, actualData, ttl});

  // 1. Check key and actualData existence
  if (!checkNecessaryCases(key) || !checkUndefinedNull(actualData)){
    return next(new AppError(translateText(req, 'missing_data_for_redis_create_key_value'), 400));
  }

  // 2. Check if redis client is connected
  if (checkIfRedisClientIsConnected()){

    // 3. Store the data into Redis Cache
    if (checkUndefinedNull(ttl)){

      // Confirm that TTL is a number
      if (!Number(ttl)){
        return next(new AppError(translateText(req, 'ttl_redis_must_be_number'), 400));
      }

      // Set data with TTL
      await setItemToCache(key, ttl, actualData);

    } else {
      // No TTL
      await setItemToCacheNoTTL(key, actualData);
    }

    // Return the success response
    res.status(200).json({
      status: 200,
      message: translateText(req, 'store_data_to_redis_success'),
      data: []
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - COUNT ALL KEYS
exports.countKeys = catchAsync(async (req, res, next) => {

  if (checkIfRedisClientIsConnected()){

    const allRedisKeys = await getAllKeysFromCache(false);

    // Return the success response
    res.status(200).json({
      status: 200,
      message: translateText(req, 'count_redis_keys_completed_successfully'),
      rows: allRedisKeys.length,
      data: []
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - DELETE MULTIPLE KEYS
exports.deleteMultipleKeys = catchAsync(async (req, res, next) => {

  // Extract the keys list from the request
  let listOfKeys = [];
  if (checkUndefinedNull(req.body.listOfKeys) && Array.isArray(req.body.listOfKeys)){
    // Get the list of Keys to delete
    listOfKeys = req.body.listOfKeys;
  }

  // Check the list of Keys length
  if (listOfKeys.length === 0){
    return next(new AppError(translateText(req, 'no_list_keys_for_multiple_deletion_from_redis'), 400));
  }

  // Check if redis client is connected and continue
  if (checkIfRedisClientIsConnected()){

    // Delete the specified keys from cache
    const deleteKeysResponse = deleteListOfItemsFromCache(listOfKeys);
    consoleHandler('Delete multiple keys response: ', deleteKeysResponse);

    // Return the response
    res.status(200).json({
      status: 200,
      message: translateText(req, 'delete_multiple_keys_redis_success'),
      rows: listOfKeys.length,
      data: []
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - DELETE ALL KEYS
exports.deleteAllKeys = catchAsync(async (req, res, next) => {

  // Check if redis client is connected and continue
  if (checkIfRedisClientIsConnected()){

    // Delete all the keys and values from Redis Cache
    const removeAllKeysResponse = await removeAllKeysFromCache();
    consoleHandler('Delete all keys response: ', removeAllKeysResponse);

    // Return the success response
    res.status(200).json({
      status: 200,
      message: translateText(req, 'all_keys_deleted_from_redis'),
      data: [removeAllKeysResponse]
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - DELETE SINGLE KEY
exports.deleteSingleKey = catchAsync(async (req, res, next) => {

  // Retrieve the key from the query parameters
  const key = req.params.key;
  if (!checkNecessaryCases(key)){
    return next(new AppError(translateText(req, 'provide_key_for_search'), 400));
  }

  // Check if redis client is connected and continue
  if (checkIfRedisClientIsConnected()){

    const deleteKeyFromCache = await deleteItemFromCache(key);
    let deleteMessage = '';
    let statusReturn = 200;
    if (checkUndefinedNull(deleteKeyFromCache) && deleteKeyFromCache === 1){
      // Success deletion
      deleteMessage = translateText(req, 'delete_key_in_redis_success');
    } else {
      // Error in deletion
      deleteMessage = translateText(req, 'delete_key_in_redis_error');
      statusReturn = 500;
    }

    // Return the success response
    res.status(statusReturn).json({
      status: statusReturn,
      message: deleteMessage,
      data: []
    });

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - ENCRYPT AND SAVE DATA
exports.encryptAndSaveData = catchAsync(async (req, res, next) => {

  const {key, actualData, ttl} = req.body;

  // 0. Console the body for creating a new encrypted key-value pair in Redis
  consoleHandler('Create new (ENCRYPTED) key-value pair body:', {key, actualData, ttl});

  // 1. Check key and actualData existence
  if (!checkNecessaryCases(key) || !checkUndefinedNull(actualData)){
    return next(new AppError(translateText(req, 'missing_data_for_redis_create_key_value'), 400));
  }

  // 2. Check if redis client is connected
  if (checkIfRedisClientIsConnected()){

    // 3. Encrypt the data with AES256 Algorithm
    const encryptedData = await encryptInputData(JSON.stringify(actualData));
    if (encryptedData.completed){

      // 4. Store the data into Redis Cache
      if (checkUndefinedNull(ttl)){

        // Confirm that TTL is a number
        if (!Number(ttl)){
          return next(new AppError(translateText(req, 'ttl_redis_must_be_number'), 400));
        }

        // Set data with TTL
        await setItemToCache(key, ttl, encryptedData.encryptedResult);

      } else {
        // No TTL
        await setItemToCacheNoTTL(key, encryptedData.encryptedResult);
      }

      // Return the success response
      res.status(200).json({
        status: 200,
        message: translateText(req, 'encryption_and_storing_successful'),
        data: []
      });

    } else {
      // Return error response
      return next(new AppError(translateText(req, 'encryption_failed'), 400));
    }

  } else {
    return next(new AppError('Redis Cache is not supported or not connected.', 500));
  }
});

// REDIS - DECRYPT AND RETURN DATA
exports.decryptAndReturnData = catchAsync(async (req, res, next) => {

});