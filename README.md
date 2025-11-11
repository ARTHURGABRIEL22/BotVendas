````markdown
# 🧠 Bot Vendas – Sistema SaaS de Automação para WhatsApp

## 📌 Visão Geral

O **Bot Vendas** é um sistema completo de **SaaS (Software como Serviço)**, desenvolvido como um Projeto de Conclusão de Curso (TCC). A plataforma permite que pequenas e médias empresas automatizem seu atendimento, gerenciamento de catálogo e processo de vendas diretamente pelo **WhatsApp**.

O sistema é construído sobre uma arquitetura **Multi-Tenant**, onde cada empresa cliente possui um banco de dados de operação isolado, garantindo total privacidade e segurança dos dados. O gerenciamento é feito através de um painel de controle web intuitivo, que conta com um sistema de permissões **RBAC (Role-Based Access Control)**, distinguindo o acesso entre `Administradores` e `Funcionários`.

---

## ✨ Funcionalidades Principais

* **Arquitetura Multi-Tenant:** Um banco de dados central (`rzbotvendas`) gerencia as lojas, e cada loja (`empresa_...`) tem seu próprio banco de dados para clientes, pedidos e estoque.
* **Painel Super Admin (`/admin`):** Uma interface dedicada para o dono do SaaS criar, gerenciar e configurar novas contas de lojas.
* **Controle de Acesso (RBAC):** O gestor da loja (`admin`) pode criar contas para `funcionários` e definir permissões granulares sobre quais módulos eles podem acessar (ex: ver apenas pedidos, mas não o estoque).
* **Autenticação Segura:** Sistema de login completo com senhas criptografadas (Bcrypt) e autenticação de sessão via **Tokens JWT (JSON Web Token)**.
* **Gerenciamento de Estoque (CRUD):** Funcionalidades completas para criar, ler, atualizar e deletar produtos, incluindo upload de imagens.
* **Bot Conversacional (WhatsApp):**
    * Identificação automática da loja pelo número de telefone.
    * Fluxo de catálogo completo com paginação e busca.
    * Gerenciamento de carrinho (adicionar, remover, ver carrinho).
    * Fluxo de checkout completo (coleta de nome, CPF, endereço).
    * Registro automático do pedido no banco de dados da loja.
* **Modo de Atendimento Humano:** O bot pode ser "pausado" pelo cliente para falar com um atendente e reativado com um comando, sem que o bot interfira na conversa.
* **Painel do Cliente:** Dashboard com indicadores em tempo real (Total de Produtos, Itens em Estoque, Pedidos Hoje) e gerenciamento de pedidos.

---

## 🏗 Arquitetura do Sistema

O projeto é dividido em três microsserviços independentes que se comunicam via API REST:

1.  **Backend (API Principal):** A API REST central construída em Node.js. Cuida da autenticação, regras de negócio, gerenciamento de empresas e toda a comunicação com os bancos de dados.
2.  **Frontend (Painel de Controle):** Uma aplicação SPA (Single Page Application) construída em React.js. É a interface web que os gestores e funcionários das lojas usam para gerenciar seus negócios.
3.  **Bot (Serviço de Mensageria):** Um serviço independente em Node.js que se conecta ao WhatsApp (usando `whatsapp-web.js`) e consome a API Principal para buscar dados (catálogo) e registrar informações (pedidos).



---

## 🛠 Tecnologias e Versões

Esta é a stack principal do projeto. (Nota: As versões listadas são padrões de mercado em 2025. Confirme em seus arquivos `package.json` para precisão absoluta.)

