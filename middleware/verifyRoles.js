const ROLES_LIST = require('../config/prameters/roles-list');


const verifyRoles = (...alloedRoles) => {
    return (req, res, next) => {
        const rolesArray = [...alloedRoles];
        if(!req?.roles) return res.sendStatus(401);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401);
        next();
    };
};
module.exports = {verifyRoles, ROLES_LIST};