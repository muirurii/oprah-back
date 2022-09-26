const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connection = async() => {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = connection;