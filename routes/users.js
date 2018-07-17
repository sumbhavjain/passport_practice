var express= require('express');
var router= express.Router();
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;

var User = require('../routes/models/user')

// Register

router.get('/register', function(req, res){
    res.render('register');
});

// Login

router.get('/login', function(req, res){
    res.render('login');
});

// Register User
router.post('/register', function(req, res){
    var name= req.body.name;
    var username= req.body.username;
    var email= req.body.email;
    var phone= req.body.phone;
    var comp_name= req.body.comp_name;
    var comp_id= req.body.comp_id;
    var password= req.body.password;

    // Validations
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('username','User name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('phone','Phone number is required').notEmpty();
    req.checkBody('comp_name','Company name is required').notEmpty();
    req.checkBody('comp_id','Company ID is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors: errors
        });
    } else{
        var newUser = new User({
            name: name,
            username: username,
            email: email,
            phone: phone,
            comp_name: comp_name,
            comp_id: comp_id,
            password: password
        });
        User.createUser(newUser,function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', "You are registered and can now login");
        res.redirect('/users/login')
    }
});


passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message : 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else{
                return done(null, false, {message: 'Invalid password !'});

            }
        })
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

// Authentication

router.post('/login',
  passport.authenticate('local',{
      successRedirect: '/', 
      failureRedirect: '/users/login',
      failureFlash: true
    }),
  function(req, res) {
    res.redirect('/');
  });


router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out !');
    res.redirect('/users/login');
})


module.exports= router;