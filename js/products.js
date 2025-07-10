const MAX_PRODUCT_FOR_PAGE = 6;
const CATEGORY = "womens-dresses";

async function getAllProducts(limit, skip) {
    try {
        const response = await fetch(`https://dummyjson.com/products/category/${CATEGORY}?limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function renderProducts(page = 0, containerId = 'products-grid', isFeatured = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '<p class="loading">Cargando productos...</p>';
    
    try {
        const products = await getAllProducts(isFeatured ? 4 : MAX_PRODUCT_FOR_PAGE, page * MAX_PRODUCT_FOR_PAGE);
        container.innerHTML = '';
        
        if (products.length === 0) {
            container.innerHTML = '<p class="no-products">No se encontraron productos</p>';
            return;
        }
        
        products.forEach(product => {
            container.appendChild(createProductCard(product));
        });
        
        if (!isFeatured) {
            const pageInput = document.getElementById('page-input');
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            
            if (pageInput) pageInput.value = page + 1;
            if (prevBtn) prevBtn.disabled = page === 0;
            if (nextBtn) nextBtn.disabled = products.length < MAX_PRODUCT_FOR_PAGE;
        }
        
    } catch (error) {
        container.innerHTML = '<p class="error">Error al cargar productos</p>';
    }
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.dataset.productId = product.id;
    
    productCard.innerHTML = `
        <div class="img-container">
            <img src="${product.thumbnail}" alt="${product.title}">
        </div>
        <div class="description-container">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <span>$${product.price}</span>
        </div>
        <div class="kart-options-container">
            <button class="min-btn">-</button>
            <input type="text" value="1" disabled>
            <button class="max-btn">+</button>
        </div>
        <div class="kart-btn-container">
            <button>Agregar al carrito</button>
        </div>
    `;
    
    const minBtn = productCard.querySelector('.min-btn');
    const maxBtn = productCard.querySelector('.max-btn');
    const quantityInput = productCard.querySelector('input');
    const addBtn = productCard.querySelector('.kart-btn-container button');
    
    minBtn.addEventListener('click', () => {
        if (Number(quantityInput.value) > 1) {
            quantityInput.value = Number(quantityInput.value) - 1;
        }
    });
    
    maxBtn.addEventListener('click', () => {
        if (Number(quantityInput.value) < 10) {
            quantityInput.value = Number(quantityInput.value) + 1;
        }
    });
    
    addBtn.addEventListener('click', () => {
        const productItem = {
            product: product,
            quantity: Number(quantityInput.value)
        };
        
        addToKart(productItem);
        alert(`¡${product.title} agregado con estilo a tu carrito!`);
    });
    
    return productCard;
}

function addToKart(productItem) {
    let kart = JSON.parse(localStorage.getItem('kart')) || [];
    const existingItem = kart.find(item => item.product.id === productItem.product.id);
    
    if (existingItem) {
        existingItem.quantity += productItem.quantity;
    } else {
        kart.push(productItem);
    }
    
    localStorage.setItem('kart', JSON.stringify(kart));
    updateKartQuantity();
}

document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    

    if (document.getElementById('featured-products')) {
        renderProducts(0, 'featured-products', true);
    }

    if (document.getElementById('products-grid')) {
        renderProducts(0);
    }
    
 
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPage = parseInt(document.getElementById('page-input').value) - 1;
            if (currentPage > 1) renderProducts(currentPage - 2);
        });
        
        nextBtn.addEventListener('click', () => {
            const currentPage = parseInt(document.getElementById('page-input').value);
            renderProducts(currentPage);
        });
    }
});