const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected successful');
    } catch (error) {
        console.error('DB connection failed', error);
    }
}

module.exports = connectDB;

