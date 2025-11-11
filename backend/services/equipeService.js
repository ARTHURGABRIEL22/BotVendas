const { getTenantPool } = require('../config/db');
const bcrypt = require('bcrypt');

exports.getEquipe = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [usuarios] = await pool.query(
        "SELECT id, nome, email, cargo, ativo, pode_ver_pedidos, pode_ver_estoque FROM usuarios"
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

    const pool = getTenantPool(banco_dados);
    
    try {
        const [result] = await pool.query(
            "INSERT INTO usuarios (nome, email, senha, cargo, ativo, pode_ver_pedidos, pode_ver_estoque) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nome, email, senhaHasheada, cargo, ativo, podeVerPedidos, podeVerEstoque]
        );
        return { id: result.insertId, nome, email, cargo, pode_ver_pedidos: podeVerPedidos, pode_ver_estoque: podeVerEstoque };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("Este email já está cadastrado.");
        }
        throw error;
    }
};

exports.deleteFuncionario = async (banco_dados, idFuncionario) => {
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