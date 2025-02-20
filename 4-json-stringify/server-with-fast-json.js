const express = require('express')
const mongoose = require('mongoose')
const fastJson = require('fast-json-stringify');

const app = express()
app.use(express.json())

const PORT = process.argv[2].split('=')[1]
const DB_NAME = 'persons'

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
    email: { type: String, required: true }
})

const Person = mongoose.model('Person', PersonSchema)

// Définition du schéma pour fast-json-stringify
const stringifyPersons = fastJson({
    type: 'array',
    items: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            age: { type: 'integer' },
            email: { type: 'string' },
            __v: { type: 'integer' }
        }
    }
});

const email = "michael.brown@random.org"

// Route pour ajouter une personne
app.post('/persons', async (req, res) => {
    try {
        // Création et sauvegarde d'une nouvelle personne
        const { civility, name, age } = req.body
        const person = new Person({ civility, name, age, email })
        const savedPerson = await person.save()

        // Retourner l'objet inséré
        return res.status(200).json({
            message: 'Person created successfully',
            data: { _id: savedPerson._id },
        })
    } catch (error) {
        return res.status(500).json({ message: `Error saving person ${error.message}` })
    }
})

app.get('/persons', async (req, res) => {
    try {
        const persons = await Person.find({ email })

        return res.status(200).setHeader('Content-Type', 'application/json').end(stringifyPersons(persons))
    } catch (error) {
        return res.status(500).json({ message: `Error saving person ${error.message}` })
    }
})

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
})