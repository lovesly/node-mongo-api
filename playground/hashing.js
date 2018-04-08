const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

/**
 *  demo purpose
 *  idea of token
 */
const message = 'I am user number 1';
const hash = SHA256(message);

// console.log(hash);
console.log(hash.toString());

const data = {
    id: 1,
    sex: 'none',
};

const token = {
    data,
    hash: SHA256(`${JSON.stringify(data)}somesalt`).toString(),
};

token.data.id = 2;

const resultHash = SHA256(`${JSON.stringify(token.data)}somesalt`).toString();
if (resultHash === token.hash) {
    console.log('Data was not modified');
} else {
    console.log('Data was modified. Not secure.');
}

/**
 *  the use of jwt
 */

const jwt_token = jwt.sign(data, 'somesalt');
console.log(jwt_token);
console.log(jwt_token.toString());

const decoded = jwt.verify(jwt_token, 'somesalt');
console.log(decoded);
