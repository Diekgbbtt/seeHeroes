

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
            return res.redirect('/account/dashboard');
      }
      res.render('login', { messages: { errors: req.flash('errors') } });

}

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  console.log(req.body.email)
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    for(ve in validationErrors) {
      console.log(ve.msg)
    }
    req.flash('errors', validationErrors);
    return res.redirect('/account/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      console.log("user not found")
      return res.redirect('/account/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('account/dashboard' || req.session.returnTo );
    });
  })(req, res, next);

};

exports.getSignup = (req, res) => {
  if(req.isAuthenticated()){
      return res.redirect('/account/dashboard');
  }

  res.render('signup', { messages: { errors: req.flash('errors') }});

}

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/account/signup');
    }
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      username: req.body.username,
      points: 10
    });
    await user.save();
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/account/dashboard');
    });
  } catch (err) {
    next(err);
  }
};

exports.Logout = (req, res) => {
  req.logout((err) => {
    if (err) console.log('Error : Failed to logout.', err);
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
  });
};





