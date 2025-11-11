import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { FiUsers, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import './Equipe.css'; 

const Equipe = () => {
    const [equipe, setEquipe] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [permissoes, setPermissoes] = useState({
        pode_ver_pedidos: true, 
        pode_ver_estoque: false,
    });

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
        setPermissoes(prev => ({ ...prev, [name]: checked }));
    };

    const handleCreateFuncionario = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await apiService.createFuncionario({ nome, email, senha, permissoes });
            setNome('');
            setEmail('');
            setSenha('');
            setPermissoes({ pode_ver_pedidos: true, pode_ver_estoque: false }); 
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
                await fetchEquipe(); 
            } catch (err) {
                setError(err.message || "Não foi possível deletar o funcionário.");
            }
        }
    };

    return (
        <div className="container-equipe">
            <h2 className="titulo-pagina"><FiUsers /> Gerenciamento de Equipe</h2>

            {error && <div className="notification error" style={{ marginBottom: '1rem' }}>{error}</div>}
            
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
                                <input type="checkbox" name="pode_ver_pedidos" checked={permissoes.pode_ver_pedidos} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Ver Pedidos</span>
                            </label>
                            <label className="checkbox-label-equipe">
                                <input type="checkbox" name="pode_ver_estoque" checked={permissoes.pode_ver_estoque} onChange={handlePermissionChange} />
                                <span className="checkbox-custom"></span>
                                <span>Ver Estoque</span>
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
                                                </>
                                            )}
                                        </td>
                                        <td>
                                            {user.cargo === 'funcionario' && (
                                                <button onClick={() => handleDeleteFuncionario(user.id)} className="botao-acao deletar" title="Deletar Funcionário">
                                                    <FiTrash2 />
                                                </button>
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