const { getTenantPool } = require('../config/db');

exports.getConfig = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [rows] = await pool.query("SELECT * FROM configuracoes_bot WHERE id = 1 LIMIT 1");
    if (rows.length === 0) {
        throw new Error("Arquivo de configuração do bot não encontrado.");
    }
    return rows[0];
};

exports.updateConfig = async (banco_dados, configData) => {
    const { 
        bot_ativo, 
        dias_funcionamento, 
        horario_abertura, 
        horario_fechamento, 
        mensagem_fora_horario,
        mensagem_folga
    } = configData;

    const pool = getTenantPool(banco_dados);
    await pool.query(
        `UPDATE configuracoes_bot SET 
            bot_ativo = ?, dias_funcionamento = ?, horario_abertura = ?, 
            horario_fechamento = ?, mensagem_fora_horario = ?, mensagem_folga = ?
         WHERE id = 1`,
        [
            bot_ativo ? 1 : 0,
            JSON.stringify(dias_funcionamento), 
            horario_abertura,
            horario_fechamento,
            mensagem_fora_horario,
            mensagem_folga
        ]
    );
    return { message: "Configurações do bot atualizadas com sucesso." };
};

exports.getFolg_as = async (banco_dados) => {
    const pool = getTenantPool(banco_dados);
    const [rows] = await pool.query(
        "SELECT * FROM dias_folga WHERE data_folga >= CURDATE() ORDER BY data_folga ASC"
    );
    return rows;
};

exports.createFolga = async (banco_dados, folgaData) => {
    const { data_folga, motivo } = folgaData;
    const pool = getTenantPool(banco_dados);

    try {
        const [result] = await pool.query(
            "INSERT INTO dias_folga (data_folga, motivo) VALUES (?, ?)",
            [data_folga, motivo]
        );
        return { id: result.insertId, data_folga, motivo };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("Já existe uma folga agendada para este dia.");
        }
        throw error;
    }
};

exports.deleteFolga = async (banco_dados, idFolga) => {
    const pool = getTenantPool(banco_dados);
    const [result] = await pool.query(
        "DELETE FROM dias_folga WHERE id = ?",
        [idFolga]
    );
    if (result.affectedRows === 0) {
        throw new Error("Dia de folga não encontrado.");
    }
    return { message: "Folga deletada com sucesso." };
};