| Área | Tecnologia | Versão Sugerida | Propósito |
| :--- | :--- | :--- | :--- |
| **Linguagens** | Node.js | 20.x.x | Ambiente de execução (Backend e Bot) |
| | JavaScript | ES6+ | Linguagem principal |
| | SQL | - | Linguagem de consulta ao banco |
| **Backend** | Express.js | ~4.19.2 | Framework da API |
| | MySQL2 | ~3.9.0 | Driver de conexão com o MySQL |
| | JSON Web Token (`jsonwebtoken`) | ~9.0.0 | Autenticação e Sessão |
| | Bcrypt | ~5.1.1 | Criptografia de senhas |
| | CORS | ~2.8.5 | Habilita a comunicação com o frontend |
| | Dotenv | ~16.4.5 | Gerenciamento de variáveis de ambiente |
| | Multer | ~1.4.5 | Upload de arquivos e imagens |
| **Frontend** | React.js | ~18.2.0 | Biblioteca de interface |
| | React Router DOM | ~6.22.0 | Gerenciamento de rotas (páginas) |
| | React Icons | ~5.0.0 | Pacote de ícones |
| **Bot** | `whatsapp-web.js` | ~1.23.0 | Biblioteca principal de conexão com o WhatsApp |
| | `qrcode-terminal` | ~0.12.0 | Geração do QR Code de login no terminal |
| **Banco de Dados** | MariaDB | ~10.4.32 | Sistema de gerenciamento do banco de dados |
| **Ferramentas** | Git & GitHub | - | Versionamento de código |
| | VS Code | - | IDE de desenvolvimento |
| | phpMyAdmin | ~5.2.1 | Interface de gerenciamento do banco |

---

## ⚙️ Instalação e Execução Local

Para executar o ecossistema completo, você precisará de **3 terminais** rodando simultaneamente.

### Pré-requisitos
* Node.js (v18 ou superior)
* NPM (v9 ou superior)
* Um servidor MySQL (como XAMPP ou WAMP)

### 1️⃣ Banco de Dados

1.  Inicie seu serviço MySQL (Ex: XAMPP).
2.  Abra o **phpMyAdmin**.
3.  Crie o banco de dados central: `CREATE DATABASE rzbotvendas;`
4.  Importe o arquivo `rzbotvendas.sql` para dentro deste banco.

### 2️⃣ Backend (API Principal)

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env e configure-o com sua porta, 
#    senha do banco e sua SECRET_KEY para o JWT
cp .env.example .env

# 4. Inicie o servidor
npm start
# O terminal deve mostrar: 🔥 Servidor rodando na porta 5000
````

### 3️⃣ Frontend (Painel)

```bash
# (Em um NOVO terminal)
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env e configure a URL da API
#    Ex: REACT_APP_API_URL=http://localhost:5000/api
cp .env.example .env

# 4. Inicie a aplicação React
npm start
# O navegador deve abrir em http://localhost:3000
```

### 4️⃣ Bot (Serviço de WhatsApp)

```bash
# (Em um TERCEIRO terminal)
# 1. Navegue até a pasta do bot
cd bot

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env e configure as URLs
#    Ex: MAIN_API_URL=http://localhost:5000/api
#        BOT_API_PORT=5001
cp .env.example .env

# 4. Inicie o bot
npm start

# 5. Escaneie o QR Code que aparecer no terminal
#    com o celular que será o número da loja
```

-----

## 🔮 Roadmap / Melhorias Futuras

O projeto está completo e funcional, mas sua arquitetura permite uma vasta gama de evoluções futuras, como:

  * **Persistência de Estado do Bot:** Utilizar **Redis** para armazenar o estado das conversas, impedindo que carrinhos de compra sejam perdidos se o bot reiniciar.
  * **Integração com IA (NLP):** Substituir o sistema de comandos (1, 2, 3) por uma plataforma de Processamento de Linguagem Natural (como Google Dialogflow) para permitir que o cliente escreva de forma natural (ex: "Quero ver camisas azuis").
  * **Pagamentos In-Bot:** Integrar gateways de pagamento (Mercado Pago, Stripe) para gerar links de cartão de crédito ou QR Codes PIX (Copia e Cola) diretamente na conversa do WhatsApp.
  * **Analytics Avançado:** Criar um painel de relatórios no frontend com gráficos (usando `Chart.js`) para que o lojista possa ver produtos mais vendidos, horários de pico e ticket médio.
  * **Notificações em Tempo Real:** Usar **WebSockets** para que o painel do lojista toque um alarme e atualize a lista de pedidos instantaneamente quando um novo pedido chegar pelo bot.
  * **Progressive Web App (PWA):** Permitir que o lojista "instale" o painel no celular como um aplicativo.

-----

**Desenvolvido com 💡 por YNF ANTHONY**

```
```
