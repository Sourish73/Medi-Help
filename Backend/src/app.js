const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req,res)=>{
    res.status(200).json({status:'OK', message : 'Appointment API is Running smoothly'});
});

module.exports = app;