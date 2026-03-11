// js/app.js

class App {
    constructor() {
        this.appEl = document.getElementById('app');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.cartItemsEl = document.getElementById('cartItems');
        this.cartTotalEl = document.getElementById('cartTotalPrice');
        this.cartCountEl = document.getElementById('cartCount');
        
        // Listeners
        window.addEventListener('hashchange', () => this.handleRouting());
        
        this.init();
    }

    init() {
        this.updateHeaderAuth();
        this.updateCartUI();
        this.handleRouting();
    }

    // --- Routing ---
    navigate(route, params = null) {
        if(params && params.id) {
            window.location.hash = `${route}/${params.id}`;
        } else {
            window.location.hash = route;
        }
    }

    handleRouting() {
        const hash = window.location.hash.slice(1) || 'home';
        const parts = hash.split('/');
        const view = parts[0];
        const id = parts[1];

        window.scrollTo(0, 0);

        let html = '';
        switch(view) {
            case 'home':
                html = window.ui.renderHomeView();
                break;
            case 'categories':
                html = window.ui.renderCategoriesList();
                break;
            case 'category':
                html = window.ui.renderCategoryView(id);
                break;
            case 'product':
                html = window.ui.renderProductDetailView(id);
                break;
            case 'search':
                html = window.ui.renderSearchView(decodeURIComponent(id));
                break;
            case 'checkout':
                html = window.ui.renderCheckoutView();
                break;
            case 'login':
                html = window.ui.renderLoginView();
                break;
            case 'orders':
                html = window.ui.renderOrdersView();
                break;
            case 'admin':
                if(store.state.user && store.state.user.role === 'admin') {
                    html = window.ui.renderAdminView();
                } else {
                    html = '<div class="container"><h2>Access Denied</h2></div>';
                }
                break;
            default:
                html = window.ui.renderHomeView();
        }

        this.appEl.innerHTML = html;
        this.updateHeaderAuth();
    }

    // --- Searching ---
    handleSearch(e) {
        if(e.key === 'Enter') {
            this.executeSearch();
        }
    }

    executeSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if(query) {
            this.navigate('search', { id: encodeURIComponent(query) });
        }
    }

    // --- Cart Actions ---
    toggleCart() {
        this.cartOverlay.classList.toggle('active');
    }

    addToCartEvent(productId) {
        if(window.store.addToCart(productId)) {
            window.ui.showToast('Added to cart!');
            this.updateCartUI();
        }
    }

    detailAddToCart(productId) {
        const qty = parseInt(document.getElementById('detailQty').value) || 1;
        if(window.store.addToCart(productId, qty)) {
            window.ui.showToast('Added to cart!');
            this.updateCartUI();
            this.toggleCart();
        }
    }

    updateQuantity(productId, change) {
        const item = window.store.state.cart.find(i => i.product.id === productId);
        if(item) {
            window.store.updateCartQuantity(productId, item.quantity + change);
            this.updateCartUI();
        }
    }

    removeFromCart(productId) {
        window.store.removeFromCart(productId);
        this.updateCartUI();
        window.ui.showToast('Item removed', 'error');
    }

    updateCartUI() {
        const cart = window.store.state.cart;
        const total = window.store.getCartTotal();

        this.cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartTotalEl.textContent = `$${total.toFixed(2)}`;

        if(cart.length === 0) {
            this.cartItemsEl.innerHTML = '<p style="text-align:center; margin-top: 2rem; color: var(--clr-text-muted);">Your cart is empty.</p>';
        } else {
            this.cartItemsEl.innerHTML = cart.map(item => window.ui.renderCartItem(item)).join('');
        }
    }

    goToCheckout() {
        this.toggleCart();
        this.navigate('checkout');
    }

    processCheckout() {
        const name = document.getElementById('chkName').value;
        const address = document.getElementById('chkAddress').value;

        if(!name || !address) {
            window.ui.showToast('Please fill all fields', 'error');
            return;
        }

        const orderId = window.store.placeOrder(address);
        if(orderId) {
            window.ui.showToast(`Order placed successfully! ID: ${orderId}`);
            this.updateCartUI();
            this.navigate('orders');
        }
    }

    // --- Auth ---
    updateHeaderAuth() {
        const authSection = document.getElementById('userAuthSection');
        const adminNav = document.getElementById('navAdmin');
        
        if (window.store.state.user) {
            authSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-weight: 500;">Hi, ${window.store.state.user.name}</span>
                    <button class="btn-outline btn-small" onclick="app.logout()">Logout</button>
                    ${window.store.state.user.role !== 'admin' ? `<button class="btn-secondary btn-small" onclick="app.navigate('orders')">Orders</button>` : ''}
                </div>
            `;
            if (window.store.state.user.role === 'admin') {
                adminNav.style.display = 'inline-block';
            } else {
                adminNav.style.display = 'none';
            }
        } else {
            authSection.innerHTML = `<button class="btn-primary btn-small" onclick="app.navigate('login')">Login</button>`;
            adminNav.style.display = 'none';
        }
    }

    processLogin() {
        const u = document.getElementById('loginUsername').value;
        const p = document.getElementById('loginPassword').value;

        if(window.store.login(u, p)) {
            window.ui.showToast(`Welcome back, ${u || 'User'}!`);
            this.navigate('home');
        }
    }

    logout() {
        window.store.logout();
        window.ui.showToast('Logged out successfully');
        this.navigate('home');
    }

    // --- Admin ---
    adminAddProduct() {
        const name = document.getElementById('adminPName').value;
        const cat = document.getElementById('adminPCat').value;
        const price = parseFloat(document.getElementById('adminPPrice').value);
        const emoji = document.getElementById('adminPEmoji').value;

        if(!name || !cat || !price) {
            window.ui.showToast('Please fill required fields', 'error');
            return;
        }

        window.store.addProduct({
            name,
            category: cat,
            price,
            image: emoji || '📦',
            description: 'A new product added by admin.',
            inStock: true,
            featured: false
        });

        window.ui.showToast('Product added successfully!');
        this.navigate('admin'); // re-render
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
