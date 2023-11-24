const mongoose = require('mongoose');
const {logger ,LOG_TYPE} = require('../middleware/logEvents');
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
    }catch(err){
        console.error('MongoDB connection error:', err);
        logger(LOG_TYPE.Error, err, 'Database', 'config/dbConn/line-8');
    }
};
module.exports = connectDB