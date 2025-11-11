const configBotService = require('../services/configBotService');

// --- Configs ---
exports.handleGetConfig = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const config = await configBotService.getConfig(banco_dados);
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.handleUpdateConfig = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const configData = req.body;
        await configBotService.updateConfig(banco_dados, configData);
        res.status(200).json({ success: true, message: "Configurações atualizadas." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Folgas ---
exports.handleGetFolg_as = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const folg_as = await configBotService.getFolg_as(banco_dados);
        res.status(200).json({ success: true, data: folg_as });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.handleCreateFolga = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const { data_folga, motivo } = req.body;
        if (!data_folga || !motivo) {
            return res.status(400).json({ success: false, message: "Data e motivo são obrigatórios." });
        }
        const novaFolga = await configBotService.createFolga(banco_dados, req.body);
        res.status(201).json({ success: true, data: novaFolga });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.handleDeleteFolga = async (req, res) => {
    try {
        const { banco_dados } = req.user;
        const { id } = req.params; 
        await configBotService.deleteFolga(banco_dados, id);
        res.status(200).json({ success: true, message: "Folga deletada." });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};