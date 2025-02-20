const jsonWebToken = require('jsonwebtoken')

const jwt = jsonWebToken.sign(
    {
        name: 'Paul BIYA',
        age: 92,
        email: 'paulbiya@gmail.com'
    },
    'MY_PRIVATE_SECRET',
    { expiresIn: '7d' }
)

console.log(jwt)