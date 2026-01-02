const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECT_URI || 'mongodb:mongodb+srv://shashiprakash191_db_user:w79MWCoqGD6HAKm7@cluster0.c1rqz9y.mongodb.net/?appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
