const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const SECRET_KEY = 'MY_PRIVATE_SECRET';
const PORT = process.argv[2].split('=')[1]

// Middleware de vérification du JWT
function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        const { name, age, email } = decoded
        req.user = { name, age, email }
        next();
    });
}

app.get('/decode', authenticateJWT, (req, res) => {
    res.status(200).json({...req.user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
