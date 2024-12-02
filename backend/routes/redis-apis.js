const express = require('express');
const router = express.Router();
const redisController = require('../controllers/redis-controller');

// LIST OF SUPPORTED APIS ----------------------------------------------
// ---------------------------------------------------------------------
const API_LIST = {
  deleteMultipleKeys: {
    path: '/deleteMultipleKeys',
    method: 'POST'
  },
  deleteAllKeys: {
    path: '/deleteAllKeys',
    method: 'POST'
  },
  count: {
    path: '/count',
    method: 'GET'
  },
  encrypt:{
    path: '/encrypt',
    method: 'POST'
  },
  decrypt:{
    path: '/decrypt',
    method: 'GET'
  },
  slash: {
    path: '/',
    method: 'GET | POST'
  },
  slashID: {
    path: '/:key',
    method: 'GET | DELETE'
  }
};

// This method exports the API LIST
const retrieveAPIList = () => {
  return API_LIST;
};

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

router
  .route(API_LIST.deleteMultipleKeys.path)
  .post(redisController.deleteMultipleKeys);

router
  .route(API_LIST.deleteAllKeys.path)
  .delete(redisController.deleteAllKeys);

router
  .route(API_LIST.count.path)
  .get(redisController.countKeys);

router
    .route(API_LIST.encrypt.path)
    .post(redisController.encryptAndSaveData);

router
    .route(API_LIST.decrypt.path)
    .post(redisController.decryptAndReturnData);

router
  .route(API_LIST.slash.path)
  .get(redisController.retrieveAllRedisKeys)
  .post(redisController.createKeyValue);

router
  .route(API_LIST.slashID.path)
  .get(redisController.getSpecificKeyData)
  .delete(redisController.deleteSingleKey);


// EXPORT THE ROUTER
module.exports = {
  router,
  retrieveAPIList
};
