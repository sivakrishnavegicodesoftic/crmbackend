const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    role :{ type: String, required: true },
    password: { type: String, required: true , minlength : 6},
    otpHex: { type: String },
    isVerified: { type: Boolean, default: false  }
}, { versionKey: false });

userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('User', userSchema);