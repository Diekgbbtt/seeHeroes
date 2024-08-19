

/* 

/ --> redirect a /dashboard se cookie ed è corretto
        /dashboard/buypackets --> buy packets
/login --> login
/signup --> signup
/logout --> logout
/pwdreset --> pwdreset
/pwdreset/:token --> pwdreset/token



*/

const User = require('../models/users');
const passport = require('passport');
const { promisify } = require('util');
const crypto = require('crypto');
const validator = require('validator');


exports.getLogin = (req, res) => {

        if (req.isAuthenticated()) {
                res.redirect('/account/dashboard');
        }
        res.render('login');

}

exports.postLogin = (req, res) => {
  const validationErrors = [];
  console.log(req.body.email)
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('account/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('account/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('account/dashboard' || req.session.returnTo );
    });
  })(req, res, next);

};

exports.getSignup = (req, res) => {

}

exports.postSignup = (req, res) => {

}

exports.Logout = (req, res) => {

}





