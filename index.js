const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

let userData = null;

// Función para consultar la API
const fetchUserData = async () => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        userData = response.data.results[0]; // Guarda el primer resultado
        console.log('User data fetched:', userData.name);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

// Programa la tarea para que se ejecute cada hora
cron.schedule('0 * * * *', fetchUserData);

// Ruta para obtener los datos del usuario
app.get('/user', (req, res) => {
    if (userData) {
        res.json(userData);
    } else {
        res.status(404).json({ message: 'No user data available' });
    }
});

// Inicia la aplicación
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Llama a la función inmediatamente para obtener datos al inicio
    fetchUserData();
});