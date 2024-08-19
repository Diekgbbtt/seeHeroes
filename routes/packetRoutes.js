const express = require('express');
const router = express.Router();

const packetController = require('../controllers/packet')


router.get('/', packetController.buyPackets);
router.post('/buy', packetController.postBuy);

module.exports = router;