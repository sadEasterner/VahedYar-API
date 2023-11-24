const { format } = require('date-fns');
const LOG_TYPE = require('../config/prameters/log-types');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logger = async (type ,message, logName, location = "Unknown location") => {
    const date = format(new Date(), 'yyyyMMdd\tHH:mm:ss').toString();
    let logType;
    switch(type) {
        default:
            logType = "Unknown --- ";
        case LOG_TYPE.Error: 
            logType = "Erro --- ";
        case LOG_TYPE.Info: 
            logType = "Info --- ";

    };
    const fileName = logName + '.txt';
    const logItem = `${logType} from ${location} at ${date}:\t${message}`;
    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..','logs', fileName), logItem);  
    }catch(err){
        console.log(err);
    }

};
const reqLogger = (req, res, next) => {
    logger(LOG_TYPE.Info, `${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog');
    console.log(`${req.method}\t${req.path}`);
    next();
}
module.exports = {logger, LOG_TYPE, reqLogger};