# 🧠 Bot Vendas – Sistema SaaS de Automação para WhatsApp

## 📌 Visão Geral

O **Bot Vendas** é um sistema completo de **SaaS (Software como Serviço)** desenvolvido como um **Projeto de Conclusão de Curso (TCC)**.  
A plataforma permite que pequenas e médias empresas automatizem seu atendimento, gerenciamento de catálogo e processo de vendas diretamente pelo **WhatsApp**.

O sistema é construído sobre uma arquitetura **Multi-Tenant**, onde cada empresa cliente possui um banco de dados de operação isolado, garantindo **privacidade e segurança** dos dados.  
O gerenciamento é feito através de um **painel de controle web intuitivo**, que conta com um sistema de permissões **RBAC (Role-Based Access Control)**, distinguindo o acesso entre `Administradores` e `Funcionários`.

---

## ✨ Funcionalidades Principais

- **Arquitetura Multi-Tenant:**  
  Um banco de dados central (`rzbotvendas`) gerencia as lojas, e cada loja (`empresa_...`) tem seu próprio banco para clientes, pedidos e estoque.

- **Painel Super Admin (`/admin`):**  
  Interface dedicada ao dono do SaaS para criar, gerenciar e configurar novas contas de lojas.

- **Controle de Acesso (RBAC):**  
  O gestor da loja (`admin`) pode criar contas de `funcionários` e definir permissões granulares sobre módulos como Pedidos, Estoque e Configurações do Bot.

- **Módulo de Configuração do Bot:**  
  Permite definir:
  - Horários de funcionamento (ex: 08:00 às 18:00)
  - Dias de atendimento (ex: Seg a Sáb)
  - Mensagens personalizadas fora do horário
  - Agendamento de folgas (ex: feriados com motivo)

- **Autenticação Segura:**  
  Login com **senhas criptografadas (Bcrypt)** e autenticação via **JWT (JSON Web Token)**.

- **Gerenciamento de Estoque (CRUD):**  
  Cadastrar, visualizar, editar e excluir produtos, com upload de imagens.

- **Bot Conversacional (WhatsApp):**
  - Verificação automática de horário e folgas
  - Identificação automática da loja pelo número
  - Catálogo com paginação e busca
  - Gerenciamento de carrinho (adicionar, remover, visualizar)
  - Fluxo de checkout (nome, CPF, endereço)
  - Registro automático do pedido no banco da loja

- **Modo de Atendimento Humano:**  
  O cliente pode pausar o bot para falar com um atendente e reativá-lo com comando específico.

- **Painel do Cliente:**  
  Dashboard com indicadores em tempo real (Total de Produtos, Itens em Estoque, Pedidos Hoje) e gestão de pedidos.

---

## 🏗 Arquitetura do Sistema

O projeto é dividido em **três microsserviços independentes** que se comunicam via **API REST**:

1. **Backend (API Principal):**  
   Construída em **Node.js**, responsável pela autenticação, regras de negócio, gerenciamento de empresas e comunicação com os bancos de dados.

2. **Frontend (Painel de Controle):**  
   Aplicação **SPA em React.js**, utilizada pelos gestores e funcionários para administrar as operações.

3. **Bot (Serviço de Mensageria):**  
   Serviço independente em **Node.js** que se conecta ao **WhatsApp** (via `whatsapp-web.js`), consumindo a API principal para obter dados (catálogo) e registrar pedidos.

---

## 🛠 Tecnologias e Versões

> As versões listadas são referências médias do mercado em 2025.  
> Consulte seu arquivo `package.json` para confirmar as versões exatas.

