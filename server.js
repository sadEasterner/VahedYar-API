require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const { logger, LOG_TYPE, reqLogger} = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOption = require('./config/corsOptions');
const root = require('./routes/root');
const auth = require('./routes/auth');
const user = require('./routes/user');
const connectDB = require('./config/dbConn');


connectDB();
app.use(reqLogger);
app.use(cors(corsOption));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use('/', root);
app.use('/auth', auth);
app.use(verifyJWT);
app.use('/user', user);


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MogoDB');
    app.listen(PORT, ()=> console.log(`Server running on port : ${PORT}`));
});