const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/', (req, res) => {
    res.send("MAIN");
});

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check for empty
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //match passwords
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //check password length
    if (password.length < 8) {
        errors.push({ msg: 'password should be atleast 8 characters' });
    }

    if (errors.length > 0) {
        console.log(errors.length)
        return res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        //validation passes
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: 'Email already registered with us!' });
                console.log(errors.length)
                return res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                });
                //hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        //set new user's password to hashed password.
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are registered user you can login');
                            return res.redirect('/users/login');
                        }).catch(err => console.log(err))
                    });
                })
            }
        })
    }
})

//login handle
/*router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res,next);
});*/

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

/*router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
*/
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
    });
  });

/* 
 // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
*/
module.exports = router;