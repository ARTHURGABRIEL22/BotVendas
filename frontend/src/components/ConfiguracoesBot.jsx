import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { FiSettings, FiClock, FiCalendar, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import './ConfiguracoesBot.css'; 

const DIAS_SEMANA = [
    { key: 'dom', label: 'Domingo' },
    { key: 'seg', label: 'Segunda' },
    { key: 'ter', label: 'Terça' },
    { key: 'qua', label: 'Quarta' },
    { key: 'qui', label: 'Quinta' },
    { key: 'sex', label: 'Sexta' },
    { key: 'sab', label: 'Sábado' },
];

const ConfiguracoesBot = () => {
    const [config, setConfig] = useState(null);
    const [folg_as, setFolg_as] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });

    const [dataFolga, setDataFolga] = useState('');
    const [motivoFolga, setMotivoFolga] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [configRes, folg_asRes] = await Promise.all([
                apiService.getBotConfig(),
                apiService.getFolg_as()
            ]);
            
            // Garante que os dias de funcionamento sejam um array
            const configData = configRes.data;
            if (typeof configData.dias_funcionamento === 'string') {
                configData.dias_funcionamento = JSON.parse(configData.dias_funcionamento || '[]');
            } else if (!Array.isArray(configData.dias_funcionamento)) {
                configData.dias_funcionamento = [];
            }
            
            setConfig(configData);
            setFolg_as(folg_asRes.data || []);
        } catch (err) {
            setError(err.message || "Não foi possível carregar as configurações.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDiaSemanaChange = (diaKey) => {
        const dias = config.dias_funcionamento || [];
        let novosDias;
        if (dias.includes(diaKey)) {
            novosDias = dias.filter(d => d !== diaKey);
        } else {
            novosDias = [...dias, diaKey];
        }
        setConfig(prev => ({ ...prev, dias_funcionamento: novosDias }));
    };

    const handleSaveConfig = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateBotConfig(config);
            setNotification({ type: 'success', message: 'Configurações salvas com sucesso!' });
        } catch (err) {
            setError(err.message || "Falha ao salvar configurações.");
        }
    };

    const handleCreateFolga = async (e) => {
        e.preventDefault();
        if (!dataFolga || !motivoFolga) return;
        try {
            await apiService.createFolga({ data_folga: dataFolga, motivo: motivoFolga });
            setNotification({ type: 'success', message: 'Folga agendada!' });
            setDataFolga('');
            setMotivoFolga('');
            fetchData(); 
        } catch (err) {
            setError(err.message || "Falha ao agendar folga.");
        }
    };

    const handleDeleteFolga = async (id) => {
        if (window.confirm("Remover este dia de folga?")) {
            try {
                await apiService.deleteFolga(id);
                setNotification({ type: 'success', message: 'Folga removida.' });
                fetchData(); 
            } catch (err) {
                setError(err.message || "Falha ao remover folga.");
            }
        }
    };

    if (isLoading) {
        return <div className="loading-container">Carregando configurações...</div>;
    }

    return (
        <div className="container-config-bot">
            <h2 className="titulo-pagina"><FiSettings /> Configurações do Bot</h2>

            {error && <div className="notification error" style={{ marginBottom: '1rem' }}>{error}</div>}
            {notification.message && <div className={`notification ${notification.type}`}>{notification.message}</div>}

            <div className="config-layout">
                <form className="card-form-config" onSubmit={handleSaveConfig}>
                    <h3><FiClock /> Horário de Funcionamento</h3>
                    
                    <div className="form-grupo-dias">
                        <label>Dias da Semana</label>
                        <div className="checkbox-group-dias">
                            {DIAS_SEMANA.map(dia => (
                                <label key={dia.key} className="checkbox-label-dia">
                                    <input 
                                        type="checkbox" 
                                        checked={config?.dias_funcionamento?.includes(dia.key) || false}
                                        onChange={() => handleDiaSemanaChange(dia.key)}
                                    />
                                    <span className="dia-chip">{dia.label.substring(0, 3)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="horario-grid">
                        <div className="form-grupo-config">
                            <label htmlFor="horario_abertura">Abertura</label>
                            <input id="horario_abertura" type="time" name="horario_abertura" value={config?.horario_abertura || '08:00'} onChange={handleConfigChange} className="form-input" />
                        </div>
                        <div className="form-grupo-config">
                            <label htmlFor="horario_fechamento">Fechamento</label>
                            <input id="horario_fechamento" type="time" name="horario_fechamento" value={config?.horario_fechamento || '18:00'} onChange={handleConfigChange} className="form-input" />
                        </div>
                    </div>
                    
                    <div className="form-grupo-config">
                        <label htmlFor="mensagem_fora_horario">Mensagem (Fora de Horário)</label>
                        <textarea id="mensagem_fora_horario" name="mensagem_fora_horario" value={config?.mensagem_fora_horario || ''} onChange={handleConfigChange} className="form-textarea" rows="4"></textarea>
                    </div>

                    <div className="form-grupo-config">
                        <label htmlFor="mensagem_folga">Mensagem (Dias de Folga)</label>
                        <textarea id="mensagem_folga" name="mensagem_folga" value={config?.mensagem_folga || ''} onChange={handleConfigChange} className="form-textarea" rows="4"></textarea>
                    </div>
                    
                    <button type="submit" className="button-submit">
                        <FiSave /> Salvar Horários
                    </button>
                </form>

                <div className="card-form-config">
                    <h3><FiCalendar /> Agendar Folgas</h3>
                    <form onSubmit={handleCreateFolga} className="folga-form">
                        <div className="form-grupo-config">
                            <label htmlFor="data_folga">Data</label>
                            <input id="data_folga" type="date" value={dataFolga} onChange={(e) => setDataFolga(e.target.value)} className="form-input" />
                        </div>
                        <div className="form-grupo-config">
                            <label htmlFor="motivo">Motivo</label>
                            <input id="motivo" type="text" value={motivoFolga} onChange={(e) => setMotivoFolga(e.target.value)} className="form-input" placeholder="Ex: Feriado Municipal" />
                        </div>
                        <button type="submit" className="button-submit-add">
                            <FiPlus /> Agendar
                        </button>
                    </form>

                    <div className="lista-folgas">
                        <h4>Próximas Folgas Agendadas</h4>
                        {folg_as.length === 0 ? (
                            <p>Nenhuma folga agendada.</p>
                        ) : (
                            <ul>
                                {folg_as.map(folga => (
                                    <li key={folga.id}>
                                        <span>
                                            <strong>{new Date(folga.data_folga).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</strong> - {folga.motivo}
                                        </span>
                                        <button onClick={() => handleDeleteFolga(folga.id)} className="botao-acao deletar" title="Remover Folga">
                                            <FiTrash2 />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracoesBot;