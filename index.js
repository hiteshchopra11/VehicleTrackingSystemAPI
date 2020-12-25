require('dotenv').config()
const express = require('express');
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
    //Co    nnect to database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//Check if databse is connected or not connected
db.on('error', (err) => {
    console.error(err);
})
db.once('open', () => {
    console.log("Connected");
})

//We  need response in JSON
app.use(express.json());

//Import Routes
const authRoute = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');

//Use     middleware
app.get('/', (req, res) => {
    res.send("TEST");
})
app.use('/api/user', authRoute);
app.use('/api/vehicles', vehicleRoutes);

app.listen(PORT, () => {
    console.log("UP and Running");
})