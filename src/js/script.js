// ===== MOCK DATA =====
const products = [
    { id: 1, name: 'Sauvage Elixir', brand: 'Dior', price: 129, originalPrice: 799, volume: '100ml', badge: 'Outlet', trending: true },
    { id: 2, name: 'Coco Mademoiselle', brand: 'Chanel', price: 129, originalPrice: 899, volume: '100ml',  badge: 'Best Seller', trending: true },
    { id: 3, name: 'Acqua di Giò', brand: 'Armani', price: 129, originalPrice: 549, volume: '100ml', badge: 'Outlet', trending: false },
    { id: 4, name: 'Eros Pour Femme', brand: 'Versace', price: 129, originalPrice: 599, volume: '100ml', badge: null, trending: true },
    { id: 5, name: "J'adore Infinissime", brand: 'Dior', price: 129, originalPrice: 949, volume: '100ml', badge: 'Novo', trending: false },
    { id: 6, name: 'Bleu de Chanel', brand: 'Chanel', price: 129, originalPrice: 749, volume: '100ml', badge: 'Outlet', trending: false },
    { id: 7, name: 'Si Passione', brand: 'Armani', price: 129, originalPrice: 629, volume: '100ml', badge: null, trending: true },
    { id: 8, name: 'Dylan Blue', brand: 'Versace', price: 129, originalPrice: 529, volume: '100ml', badge: 'Outlet', trending: false },
    { id: 9, name: 'Miss Dior', brand: 'Dior', price: 129, originalPrice: 829, volume: '100ml', badge: null, trending: false },
    { id: 10, name: 'Chance Eau Tendre', brand: 'Chanel', price: 129, originalPrice: 799, volume: '100ml', badge: 'Best Seller', trending: true },
    { id: 11, name: 'Code Absolu', brand: 'Armani', price: 129, originalPrice: 649, volume: '100ml, 50ml, 30ml, 10ml', badge: null, trending: false },
    { id: 12, name: 'Crystal Noir', brand: 'Versace', price: 129, originalPrice: 559, volume: '100ml', badge: 'Outlet', trending: false }
];

let cart = JSON.parse(localStorage.getItem('lartparfum_cart')) || [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeMenu();
    renderTrendingProducts();
    renderAllProducts();
    updateCartUI();
    initializeFilters();
    initializeCart();
    initializeForms();
    initializeSmoothScroll();
});

// ===== MOBILE MENU =====
function initializeMenu() {
    const btnMobile = document.querySelector('.btn-mobile');
    const navLinks = document.getElementById('nav-links');

    btnMobile.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('show');
        const icon = btnMobile.querySelector('i');
        
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        btnMobile.setAttribute('aria-expanded', isOpen);
        btnMobile.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fechar menu ao clicar em link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            const icon = btnMobile.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            btnMobile.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== RENDER PRODUCTS =====
function renderTrendingProducts() {
    const grid = document.getElementById('trendingGrid');
    if (!grid) return;

    const trendingProducts = products.filter(p => p.trending).slice(0, 4);
    grid.innerHTML = trendingProducts.map(product => createProductCard(product)).join('');
    attachAddToCartListeners(grid);
}

function renderAllProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => createProductCard(product)).join('');
    attachAddToCartListeners(grid);
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-brand">${product.brand}</span>
                <h3 class="product-name">${product.name}</h3>
                <span class="product-volume">${product.volume}</span>
                <div class="product-footer">
                    <div class="product-price">
                        ${product.originalPrice ? `<span class="price-original">R$ ${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="price-current">R$ ${product.price.toFixed(2)}</span>
                    </div>
                    <button class="btn-add-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachAddToCartListeners(container) {
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            addToCart(productId);
            showAddedFeedback(e.currentTarget);
        });
    });
}

function showAddedFeedback(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'var(--color-success)';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 1000);
}

// ===== CART MANAGEMENT =====
function initializeCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartClose = document.querySelector('.cart-close');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', handleCheckout);
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function updateCartUI() {
    const badge = document.querySelector('.cart-badge');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart body
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-volume">${item.volume}</div>
                    <div class="cart-item-footer">
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('lartparfum_cart', JSON.stringify(cart));
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    alert('Função de checkout será implementada em breve!');
}

// ===== FILTERS =====
function initializeFilters() {
    const sortFilter = document.getElementById('sortFilter');
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const resetBtn = document.getElementById('resetFilters');

    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    if (brandFilter) brandFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

function applyFilters() {
    let filtered = [...products];
    
    // Brand filter
    const brand = document.getElementById('brandFilter').value;
    if (brand !== 'all') {
        filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }
    
    // Price filter
    const price = document.getElementById('priceFilter').value;
    if (price !== 'all') {
        if (price === '500+') {
            filtered = filtered.filter(p => p.price >= 500);
        } else {
            const [min, max] = price.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
    }
    
    // Sort filter
    const sort = document.getElementById('sortFilter').value;
    switch (sort) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
    }
    
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = filtered.map(product => createProductCard(product)).join('');
    attachAddToCartListeners(grid);
}

function resetFilters() {
    document.getElementById('sortFilter').value = 'featured';
    document.getElementById('brandFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    renderAllProducts();
}

// ===== FORMS =====
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        });
    }

    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Obrigado por se inscrever na nossa newsletter!');
            form.reset();
        });
    });
}
// ===== MAKE FUNCTIONS GLOBAL =====
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;


