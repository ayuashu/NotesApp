const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

//mdiddle
const app = express();
app.use(express.json());
app.use(cors());

//connect to db
connectDB();

//routes
app.use('/user', userRoutes);
app.use('/note', noteRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});