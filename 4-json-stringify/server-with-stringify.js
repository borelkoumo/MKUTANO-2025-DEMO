const express = require('express')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json())

const DB_NAME = 'persons'
const uri = `mongodb://localhost:27020/${DB_NAME}`
const client = new MongoClient(uri)

let db
client
    .connect()
    .then(() => {
        db = client.db()
        console.log(`Connected to database '${DB_NAME}'`)
    })
    .catch((err) => {
        console.error(' MongoDB connection error:', err)
        process.exit(1)
    })

const email = "michael.brown@random.org"

app.get('/persons', async (req, res) => {
    try {
        const persons = await db.collection('people').find({ email }).limit(100).toArray()
        return res.status(200).json(persons)
    } catch (error) {
        return res.status(500).json({ message: `Error : ${error.message}` })
    }
})

const PORT = process.argv[2].split('=')[1]
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})