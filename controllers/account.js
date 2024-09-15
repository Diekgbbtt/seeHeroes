



const User = require('../models/users');
const passport = require('passport');
const { promisify } = require('util');
const crypto = require('crypto');
const validator = require('validator');

/**
 * @swagger
 *  /account/login:
 *      get:
 *        summary: load login page
 *        description: >
 *           login page is rendered for not logged clients, 
 *           let acess to signup page as well
 *        responses:
 *               200:
 *                 description: successfull request
 *                 content:
 *                    text/html:
 *                      schema: 
 *                        type: string
 */
exports.getLogin = (req, res) => {

      if (req.isAuthenticated()) {
            return res.redirect('/account/dashboard');
      }
      res.render('login', { messages: { errors: req.flash('errors') } });

}

/**
 * @swagger
 * /account/login:
 *   post:
 *     summary: Load login page
 *     description: >
 *       The login page is rendered for clients who are not logged in. It also provides access 
 *       to the signup page.
 *     responses:
 *       200:
 *         description: Successful request; login page is rendered.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
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
      req.flash('errors', {msg: 'incorrect email or password'});
      console.log("user not found")
      return res.redirect('/account/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/account/dashboard' || req.session.returnTo );
    });
  })(req, res, next);

};


/**
 * @swagger
 * /account/signup:
 *   get:
 *     summary: Load signup page
 *     description: >
 *       The signup page is rendered for clients who are not logged in, providing access to create 
 *       a new account.
 *     responses:
 *       200:
 *         description: Successful request; signup page is rendered.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
exports.getSignup = (req, res) => {
  if(req.isAuthenticated()){
      return res.redirect('/account/dashboard');
  }

  res.render('signup', { messages: { errors: req.flash('errors') }});

}

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Submit signup form
 *     description: >
 *       Submits the signup form to create a new account. 
 *       If successful, the user will be registered and redirected.
 *     responses:
 *       200:
 *         description: Successful request; user signup form is processed.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
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

/**
 * @swagger
 * /account/logout:
 *   get:
 *     summary: Log out the user
 *     description: >
 *       Logs out the authenticated user and redirects them to the home page.
 *     security:
 *         - SessionAuth: []
 *     responses:
 *       200:
 *         description: Successful request; user is logged out and redirected to the login page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       302:
 *          description: Unauthorized request; user is not logged in; redirect to login page.
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: string
 *                      description: Error message
 */
exports.Logout = (req, res) => {
  if(!req.isAuthenticated()) {
    req.flash('errors', { msg: 'You are not logged in.' });
    return res.status(302).json({ error: 'You are not logged in.' });
  }
  req.logout((err) => {
    if (err) console.log('Error : Failed to logout.', err);
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      return res.redirect('/');
    });
  });
};





