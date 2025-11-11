const canConfigBot = (req, res, next) => {
    if (req.user && (req.user.cargo === 'admin' || req.user.permissoes.pode_configurar_bot)) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Acesso negado. Você não tem permissão para configurar o bot."
        });
    }
};

module.exports = canConfigBot;