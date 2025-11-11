const express = require('express');
const router = express.Router();
const equipeController = require('../controllers/equipeController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.use(authMiddleware);

router.get('/', equipeController.handleGetEquipe);

router.post('/', isAdmin, equipeController.handleCreateFuncionario);

router.delete('/:id', isAdmin, equipeController.handleDeleteFuncionario);

router.patch('/:id/permissoes', isAdmin, equipeController.handleUpdatePermissoes);

module.exports = router;