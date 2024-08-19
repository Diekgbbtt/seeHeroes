const express = require('express');
const router = express.Router();


const dashController = require('../controllers/dashboard');

router.get('/', dashController.getDashboard);
router.get('/edit', dashController.getProfileEdit);
router.post('/edit/confirm', dashController.postProfileEdit);
router.get('/packets/:id', dashController.openPacket);

module.exports = router;