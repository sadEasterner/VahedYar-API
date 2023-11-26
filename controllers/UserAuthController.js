const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {logger ,LOG_TYPE} = require('../middleware/logEvents');

const signup = async (req, res) => {
    const {username, password, email, group, eduLevel} = req.body;
    
    //validation
    if(!username) return res.status(400).json({error: 'Username is required'});
    if(!password) return res.status(400).json({error: 'Password is required'});
    const duplicate = await User.findOne({username}).exec();
    if(duplicate) return res.status(409).json({ error: 'User already exists', customeStatus: "1002" });

    try{
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        newUser.eduLevel = eduLevel;
        newUser.group = group;
        
        const roles = [3];
        const accessToken = jwt.sign(
            {"UserInfo": {
                "username": newUser.username,
                "roles": roles
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '240s' }
        );
        const refreshToken = jwt.sign(
            {"username": newUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d' }
        );
        newUser.refreshToken = refreshToken;
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        const result = await User.create(newUser);

        res.status(201).json(accessToken);
    }catch (err){
        console.log(err);
        logger(LOG_TYPE.Error, err, 'Auth', 'controllers/UserAuth/line-23');
    }  
};
const login = async (req, res) => {
    const {username, password} = req.body;
    
    //validation
    if(!username) return res.status(400).json({error: 'username is required'});
    if(!password) return res.status(400).json({error: 'password is required'});
    const foundUser = await User.findOne({username}).exec();
    if(!foundUser) return res.status(401).json({error: "Unauthorized", customeStatus: "1003"});
    if(foundUser.UserStat.Banned) return res.status(403).json({error: 'Your account has been banned!', customeStatus: "1005"});
    if(foundUser.UserStat.Deleted) return res.status(403).json({error: 'Your account has been deleted!', customeStatus: "1006"});
    
    const pwdMatch = password === foundUser.password ? true : false;
    if(pwdMatch){
        const roles = Object.values(foundUser.roles).filter(Boolean);
        const accessToken = jwt.sign(
            {"UserInfo": {
                "username": foundUser.username,
                "roles": roles
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '240s' }
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d' }
        );
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(201).json(accessToken);
    } else{
        res.sendStatus(401);
    }
};
const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
};


module.exports = {
    login,
    signup,
    logout
};