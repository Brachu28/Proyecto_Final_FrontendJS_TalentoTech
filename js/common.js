function updateKartQuantity() {
    const kartCount = document.getElementById('kart-count');
    const kart = JSON.parse(localStorage.getItem('kart')) || [];
    
    if (kart.length > 0) {
        kartCount.textContent = kart.length;
        kartCount.style.display = 'flex';
    } else {
        kartCount.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.querySelector('.burger-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('menu-active');
        });
    }
    
    updateKartQuantity();
});