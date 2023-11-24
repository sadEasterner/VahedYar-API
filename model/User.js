const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 3
        },
        Editor: Number,
        Admin: Number,
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    refreshToken : String,
    group: String,
    eduLevel: String,
    UserStat: {
        Active: {
            type: Boolean,
            default: true
        },
        Banned: {
            type: Boolean,
            default: false
        },
        Deleted: {
            type: Boolean,
            default: false  
        }
    }
});

module.exports = mongoose.model('User', userSchema);