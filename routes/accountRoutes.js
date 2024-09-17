

const accountController = require('../controllers/account');
const express = require('express');
const router = express.Router();

const passportControl = require('../config/passportAuth');

const dashboardRoutes = require('./dashboardRoutes');

router.use('/dashboard', dashboardRoutes); // checkDashboardReferer, passportControl.isAuthenticated,

router.get('/login', accountController.getLogin);
router.get('/signup', accountController.getSignup);
router.get('/logout', accountController.Logout);

router.post('/login', accountController.postLogin);
router.post('/signup', accountController.postSignup);


router.post('/edit', accountController.postEditProfile);

module.exports = router;