const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'MY_PRIVATE_SECRET';
const PORT = process.argv[2].split('=')[1]

const tokenCache = new Map(); // Cache en mémoire

// Middleware de vérification du JWT avec cache
function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Vérifier si le token est déjà en cache
    if (tokenCache.has(token)) {
        req.user = tokenCache.get(token);
        return next();
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        tokenCache.set(token, decoded); // Stocker dans le cache
        const { name, age, email } = decoded
        req.user = { name, age, email }
        next();
    });
}

app.get('/decode', authenticateJWT, (req, res) => {
    res.json({ ...req.user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
