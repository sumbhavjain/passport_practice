var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema

var UserSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique:true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true,
        minlength: 10
    },
    comp_name: {
        type: String
    },
    comp_id: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    google: {
        token: String,
        image: String,
        email: String,

    },
    status: {
        type: Boolean,
        default:false
    }
})

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password=hash;
            newUser.save(callback);
        });
    });
}


module.exports.getUserByUsername= function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById= function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword= function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    })
}