const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 //tamaño de encriptacion

const userSchema = new mongoose.Schema({
    username: {type: String,    
                require: true,
                unique: true},
    password: {type: String, require: true},
    last_login_date: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function(next) {
    if(this.isNew || this.isModified('password')) {
        const document = this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if(err) {
                next(err)
            } else {
                document.password = hashedPassword
                next();
            }
        });
    } else {
        next();
    }
})

userSchema.methods.isPSWcorrect = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if(err) {
            callback(err)
        } else {
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('user', userSchema)
