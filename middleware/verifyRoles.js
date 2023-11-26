const ROLES_LIST = require('../config/prameters/roles-list');


const verifyRoles = (...alloedRoles) => {
    return (req, res, next) => {
        const rolesArray = [...alloedRoles];
        if(!req?.roles) return res.status(401);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.status(401).json({error: "unauthorized", customeStatus: "1007"});
        next();
    };
};
module.exports = {verifyRoles, ROLES_LIST};