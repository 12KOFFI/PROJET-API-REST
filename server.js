const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>  console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));


// Démarrer le serveur
const PORT = 3000;

app.listen(PORT , () =>{
  console.log(`Server is running on port ${PORT}`);
})


// Importer le modèle User

const User = require("./models/User");

// Route GET : Retourner tous les utilisateurs

app.get('/users' , async(req , res) =>{
  try {
    const users = await User.find();
    res.json(users);
} catch (err) {
    res.status(500).json({ message: err.message });
}
})

// Route POST : Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
  const user = new User({
      name: req.body.name,
      email: req.body.email,
  });

  try {
      const newUser = await user.save();
      res.status(201).json(newUser);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Route PUT : Éditer un utilisateur par ID
app.put('/users/:id', async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(user);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Route DELETE : Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
  try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
