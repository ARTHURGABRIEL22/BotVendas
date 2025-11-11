const { centralDb, getTenantPool } = require('../config/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY; 

exports.loginUser = async (email, senha) => {
    let empresa = null;
    let usuario = null;

    const [empresasAdmin] = await centralDb.query(
        `SELECT * FROM empresas WHERE email = ?`, [email]
    );

    if (empresasAdmin.length > 0) {
        empresa = empresasAdmin[0];
        const tenantPool = getTenantPool(empresa.banco_dados);
        
        const [usuariosAdmin] = await tenantPool.query(
            `SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE`, [email]
        );
        if (usuariosAdmin.length > 0) {
            usuario = usuariosAdmin[0];
        }
    } else {
        const [todasEmpresas] = await centralDb.query('SELECT id, nome, banco_dados, tipo_negocio FROM empresas');
        
        for (const emp of todasEmpresas) {
            const tenantPool = getTenantPool(emp.banco_dados);
            
            const [usuariosFunc] = await tenantPool.query(
                `SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE`, [email]
            );

            if (usuariosFunc.length > 0) {
                usuario = usuariosFunc[0];
                empresa = emp; 
                break; 
            }
        }
    }

    if (!usuario || !empresa) {
        throw new Error("Usuário ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error("Usuário ou senha inválidos.");
    }

    const permissoes = {
        ver_pedidos: Boolean(usuario.pode_ver_pedidos),
        ver_estoque: Boolean(usuario.pode_ver_estoque)
    };

    const payload = {
        userId: usuario.id,
        email: usuario.email,
        cargo: usuario.cargo,
        empresaId: empresa.id,
        banco_dados: empresa.banco_dados,
        permissoes: permissoes
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' }); 

    return {
        message: "Login bem-sucedido!",
        token: token,
        usuario: {
            nome: usuario.nome,
            email: usuario.email,
            nome_empresa: empresa.nome,
            cargo: usuario.cargo,
            permissoes: permissoes
        }
    };
};