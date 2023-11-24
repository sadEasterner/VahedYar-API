const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {logger ,LOG_TYPE} = require('../middleware/logEvents');
const USER_STATUS = require('../config/prameters/user-status');
const ROLES_LIST = require('../config/prameters/roles-list');

const createUser = async (req, res) => {
    const {username, password, email} = req.body;
    //valication
    if(!username) return res.status(400).json({'message': 'username is required'});
    if(!password) return res.status(400).json({'message': 'username is password'});

    const duplicate = await User.findOne({username}).exec();
    if(duplicate) return res.sendStatus(409);
    try{
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = hashedPwd;
        const result = await User.create(newUser);
        res.status(201).json({'message': `New user ${result.username} created!`});
    }catch (err){
        console.log(err);
        logger(LOG_TYPE.Error, err, 'Auth', 'controllers/User/line-22');
    }
};
const editUser = async (req, res) => {
    const {username, password, email, NewUserStat, id, Newrole} = req.body;
    //valication
    if(!username) return res.status(400).json({'message': 'username is required'});
    if(!password) return res.status(400).json({'message': 'password is required'});
    if(!id) return res.status(400).json({'message': 'id is required'});

    const foundUser = await User.findById(id).exec();
    if(!foundUser) return res.status(204).json({'message': `No User found by id: ${id}`});
    const hashedPwd = await bcrypt.hash(password, 10);

    if(password) foundUser.password = hashedPwd;
    if(username) foundUser.username = username;
    if(email) foundUser.email = email;
    // Changing User Roles
    switch(parseInt(Newrole)){
        case ROLES_LIST.Admin:
            foundUser.roles = { "User": ROLES_LIST.User ,"Admin": ROLES_LIST.Admin};
            break;
        case ROLES_LIST.Editor:
            foundUser.roles = { "User": ROLES_LIST.User, "Editor": ROLES_LIST.Editor};
            break;
        default: 
            foundUser.roles = { "User": ROLES_LIST.User};
    }
    // Changing User Status
    const updatedUserStat = Object.keys(foundUser.UserStat).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
    foundUser.UserStat = updatedUserStat;
    switch(parseInt(NewUserStat)){
        case USER_STATUS.Active:
            foundUser.UserStat.Active = true;
            break;
        case USER_STATUS.Banned:
            foundUser.UserStat.Banned = true;
            break;
        case USER_STATUS.Deleted:
            foundUser.UserStat.Deleted = true;
            break;
        default:
            foundUser.UserStat.Active = true;
    };
    const result = await foundUser.save();
    res.status(201).json({'message': `User ${result.username} has been updated!`});
};
const deleteUser = async (req, res) => {
    const {id} = req.body;
    if(!id) return res.status(400).json({'message': 'username is password'});
    const foundUser = await User.findById(id).exec();
    if(!foundUser) return res.status(204).json({'message': `No User found by id ${id}`});
    const updatedUserStat = Object.keys(foundUser.UserStat).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
    foundUser.UserStat = updatedUserStat;
    foundUser.UserStat.Deleted = true;
    const result = await foundUser.save();
    return res.send(201).json({'message': `User ${result.username} has been deleted!`})
};
const getListUser = async(req, res) => {
    const users = await User.find({});
    if(!users) return res.send(204).json({'message': 'No employees found.'});
    res.json(users);
};
const getUserByUsername = async (req, res) => {
    const {username} = req.body;
    if(!username) return res.status(400).json({'message': 'username is required'});
    const foundUser = await User.findOne({username});
    if(!foundUser) return res.status(204).json({'message': `No User found by username ${username}`});
    res.json(foundUser);
}
const getUserById = async (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({'message': 'id is required'});
    const foundUser = await User.findOne({id});
    if(!foundUser) return res.status(204).json({'message': `No User found by id ${id}`});
    res.json(foundUser);
}
module.exports = {
    createUser,
    editUser,
    deleteUser,
    getListUser,
    getUserByUsername,
    getUserById,
}