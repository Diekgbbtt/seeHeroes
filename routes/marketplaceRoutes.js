const marketController = require('../controllers/marketplace');
const express = require('express');
const router = express.Router();

router.get('/', marketController.getMarketplace);
router.get('/exchange/:exchange_offer_id/', marketController.Exchange);
router.post('/newoffer/confirm', marketController.postNewOffer);
router.get('/newoffer/search/:search_term', marketController.getPertinentHeroes);
router.post('/offer/remove', marketController.removeOffer);

module.exports = router;