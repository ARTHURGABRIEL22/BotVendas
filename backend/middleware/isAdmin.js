const isAdmin = (req, res, next) => {
    if (req.user && req.user.cargo === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Acesso negado. Você não tem permissão de administrador."
        });
    }
};

module.exports = isAdmin;