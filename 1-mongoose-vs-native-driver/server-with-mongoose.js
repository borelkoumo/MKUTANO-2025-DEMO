const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
app.use(express.json())

const DB_NAME = path.basename(__filename).split('.')[0]

// Connexion à MongoDB avec gestion des erreurs
mongoose
    .connect(`mongodb://localhost:27020/${DB_NAME}`)
    .then(() => console.log(`Connected to database '${DB_NAME}'`))
    .catch((err) => {
        console.error(' MongoDB connection error:', err)
        process.exit(1) 
    });

// Définition du schéma et du constructeur
const PersonSchema = new mongoose.Schema({
    civility: String,
    name: String,
    age: Number,
})
const Person = mongoose.model('Person', PersonSchema)

// Route pour ajouter une personne
app.post('/persons', async (req, res) => {
    try {
        // Création et sauvegarde d'une nouvelle personne
        const { civility, name, age } = req.body
        const person = new Person({ civility, name, age })
        await person.save()

        // Retourner l'objet inséré
        return res.status(200).json({message: 'Person created successfully'})
    } catch (error) {
        return res.status(500).json({ message: `Error saving person ${error.message}`})
    }
})

const PORT = process.argv[2].split('=')[1]
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})