const express = require('express');
const router = express.Router();
const chatCtrl = require('../Controller/ChatAIController');

router.post('/message', chatCtrl.sendMessage);
router.get('/history', chatCtrl.getChatHistory);

module.exports = router;

