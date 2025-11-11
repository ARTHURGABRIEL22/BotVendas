const state = require('./state');
const apiService = require('../services/apiService');
const commandHandler = require('./handlers/commandHandler');
const catalogHandler = require('./handlers/catalogHandler');
const cartHandler = require('./handlers/cartHandler');
const checkoutHandler = require('./handlers/checkoutHandler');

exports.handleMessage = async (client, message) => {
    
    if (!state.storeData) {
        try {
            const host = client.info;
            const botNumber = host.wid.user;
            if (!botNumber) throw new Error('Número do bot não encontrado.');
            
            const storeApiResponse = await apiService.getStoreDataByNumber(botNumber);
            state.storeData = storeApiResponse.data; 
            console.log(`🏪 Bot operando para a loja: ${state.storeData.nome}`);
        } catch (err) {
            console.error('❌ Erro crítico ao buscar dados da loja na inicialização:', err);
            return; 
        }
    }
    
    if (!message || !message.body || message.fromMe) return; 

    const from = message.from;
    const text = message.body.toLowerCase().trim();
    const userState = state.userStates[from];

    if (userState === 'human_support') {
        if (text === 'finalizar atendimento') {
            delete state.userStates[from]; 
            await client.sendMessage(from, "Atendimento humanizado finalizado. ✅\n\nEstou de volta! Digite *oi* para ver o menu principal.");
        } else {
            return; 
        }
        return; 
    }

    try {
        if (userState === 'adding_to_cart') {
            await cartHandler.handleQuantityResponse(client, message);
        } else if (userState === 'checkout') {
            await checkoutHandler.handleCheckoutStep(client, message);
        } else if (userState === 'catalog') {
            await catalogHandler.handleCatalogInteraction(client, message);
        } else {
            await commandHandler.handleCommand(client, message);
        }
    } catch (error) {
        console.error(`❌ Erro ao processar mensagem de ${from}:`, error);
        await client.sendMessage(from, '🤖 Ocorreu um erro inesperado. Por favor, tente novamente.');
    }
};