| Área | Tecnologia | Versão | Propósito |
| :--- | :--- | :---: | :--- |
| **Linguagens** | Node.js | 20.x.x | Ambiente de execução (Backend e Bot) |
|  | JavaScript | ES6+ | Linguagem principal |
|  | SQL | - | Consultas ao banco de dados |
| **Backend** | Express.js | ~4.19.2 | Framework da API |
|  | MySQL2 | ~3.9.0 | Conexão com MySQL |
|  | JSON Web Token (`jsonwebtoken`) | ~9.0.0 | Autenticação JWT |
|  | Bcrypt | ~5.1.1 | Criptografia de senhas |
|  | CORS | ~2.8.5 | Comunicação entre domínios |
|  | Dotenv | ~16.4.5 | Variáveis de ambiente |
|  | Multer | ~1.4.5 | Upload de arquivos/imagens |
| **Frontend** | React.js | ~18.2.0 | Biblioteca de interface |
|  | React Router DOM | ~6.22.0 | Gerenciamento de rotas |
|  | React Icons | ~5.0.0 | Ícones vetoriais |
| **Bot** | `whatsapp-web.js` | ~1.23.0 | Integração com WhatsApp |
|  | `qrcode-terminal` | ~0.12.0 | Geração de QR Code no terminal |
| **Banco de Dados** | MariaDB | ~10.4.32 | Sistema de banco de dados |
| **Ferramentas** | Git & GitHub | - | Versionamento |
|  | VS Code | - | IDE de desenvolvimento |
|  | phpMyAdmin | ~5.2.1 | Interface de banco de dados |

---

## ⚙️ Instalação e Execução Local

O sistema requer **3 terminais** rodando simultaneamente (Backend, Frontend e Bot).

### 🔧 Pré-requisitos

- Node.js (v18 ou superior)  
- NPM (v9 ou superior)  
- Servidor MySQL (XAMPP, WAMP ou equivalente)

---

### 1️⃣ Banco de Dados

1. Inicie o servidor MySQL (ex: XAMPP).  
2. Abra o **phpMyAdmin**.  
3. Crie o banco de dados central:
   ```sql
   CREATE DATABASE rzbotvendas;
````

4. Importe o arquivo `rzbotvendas.sql` para este banco.

---

### 2️⃣ Backend (API Principal)

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env e configure:
#    PORT=5000
#    DB_HOST=localhost
#    DB_USER=root
#    DB_PASS=sua_senha
#    JWT_SECRET=sua_chave_secreta
cp .env.example .env

# 4. Inicie o servidor
npm start
# 🔥 Saída esperada: Servidor rodando na porta 5000
```

---

### 3️⃣ Frontend (Painel)

```bash
# Em um novo terminal
cd frontend

# Instale as dependências
npm install

# Crie o arquivo .env e adicione:
# REACT_APP_API_URL=http://localhost:5000/api
cp .env.example .env

# Inicie a aplicação React
npm start
# 🌐 Acesse em: http://localhost:3000
```

---

### 4️⃣ Bot (Serviço de WhatsApp)

```bash
# Em um terceiro terminal
cd bot

# Instale as dependências
npm install

# Configure o .env:
# MAIN_API_URL=http://localhost:5000/api
# BOT_API_PORT=5001
cp .env.example .env

# Inicie o bot
npm start

# Escaneie o QR Code com o celular da loja
```

---

## 🔮 Roadmap / Melhorias Futuras

O sistema está funcional e escalável, mas há espaço para aprimoramentos, como:

* **Persistência de Estado do Bot:**
  Implementar **Redis** para armazenar o estado das conversas e carrinhos.

* **Integração com IA (NLP):**
  Usar **Dialogflow** ou outra IA para substituir comandos por linguagem natural.
  Ex: “Quero ver camisas azuis”.

* **Pagamentos In-Bot:**
  Integração com **Mercado Pago**, **Stripe** ou **PIX** via QR Code.

* **Analytics Avançado:**
  Painel de relatórios com gráficos via `Chart.js` (produtos mais vendidos, horários de pico, ticket médio).

* **Notificações em Tempo Real:**
  Implementação de **WebSockets** para alertas instantâneos no painel.

* **Progressive Web App (PWA):**
  Permitir instalação do painel no celular como app nativo.

---

## 👨‍💻 Autor

**Desenvolvido com 💡 por [YNF ANTHONY](https://github.com/ynfanthony)**
Sistema criado como TCC de conclusão de curso, com foco em escalabilidade e automação de vendas via WhatsApp.

---

```
