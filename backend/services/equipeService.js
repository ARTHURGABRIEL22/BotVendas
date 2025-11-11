const { getTenantPool } = require('../config/db');
const bcrypt = require('bcrypt');

exports.getEquipe = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [usuarios] = await pool.query(
        "SELECT id, nome, email, cargo, ativo, pode_ver_pedidos, pode_ver_estoque, pode_configurar_bot FROM usuarios"
    );
    return usuarios;
};

exports.createFuncionario = async (banco_dados, novoUsuario) => {
    const { nome, email, senha, permissoes } = novoUsuario;
    
    const saltRounds = 10;
    const senhaHasheada = await bcrypt.hash(senha, saltRounds);
    const cargo = 'funcionario';
    const ativo = 1;

    const podeVerPedidos = permissoes.pode_ver_pedidos ? 1 : 0;
    const podeVerEstoque = permissoes.pode_ver_estoque ? 1 : 0;
    const podeConfigurarBot = permissoes.pode_configurar_bot ? 1 : 0; 

    const pool = getTenantPool(banco_dados);
    
    try {
        const [result] = await pool.query(
            "INSERT INTO usuarios (nome, email, senha, cargo, ativo, pode_ver_pedidos, pode_ver_estoque, pode_configurar_bot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nome, email, senhaHasheada, cargo, ativo, podeVerPedidos, podeVerEstoque, podeConfigurarBot] 
        );
        return { id: result.insertId, nome, email, cargo };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("Este email já está cadastrado.");
        }
        throw error;
    }
};

exports.deleteFuncionario = async (banco_dados, idFuncionario, idAdmin) => {
    if (idFuncionario === idAdmin) {
        throw new Error("Você não pode deletar a si mesmo.");
    }
    const pool = getTenantPool(banco_dados);
    const [result] = await pool.query(
        "DELETE FROM usuarios WHERE id = ? AND cargo = 'funcionario'",
        [idFuncionario]
    );
    if (result.affectedRows === 0) {
        throw new Error("Funcionário não encontrado ou você não pode deletar um administrador.");
    }
    return { message: "Funcionário deletado com sucesso." };
};

exports.updatePermissoes = async (banco_dados, idFuncionario, permissoes) => {
    const { pode_ver_pedidos, pode_ver_estoque, pode_configurar_bot } = permissoes;

    const pool = getTenantPool(banco_dados);
    const [result] = await pool.query(
        `UPDATE usuarios 
         SET pode_ver_pedidos = ?, pode_ver_estoque = ?, pode_configurar_bot = ?
         WHERE id = ? AND cargo = 'funcionario'`,
        [
            pode_ver_pedidos ? 1 : 0,
            pode_ver_estoque ? 1 : 0,
            pode_configurar_bot ? 1 : 0, 
            idFuncionario
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error("Funcionário não encontrado ou não é um funcionário.");
    }
    return { message: "Permissões atualizadas com sucesso." };
};