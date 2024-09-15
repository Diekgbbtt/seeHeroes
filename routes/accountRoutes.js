/* 

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;

*/

const accountController = require('../controllers/account');
const express = require('express');
const router = express.Router();

const passportControl = require('../middleware/passportAuth');

const dashboardRoutes = require('./dashboardRoutes');

const checkDashboardReferer = (req, res, next) => {
    const referer = req.get('Referer');
    if (referer && referer.includes('/account')) {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };


router.use('/dashboard', dashboardRoutes); // checkDashboardReferer, passportControl.isAuthenticated,

router.get('/login', accountController.getLogin);
router.get('/signup', accountController.getSignup);
router.get('/logout', accountController.Logout);

router.post('/login', accountController.postLogin);
router.post('/signup', accountController.postSignup);


router.post('/edit', accountController.postEditProfile);

module.exports = router;