import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiClipboard, FiLogOut, FiUsers } from 'react-icons/fi';
import { authService } from '../services/authService';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.permissoes) { 
            setUser(currentUser);
        } else {
            authService.logout();
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) {
        return <div className="layout-container" />;
    }

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Bot<span className="logo-accent">Vendas</span></h1>
                    <p className="loja-nome">{user.nome_empresa}</p>
                </div>
                <nav className="sidebar-nav">
                    
                    <NavLink to="/dashboard" end>
                        <FiGrid /> Visão Geral
                    </NavLink>
                    
                    {user.permissoes.ver_pedidos && (
                        <NavLink to="/pedidos">
                            <FiClipboard /> Pedidos
                        </NavLink>
                    )}

                    {user.permissoes.ver_estoque && (
                        <NavLink to="/estoque">
                            <FiBox /> Estoque
                        </NavLink>
                    )}

                    {user.cargo === 'admin' && (
                        <NavLink to="/equipe">
                            <FiUsers /> Equipe
                        </NavLink>
                    )}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout}>
                        <FiLogOut /> Sair
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;