const express = require('express')
const router = express.Router()
const crypto = require('crypto')
console.log(crypto)

router.get('/generate-key-pair', (req, res) => {
    console.log('generate-key-pair route')
    res.json({data: 'hello-crypto from the crypto file'})
})

router.post('/hash', (req, res) => {
    console.log('hash route')
    console.log(req.body)
    res.json({data: 'hello-crypto from the crypto file'})
})

module.exports = router

// hash(string) {
//     const crypto = require("crypto")
//     const hash = crypto.createHash('sha256')
//     hash.update(string)
//     console.log(hash.digest('hex'))
//   }

// const PASSPHRASE = 'I had that some things are best kept secret.';

// const KEY_PAIR_OPTIONS = {

//     modulusLength: 2048,
//     publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem',
//         cipher: 'aes-256-cbc',
//         passphrase: PASSPHRASE
//     }

// };

// const KEY_PAIR = crypto.generateKeyPairSync('rsa', KEY_PAIR_OPTIONS);

// const RSA_PRK = KEY_PAIR.privateKey;
// const RSA_PUK = KEY_PAIR.publicKey;

// console.log("\n>>> Private Key: \n\n" + RSA_PRK);
// console.log(">>> Public Key: \n\n" + RSA_PUK);

// var message = "This message will be encrypted with my public key so that only me can decrypt it with my private key.";
// console.log(">>> Original message: \n\n" + message);

// var encMsg = crypto.publicEncrypt(RSA_PUK, Buffer.from(message));
// var encMsgB64 = encMsg.toString('base64');
// console.log("\n>>> Encrypted message (base 64): \n\n" + encMsgB64);

// const PRK_OBJ = {
//     key: RSA_PRK,
//     passphrase: PASSPHRASE
// };

// var decMsg = crypto.privateDecrypt(PRK_OBJ, Buffer.from(encMsgB64, 'base64'));
// var decMsgUtf8 = decMsg.toString('utf8');
// console.log("\n>>> Dencrypted message: \n\n" + decMsgUtf8);

// if (message === decMsgUtf8) {
//     console.log("\n>>> Match: TRUE!");
// } else {
//     console.log("\n>>> Match: FALSE!");
// }
