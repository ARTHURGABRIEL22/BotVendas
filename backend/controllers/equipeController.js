const equipeService = require('../services/equipeService');

exports.handleGetEquipe = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const equipe = await equipeService.getEquipe(banco_dados);
        res.status(200).json({ success: true, data: equipe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.handleCreateFuncionario = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const { nome, email, senha, permissoes } = req.body;

        if (!nome || !email || !senha || !permissoes) {
            return res.status(400).json({ success: false, message: "Nome, email, senha e permissões são obrigatórios." });
        }

        const novoUsuario = await equipeService.createFuncionario(banco_dados, req.body);
        res.status(201).json({ success: true, data: novoUsuario });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.handleDeleteFuncionario = async (req, res) => {
    try {
        const { banco_dados, userId } = req.user; 
        const { id } = req.params; 

        await equipeService.deleteFuncionario(banco_dados, id, userId);
        res.status(200).json({ success: true, message: "Funcionário deletado." });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

exports.handleUpdatePermissoes = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const { id } = req.params; 
        const { permissoes } = req.body;

        if (!permissoes) {
             return res.status(400).json({ success: false, message: "Objeto de permissões é obrigatório." });
        }

        await equipeService.updatePermissoes(banco_dados, id, permissoes);
        res.status(200).json({ success: true, message: "Permissões atualizadas." });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};