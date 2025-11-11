const express = require('express');
const router = express.Router();
const configBotController = require('../controllers/configBotController');
const authMiddleware = require('../middleware/authMiddleware');
const canConfigBot = require('../middleware/canConfigBot');

router.use(authMiddleware);
router.use(canConfigBot);

router.get('/', configBotController.handleGetConfig);
router.put('/', configBotController.handleUpdateConfig);

router.get('/folgas', configBotController.handleGetFolg_as);
router.post('/folgas', configBotController.handleCreateFolga);
router.delete('/folgas/:id', configBotController.handleDeleteFolga);

module.exports = router;