const crypto = require('crypto');
const catchAsync = require("./catchAsync");
const {consoleHandler, checkNecessaryCases} = require("./commonFunc");

// Secret Key and Encryption Initial Vector (IV)
let secretKey;
let encryptionIV;

// Cipher Algorithm for Encryption and Decryption
let cipherEncryption;
let cipherDecryption;

// Control Action
let encryptionInitialized = false;

/**
 * This method implements all the initial actions
 * @type {(function(*, *, *): void)|*}
 */
exports.initializeEncryption = async () => {

    // Check the existence of the data in ENV
    if (checkNecessaryCases(process.env.AES_SECRET_KEY) && checkNecessaryCases(process.env.AES_IV) && checkNecessaryCases(process.env.AES_256_METHOD)){

        // Set the secret key
        secretKey = crypto.createHash('sha256').update(process.env.AES_SECRET_KEY)
            .digest('hex').substring(0, 32);

        // Set the encryption initial vector (IV)
        encryptionIV = crypto.createHash('sha256').update(process.env.AES_IV)
            .digest('hex').substring(0, 16);

        // Create the cipher algorithm for encryption and decryption
        cipherEncryption = crypto.createCipheriv(process.env.AES_256_METHOD, secretKey, encryptionIV);
        cipherDecryption = crypto.createDecipheriv(process.env.AES_256_METHOD, secretKey, encryptionIV);

        // Set encryptionInitialized to true
        encryptionInitialized = true;

        // Encryption Initialization Completed
        consoleHandler('Encryption Initialization Completed Successfully.');

    } else {
        consoleHandler('Encryption Initialization Failed: {Not provided ENV data.}');
    }
};

/**
 * This method encrypts the input data.
 * @returns {Promise<{encryptedResult: null, operationCompletedAt: null, completed: boolean, message: string}>}
 */
exports.encryptInputData = async (dataToEncrypt) => {

    // Encrypted Result Object
    let encryptedResultObject = {
        completed: false,
        operationCompletedAt: null,
        message: '',
        encryptedResult: null
    }

    // Check the existence of the data
    if (checkNecessaryCases(dataToEncrypt)){

        // Encrypt the received input
        const encryptedResult = Buffer.from(cipherEncryption.update(dataToEncrypt, 'utf8', 'hex')).toString('base64');
        encryptedResultObject.encryptedResult = encryptedResult;
        encryptedResultObject.operationCompletedAt = new Date();
        encryptedResultObject.message = 'Encryption completed.'
        encryptedResultObject.completed = true;
        consoleHandler('Encrypted Result: ', encryptedResult);

        // Return the encrypted result
        return encryptedResultObject;

    } else {
        encryptedResultObject.message = 'Not existent input data.'
        return encryptedResultObject;
    }
};

/**
 * This method decrypts the input data.
 * @param dataToDecrypt
 * @returns {Promise<{operationCompletedAt: null, completed: boolean, decryptedResult: null, message: string}>}
 */
exports.decryptInputData = async (dataToDecrypt) => {

    // Decrypted Result Object
    let decryptedResultObject = {
        completed: false,
        operationCompletedAt: null,
        message: '',
        decryptedResult: null
    }

    // Check the existence of the data
    if (checkNecessaryCases(dataToDecrypt)){

        // Construct a buffer from the input data
        const bufferInputData = Buffer.from(dataToDecrypt, 'base64');

        // Decrypt the received input
        const decryptedResult = cipherDecryption.update(bufferInputData.toString('utf8'), 'hex', 'utf8');
        decryptedResultObject.decryptedResult = decryptedResult;
        decryptedResultObject.operationCompletedAt = new Date();
        decryptedResultObject.message = 'Decryption completed.'
        decryptedResultObject.completed = true;
        consoleHandler('Decrypted Result: ', decryptedResult);

        // Return the decrypted result
        return decryptedResultObject;

    } else {
        decryptedResultObject.message = 'Not existent input data.'
        return decryptedResultObject;
    }
}