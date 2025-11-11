const USER_KEY = 'botvendas_user';
const TOKEN_KEY = 'botvendas_token';

export const authService = {
    /**
     * Salva os dados do usuário e o token no localStorage após o login.
     * @param {object} usuario - O objeto 'usuario' completo vindo da API (já contém nome, email, cargo, permissoes).
     * @param {string} token - O token JWT.
     */
    login: (usuario, token) => {
        localStorage.setItem(USER_KEY, JSON.stringify(usuario));
        localStorage.setItem(TOKEN_KEY, token);
    },

    logout: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};