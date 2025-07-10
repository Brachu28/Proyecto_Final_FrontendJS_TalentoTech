function renderKart() {
    const container = document.getElementById('kart-data-container');
    if (!container) return;
    
    const kart = JSON.parse(localStorage.getItem('kart')) || [];
    container.innerHTML = '';
    
    if (kart.length === 0) {
        container.innerHTML = '<p class="empty-kart">Tu carrito está vacío</p>';
        return;
    }
    
    kart.forEach(item => {
        container.appendChild(createCardItem(item));
    });
    
    container.appendChild(createCardTotalAmount(kart));
}

function createCardItem(kartItem) {
    const cardItem = document.createElement('div');
    cardItem.classList.add('kart-item-container');
    
    cardItem.innerHTML = `
        <div class="kart-item-img-container">
            <img src="${kartItem.product.thumbnail}" alt="${kartItem.product.title}">
        </div>
        <div class="kart-item-description">
            <span>${kartItem.product.title}</span>
        </div>
        <div class="kart-item-price">
            <span>$${kartItem.product.price}</span>
        </div>
        <div class="kart-item-quantity">
            <span>x${kartItem.quantity}</span>
        </div>
        <div class="kart-item-subtotal">
            <span>$${(kartItem.product.price * kartItem.quantity).toFixed(2)}</span>
        </div>
    `;
    
    return cardItem;
}

function createCardTotalAmount(kart) {
    const total = kart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const card = document.createElement('div');
    card.classList.add('kart-total-amount-container');
    
    card.innerHTML = `
        <span id="kart-total-title">TOTAL</span>
        <span id="kart-total-amount">$${total.toFixed(2)}</span>
    `;
    
    return card;
}

function emptyKart() {
    localStorage.removeItem('kart');
    renderKart();
    updateKartQuantity();
}

function buy() {
    const kart = JSON.parse(localStorage.getItem('kart')) || [];
    if (kart.length === 0) {
        alert('Tu carrito está vacío :(');
        return;
    }
    
    const total = kart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    emptyKart();
    alert(`¡Compra realizada con éxito por $${total.toFixed(2)}!\nEn breve recibirás un correo con los detalles. Gracias por elegirnos!`);
}

document.addEventListener('DOMContentLoaded', () => {
    const buyBtn = document.getElementById('buy-btn');
    const emptyBtn = document.getElementById('empty-kart-btn');
    
    renderKart();
    updateKartQuantity();
    
    if (buyBtn) {
        buyBtn.addEventListener('click', buy);
    }
    
    if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de vaciar el carrito? Piensalo!')) {
                emptyKart();
            }
        });
    }
});