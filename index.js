const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let db;


const init = async () => {
  db = await connectDB();

  // Crear (Create)
  app.post('/users', async (req, res) => {
    const user = req.body;
    console.log('Creating user:', user); // Log para depuración
    try {
      const result = await db.collection('users').insertOne(user);
      user._id = result.insertedId; // Obtener el ID insertado y asignarlo al usuario
      res.status(201).json(user);
    } catch (error) {
      if (error.code === 11000) { // Código de error para clave duplicada
        res.status(409).json({ error: 'El usuario con ese ID ya existe' });
      } else {
        console.error('Error creating user:', error); // Log del error
        res.status(500).json({ error: 'Error al crear el usuario' });
      }
    }
  });

  // Leer (Read)
  app.get('/users', async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error); // Log del error
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });

  app.get('/users/:idd', async (req, res) => {
    const { idd } = req.params;
   
    try {
      const user = await db.collection('users').findOne({_id: new ObjectId(idd) });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error fetching user:', error); // Log del error
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  });

  

  // Actualizar (Update)
  app.put('/users/:idd', async (req, res) => {
    const { idd } = req.params;
    const updateUser = req.body;
  
    
    try {
      const result = await db.collection('users').updateOne({ _id: new ObjectId(idd) }, { $set: updateUser });
      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Usuario actualizado' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error updating user:', error); // Log del error
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  });

  // Eliminar (Delete)
  app.delete('/users/:idd', async (req, res) => {
    const { idd } = req.params;
    
    try {
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(idd) });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Usuario eliminado' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error deleting user:', error); // Log del error
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  });

  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });
};

init();
