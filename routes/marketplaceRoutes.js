const marketController = require('../controllers/marketplace');
const express = require('express');
const router = express.Router();

router.get('/', marketController.getMarketplace);
router.get('/exchange/:exchange_offer_id/', marketController.Exchange);
router.get('/newoffer', marketController.getNewOfferForm);
router.post('/newoffer/confirm', marketController.postNewOffer);
router.get('/:filter_name/:filter_value', marketController.getFilteredMarketplace);

module.exports = router;