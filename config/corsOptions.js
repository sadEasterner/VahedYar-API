const ALLOWED_ORIGINS = require("../config/Prameters/allowed-origins");
const corsOption = {
    origin: (origin, callback) => {
        if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
module.exports = corsOption;