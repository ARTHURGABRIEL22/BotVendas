import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { FiUsers, FiUserPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import './Equipe.css'; 

const EditModal = ({ usuario, onClose, onSave }) => {
    const [permissoes, setPermissoes] = useState({
        pode_ver_pedidos: usuario.pode_ver_pedidos,
        pode_ver_estoque: usuario.pode_ver_estoque,
        pode_configurar_bot: usuario.pode_configurar_bot,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePermissionChange = (e) => {
        const { name, checked } = e.target;
        setPermissoes(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSave(usuario.id, permissoes);
        setIsSubmitting(false);
        onClose(); 
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h3>Editando Permissões de: {usuario.nome}</h3>
                    <button onClick={onClose} className="modal-close-button"><FiX /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grupo-equipe">
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_ver_pedidos" checked={permissoes.pode_ver_pedidos} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Ver Pedidos</span>
                            </label>
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_ver_estoque" checked={permissoes.pode_ver_estoque} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Ver Estoque</span>
                            </label>
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_configurar_bot" checked={permissoes.pode_configurar_bot} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Configurar Bot</span>
                            </label>
                        </div>
                    </div>
                    <footer className="modal-footer">
                        <button type="button" className="botao-secundario" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="button-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

const Equipe = () => {
    const [equipe, setEquipe] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [permissoesForm, setPermissoesForm] = useState({
        pode_ver_pedidos: true,
        pode_ver_estoque: false,
        pode_configurar_bot: false,
    });

    const [editingUser, setEditingUser] = useState(null);

    const fetchEquipe = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiService.getEquipe();
            setEquipe(response.data || []);
        } catch (err) {
            setError(err.message || "Não foi possível carregar a equipe.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEquipe();
    }, [fetchEquipe]);

    const handlePermissionChange = (e) => {
        const { name, checked } = e.target;
        setPermissoesForm(prev => ({ ...prev, [name]: checked }));
    };

    const handleCreateFuncionario = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setNotification({ type: '', message: '' });

        try {
            await apiService.createFuncionario({ nome, email, senha, permissoes: permissoesForm });
            setNome(''); setEmail(''); setSenha('');
            setPermissoesForm({ pode_ver_pedidos: true, pode_ver_estoque: false, pode_configurar_bot: false });
            setNotification({ type: 'success', message: 'Funcionário criado com sucesso!' });
            await fetchEquipe();
        } catch (err) {
            setError(err.message || "Não foi possível criar o funcionário.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteFuncionario = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar este funcionário?")) {
            try {
                setError(null);
                await apiService.deleteFuncionario(id);
                setNotification({ type: 'success', message: 'Funcionário deletado!' });
                await fetchEquipe();
            } catch (err) {
                setError(err.message || "Não foi possível deletar o funcionário.");
            }
        }
    };

    const handleSavePermissoes = async (id, permissoes) => {
        try {
            setError(null);
            await apiService.updatePermissoes(id, permissoes);
            setNotification({ type: 'success', message: 'Permissões atualizadas!' });
            await fetchEquipe();
        } catch (err) {
            setError(err.message || "Não foi possível atualizar as permissões.");
        }
    };

    return (
        <div className="container-equipe">
            {editingUser && <EditModal usuario={editingUser} onClose={() => setEditingUser(null)} onSave={handleSavePermissoes} />}
            
            <h2 className="titulo-pagina"><FiUsers /> Gerenciamento de Equipe</h2>

            {error && <div className="notification error" style={{ marginBottom: '1rem' }}>{error}</div>}
            {notification.message && <div className={`notification ${notification.type}`}>{notification.message}</div>}
            
            <div className="equipe-layout">
                
                <div className="card-form-equipe">
                    <h3><FiUserPlus /> Cadastrar Novo Funcionário</h3>
                    <form onSubmit={handleCreateFuncionario}>
                        <div className="form-grupo-equipe">
                            <label htmlFor="nome">Nome Completo</label>
                            <input id="nome" type="text" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="form-grupo-equipe">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-grupo-equipe">
                            <label htmlFor="senha">Senha Provisória</label>
                            <input id="senha" type="password" className="form-input" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength="6" />
                        </div>
                        
                        <div className="form-grupo-equipe">
                            <label>Permissões</label>
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_ver_pedidos" checked={permissoesForm.pode_ver_pedidos} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Ver Pedidos</span>
                            </label>
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_ver_estoque" checked={permissoesForm.pode_ver_estoque} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Ver Estoque</span>
                            </label>
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_configurar_bot" checked={permissoesForm.pode_configurar_bot} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Configurar Bot</span>
                            </label>
                        </div>
                        
                        <button type="submit" className="button-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Funcionário'}
                        </button>
                    </form>
                </div>

                <div className="lista-equipe-container">
                    <table className="tabela-equipe">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Cargo</th>
                                <th>Permissões</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Carregando equipe...</td></tr>
                            ) : equipe.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum funcionário cadastrado.</td></tr>
                            ) : (
                                equipe.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.nome}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`cargo-badge ${user.cargo === 'admin' ? 'cargo-admin' : 'cargo-funcionario'}`}>
                                                {user.cargo}
                                            </span>
                                        </td>
                                        <td className="permissoes-cell">
                                            {user.cargo === 'admin' ? 'Total' : (
                                                <>
                                                    {user.pode_ver_pedidos ? <span title="Pedidos">Pedidos</span> : ''}
                                                    {user.pode_ver_estoque ? <span title="Estoque">Estoque</span> : ''}
                                                    {user.pode_configurar_bot ? <span title="Bot">Bot</span> : ''}
                                                </>
                                            )}
                                        </td>
                                        <td>
                                            {user.cargo === 'funcionario' && (
                                                <div className="acoes-tabela">
                                                    <button onClick={() => setEditingUser(user)} className="botao-acao editar" title="Editar Permissões">
                                                        <FiEdit2 />
                                                    </button>
                                                    <button onClick={() => handleDeleteFuncionario(user.id)} className="botao-acao deletar" title="Deletar Funcionário">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Equipe;