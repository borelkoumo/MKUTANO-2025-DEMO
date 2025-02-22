const express = require('express')
const { MongoClient } = require('mongodb')
const path = require('path')

const app = express()
app.use(express.json())

const DB_NAME = path.basename(__filename).split('.')[0]
const uri = `mongodb://localhost:27020/${DB_NAME}`
const client = new MongoClient(uri, { maxPoolsize: 10000 })

let db
client
    .connect()
    .then(() => {
        db = client.db()
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error(' MongoDB connection error:', err)
        process.exit(1)
    })

// Route pour ajouter une personne
app.post('/persons', async (req, res) => {
    try {
        // Création et sauvegarde d'une nouvelle personne
        const { civility, name, age } = req.body
        await db.collection('persons').insertOne({ civility, name, age })

        // Retourner l'objet inséré
        return res.status(200).json({ message: 'Person created successfully' })
    } catch (error) {
        return res.status(500).json({ message: `Error saving person ${error.message}` })
    }
})

const PORT = process.argv[2].split('=')[1]
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})