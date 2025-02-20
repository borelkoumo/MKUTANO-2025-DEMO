const express = require('express');
const app = express();

const PORT = process.argv[2].split('=')[1]

const person = {
    name: 'Paul BIYA',
    age: 92,
    email: 'paulbiya@gmail.com'
}

app.get('/decode', (req, res) => {
    res.json(person);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));