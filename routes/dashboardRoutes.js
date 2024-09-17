const express = require('express');
const router = express.Router();


const dashController = require('../controllers/dashboard');

router.get('/', dashController.getDashboard);
router.get('/fig/:fig_id', dashController.getCharacter)
router.get('/buypackets', dashController.getPacketPage);
router.post('/buypackets/confirm', dashController.postBuyPackets);
router.get('/packets/:packet_id', dashController.openPacket);
router.post('/buypoints/confirm', dashController.postBuyPoints);

module.exports = router;