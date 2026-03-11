// js/store.js

class Store {
    constructor() {
        this.state = {
            products: [],
            categories: [],
            cart: [],
            user: null, // { name: '', role: 'user' | 'admin' }
            orders: []
        };
        this.init();
    }

    init() {
        // Load or initialize data
        const storedProducts = localStorage.getItem('freshcart_products');
        if (storedProducts) {
            this.state.products = JSON.parse(storedProducts);
        } else {
            this.state.products = window.INITIAL_DATA.products;
            this.saveProducts();
        }

        this.state.categories = window.INITIAL_DATA.categories;

        const storedCart = localStorage.getItem('freshcart_cart');
        if (storedCart) {
            this.state.cart = JSON.parse(storedCart);
        }

        const storedUser = localStorage.getItem('freshcart_user');
        if (storedUser) {
            this.state.user = JSON.parse(storedUser);
        }

        const storedOrders = localStorage.getItem('freshcart_orders');
        if (storedOrders) {
            this.state.orders = JSON.parse(storedOrders);
        }
    }

    saveProducts() { localStorage.setItem('freshcart_products', JSON.stringify(this.state.products)); }
    saveCart() { localStorage.setItem('freshcart_cart', JSON.stringify(this.state.cart)); }
    saveUser() { localStorage.setItem('freshcart_user', JSON.stringify(this.state.user)); }
    saveOrders() { localStorage.setItem('freshcart_orders', JSON.stringify(this.state.orders)); }

    // --- Cart Methods ---
    addToCart(productId, quantity = 1) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return false;

        const existingItem = this.state.cart.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.state.cart.push({ product, quantity });
        }
        
        this.saveCart();
        return true;
    }

    updateCartQuantity(productId, newQty) {
        if (newQty <= 0) {
            this.removeFromCart(productId);
            return;
        }
        const item = this.state.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity = newQty;
            this.saveCart();
        }
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
        this.saveCart();
    }

    clearCart() {
        this.state.cart = [];
        this.saveCart();
    }

    getCartTotal() {
        return this.state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    // --- Auth & Orders ---
    login(username, password) {
        // Mock authentication
        if (username === 'admin' && password === 'admin') {
            this.state.user = { name: 'Admin', role: 'admin' };
        } else {
            this.state.user = { name: username || 'User', role: 'user' };
        }
        this.saveUser();
        return true;
    }

    logout() {
        this.state.user = null;
        this.saveUser();
    }

    placeOrder(addressData) {
        if (this.state.cart.length === 0) return false;

        const order = {
            id: 'ORD-' + Math.floor(Math.random() * 1000000),
            date: new Date().toLocaleDateString(),
            items: [...this.state.cart],
            total: this.getCartTotal(),
            status: 'Processing',
            address: addressData,
            user: this.state.user ? this.state.user.name : 'Guest'
        };

        this.state.orders.push(order);
        this.saveOrders();
        this.clearCart();
        return order.id;
    }

    // --- Admin ---
    addProduct(productData) {
        const newProduct = {
            id: 'p' + Date.now(),
            ...productData
        };
        this.state.products.push(newProduct);
        this.saveProducts();
    }
}

window.store = new Store();
