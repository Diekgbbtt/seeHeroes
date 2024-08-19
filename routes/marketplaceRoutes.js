const marketController = require('../controllers/marketplace');
const express = require('express');
const router = express.Router();

router.get('/', marketController.getMarketplace);
router.post('/offer', marketController.postOffer);
router.post('/proposal', marketController.postProposal);
router.get('/exchange', marketController.Exchange);

module.exports = router;