const express = require('express')
const { MongoClient } = require('mongodb')

const app = express()
app.use(express.json())

const uri = 'mongodb://localhost:27020/mongoose-vs-native-driver-native'
const client = new MongoClient(uri)

// Route pour ajouter une personne
app.post('/persons', async (req, res) => {
    try {
        // trop de connexions ouvertes et fermées rapidement
        // si plusieurs requêtes arrivent en même temps, l’application ralentit ou plante.
        await client.connect()
        const db = client.db()
        console.log('Connected to MongoDB')
        
        // Création et sauvegarde d'une nouvelle personne
        const { civility, name, age } = req.body
        const result = await db.collection('persons').insertOne({ civility, name, age })

        // Retourner l'objet inséré
        res.status(200).json({
            message: 'Person created successfully',
            data: {
                _id: result.insertedId
            },
        })

        client.close()
    } catch (error) {
        return res.status(500).json({ message: `Error saving person ${error.message}` })
    }
})

const PORT = process.argv[2].split('=')[1]
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})