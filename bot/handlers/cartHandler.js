const state = require('../state');
const templates = require('../templates');

exports.handleAddToCart = async (client, message) => {
    const from = message.from;
    const text = message.body.toLowerCase().trim();
    const catalogState = state.catalogStates[from];

    if (!catalogState) {
        await client.sendMessage(from, '⚠️ Para adicionar um item, primeiro veja o catálogo digitando "1".');
        return;
    }

    const itemIndexes = text.match(/\d+/g);
    if (!itemIndexes) {
        await client.sendMessage(from, '❌ Não entendi qual produto você quer. Tente "quero 1" ou "adicionar 2".');
        return;
    }

    const productsToAdd = [];
    const startIndex = (catalogState.page - 1) * 5; 

    for (const indexStr of itemIndexes) {
        const index = parseInt(indexStr, 10);
        const product = catalogState.filtered[startIndex + index - 1];
        if (product) {
            productsToAdd.push(product);
        } else {
            await client.sendMessage(from, `❌ Produto número ${index} não encontrado nesta página.`);
        }
    }
    
    if (productsToAdd.length > 0) {
        state.userStates[from] = 'adding_to_cart';
        state.addToCartQueue[from] = { queue: productsToAdd };
        await client.sendMessage(from, `📦 Quantas unidades de *${productsToAdd[0].nome}* você deseja?`);
    }
};

exports.handleQuantityResponse = async (client, message) => {
    const from = message.from;
    const text = message.body.toLowerCase().trim();
    const queueState = state.addToCartQueue[from];

    if (!queueState || queueState.queue.length === 0) {
        delete state.userStates[from];
        await client.sendMessage(from, "Ops! Parece que nos perdemos. Digite 'oi' para começar de novo.");
        return;
    }

    const quantity = parseInt(text, 10);
    if (isNaN(quantity) || quantity <= 0) {
        await client.sendMessage(from, '❗ Por favor, digite uma *quantidade numérica válida* (ex: 1, 2, 3...).');
        return;
    }

    const product = queueState.queue.shift(); 
    
    if (!state.carts[from]) {
        state.carts[from] = [];
    }

    const existingCartItem = state.carts[from].find(item => item.product.id === product.id);
    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        state.carts[from].push({ product, quantity });
    }

    const subtotal = (parseFloat(product.preco) * quantity).toFixed(2);
    await client.sendMessage(from, `✅ *${quantity}x ${product.nome}* adicionado(s) ao carrinho por R$ ${subtotal}!`);

    if (queueState.queue.length > 0) {
        const nextProduct = queueState.queue[0];
        await client.sendMessage(from, `📦 E quantas unidades de *${nextProduct.nome}* você deseja?`);
    } else {
        delete state.addToCartQueue[from];
        state.userStates[from] = null;
        await client.sendMessage(from, templates.mainMenu);
    }
};

exports.showCart = async (client, from) => {
    const cart = state.carts[from] || [];
    if (cart.length === 0) {
        await client.sendMessage(from, '🛒 Seu carrinho está vazio no momento.');
        return;
    }

    let summary = '*🛍️ Itens no seu carrinho:*\n\n';
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = (parseFloat(item.product.preco) * item.quantity);
        total += subtotal;
        summary += `*${index + 1}.* ${item.product.nome} (${item.quantity}x)\n   - Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    });

    summary += `\n💰 *Total geral:* R$ ${total.toFixed(2)}`;
    summary += `\n\n✅ Digite *"finalizar"* para concluir seu pedido.`;
    summary += `\n🗑️ Digite *"remover [Nº]"* para tirar 1 unidade.`;
    
    await client.sendMessage(from, summary);
};

exports.removeItem = async (client, message) => {
    const from = message.from;
    const text = message.body.toLowerCase().trim();
    const cart = state.carts[from] || [];

    const numeros = text.match(/\d+/g);

    if (!numeros || numeros.length === 0) {
        await client.sendMessage(from, '❌ Você precisa me dizer qual item remover. Exemplo: "remover 1".');
        return;
    }

    const indexToRemove = parseInt(numeros[0], 10);

    let qtdToRemove = 1;
    if (numeros.length > 1) {
        qtdToRemove = parseInt(numeros[1], 10);
    }

    if (isNaN(indexToRemove) || indexToRemove < 1 || indexToRemove > cart.length) {
        await client.sendMessage(from, '❌ Número do item inválido. Verifique a lista do seu carrinho.');
        return;
    }

    const itemIndex = indexToRemove - 1;
    const item = cart[itemIndex];

    console.log(`[DEBUG REMOVER] Item: ${item.product.nome}, Qtd Atual: ${item.quantity}, Qtd Remover: ${qtdToRemove}`);

    const qtdAtual = parseInt(item.quantity, 10);
    const qtdParaTirar = parseInt(qtdToRemove, 10);

    if (qtdAtual > qtdParaTirar) {
        item.quantity = qtdAtual - qtdParaTirar;
        await client.sendMessage(from, `➖ Removido(s) ${qtdParaTirar} unidade(s) de *${item.product.nome}*. Restam ${item.quantity}.`);
    } else {
        cart.splice(itemIndex, 1);
        await client.sendMessage(from, `🗑️ Item *${item.product.nome}* removido completamente do carrinho.`);
    }

    if (cart.length > 0) {
        await this.showCart(client, from);
    } else {
        await client.sendMessage(from, '🛒 Seu carrinho agora está vazio.');
        await client.sendMessage(from, templates.mainMenu);
    }
};