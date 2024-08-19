const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const localStrategy = require('passport-local').Strategy;   
const session = require('express-session');
const bcrypt = require('bcryptjs');


const user = require('../models/users');


passport.serializeUser((user, done) => {
    done(null, user.id);
})
/* 
serializeuser is used to configure what must be stored in the session data after succesfull auth
in this case the scope is teh user object and if there aren't any errors is of the user is stored
*/
passport.deserializeUser(async (id, done) => {
    try {
        return done(null, user.findById(id));
    } catch(e){ 
        return done(e)
    }
});
/* deserializeuser retrieve user data from persisten level with user id in the session, 
It's used to reconstruct the user object from the session data.
It's called on every requests when the user is authenticated
It runs whenever the application needs to access user information from req.user.

The process works like this:
1. User logs in successfully.
serializeUser is called, storing the user's ID in the session.
On subsequent requests:
The session ID is sent with the request.
Passport retrieves the session data.
If it finds a user ID, it calls deserializeUser.
deserializeUser fetches the full user object from the database.
The user object is then attached to the request as req.user.
*/


/**
 * Sign in using Email and Password.
 */
passport.use( new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
    user.findOne({ email: email.toLowerCase() })
    console.log(email)
        .then((user) => {
            if(!user) {
                return done(null, false, { msg: 'Email ${email} not found' });
            }
            if (!user.password) {
                return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) { return done(err); }
                if (isMatch) {
                  return done(null, user);
                }
                return done(null, false, { msg: 'Invalid email or password.' });
              });
        })
        .catch((err) => done(err));
    }));
