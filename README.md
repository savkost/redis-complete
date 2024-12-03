# redis-complete
This is a project related to Redis and some basic functionality such as setting, retrieval and data encryption.

What is Redis?

Redis [Redis at wikipedia](https://en.wikipedia.org/wiki/Redis) stands for **Remote Dictionary Server**. Redis is a distributed, **in-memory key-value database**, cache and message broker. All of the data are stored in memory and due to it's design, Redis offers low latency reads and writes. This feature can speed up the backend and the responses of the APIs by a large amount.

Redis is often used **in conjuction** with a DBMS such as MongoDB, mySQL, MSSQL and others.

Three things we have to keep in mind when using Redis:
- Redis stores all data in memory. Reads and writes will be lightning fast, but Redis takes up space from the system's memory. Furthermore, if the system loses power, then all of the data are lost.
- Storing data in Redis is really helpful especially for cases with APIs from the DB that don't change much over time.
- We can store data in Redis with an expiration time in seconds. We can call the [SET](https://redis.io/docs/latest/commands/set/) method with a TTL (Time to Live) and when the TTL is expired then the data will automatically be disposed by the Redis Server.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Start Development](#start-dev)
- [ENV File](#env-file)
- [Redis Files, Important Files and Functionality](#redis-files)

## Features

- Complete Backend API and NodeJS server with Express (MVC).
- Redis Cache and all basic operations such as GET, SET, DEL, FLUSHALL and etc.
- Data Encryption and Decryption with AES256 Algorithm.
- CRON Job to remove and refresh data every 24 hours.
- Global error handling
- Language Translation

## Getting Started
First of all you need to install Redis to your system. To install Redis please follow the official guide [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/).

Especially for Windows, in order to start and use Redis you need to install WSL and some edition of Linux Ubuntu.

After succesful installation, you can start the Redis Server by typing in cmd the following:
```
redis-server
```
The above command will start Redis in the default port whic is 6379. If you want to start Redis in a port of your choosing then type the following in cmd:
```
redis-server --port <PORT>
```
At this point you can utilize Redis in your project or of course test Redis from the command line. To create a Redis Client, open anothe cmd and type the following:
```
redis-cli -p <PORT>
```
The <PORT> needs to be the same as the one that you used to create the Redis Server. Now you can test Redis by typing the following on the second cmd:
```
// Inserting data "Savvas" with the distinct key "name"
SET name Savvas

// Retrieve all the keys of Redis
KEYS *

// Retrieve the stored data of the key "name"
GET name
```

## Start Development

First of all you need to install all necessary dependencies. This can be accomplished with the command below.
```
npm install
```
Now you are ready to start the development server with the command:
```
npm run start
```
This command will start Nodemon as it is really helpful with saving and refreshing. At this point you can test the API with Postman or any other tool of your choise. In this repository, a postman collection JSON file is provided in order to have all the calls already set for you.


## ENV File

To run the development server you need to create a 'config.env' file inside the 'backend' directory. This env file will contain all necessary variables that the project needs. These variables are the following:
```
# AES256 ENCRYPTION --------------
AES_256_METHOD=aes-256-cbc
AES_SECRET_KEY=<YOUR KEY>
AES_IV=<YOUR IV>


# CRON JOBS ----------------------
# --------------------------------
REFRESH_DATA_IN_REDIS=1


# REDIS --------------------------
# --------------------------------
REDIS_ENABLED=1
REDIS_HOST=redis://127.0.0.1:
REDIS_PORT=6380
```

Replace the <YOUR KEY> tab with your secret key for encryption and decryption. It might be a simple string key or a UUID or anything else. Replace <YOUR IV> with a string for the Initial Vector (IV) of the enryption algorithm.

The rest of the env variables you can leave them as is, or you change them per your liking.

## Redis Files, Important Files and Functionality

In this section the Redis Files will be examined. Let's see all the important Redis Files that are included.

- redis-apis.js: In this file all the supported backend routes are listed.
- redis-handle.js: In this file all the Redis Cache functionality is listed such as initiate Redis Client, set item to Cache, retrieve data from Cache and lastly delete data from Cache.
- redis-controller.js: In this file are listed all the methods that respond to the users requests. These methods handle the incoming requests and returns the appropriate responses.
- cron-jobs.js: In this file the CRON jobs are listed.
- security-methods.js: In this file all the necessary methods for encryption and decryption of the data are listed.
