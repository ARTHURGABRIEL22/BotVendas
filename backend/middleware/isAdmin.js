const isAdmin = (req, res, next) => {
    if (req.user && req.user.cargo === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Acesso negado. Esta ação é permitida apenas para administradores."
        });
    }
};

module.exports = isAdmin;