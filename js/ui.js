// js/ui.js

const ui = {
    renderProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image" style="background: ${this.getCategoryColor(product.category)}">
                    ${product.image}
                </div>
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <div class="product-name" style="cursor: pointer" onclick="app.navigate('product', {id: '${product.id}'})">${product.name}</div>
                    <div class="product-footer">
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="btn-primary btn-small" onclick="app.addToCartEvent('${product.id}')">+ Add</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderCategoryCard(category) {
        return `
            <div class="category-card" style="background: ${category.color}" onclick="app.navigate('category', {id: '${category.id}'})">
                <div class="category-icon">${category.icon}</div>
                <div class="category-name"><strong>${category.name}</strong></div>
            </div>
        `;
    },

    getCategoryName(categoryId) {
        const cat = window.INITIAL_DATA.categories.find(c => c.id === categoryId);
        return cat ? cat.name : categoryId;
    },

    getCategoryColor(categoryId) {
        const cat = window.INITIAL_DATA.categories.find(c => c.id === categoryId);
        return cat ? cat.color : '#f1f1f1';
    },

    renderCartItem(cartItem) {
        return `
            <div class="cart-item" data-id="${cartItem.product.id}">
                <div class="cart-item-img" style="background: ${this.getCategoryColor(cartItem.product.category)}">
                    ${cartItem.product.image}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${cartItem.product.name}</div>
                    <div class="cart-item-price">$${cartItem.product.price.toFixed(2)}</div>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" onclick="app.updateQuantity('${cartItem.product.id}', -1)">-</button>
                        <span>${cartItem.quantity}</span>
                        <button class="qty-btn" onclick="app.updateQuantity('${cartItem.product.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="app.removeFromCart('${cartItem.product.id}')">✕</button>
            </div>
        `;
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.background = type === 'error' ? 'var(--clr-danger)' : 'var(--clr-text)';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    renderHomeView() {
        const featuredProducts = window.store.state.products.filter(p => p.featured);
        
        return `
            <div class="container">
                <div class="hero">
                    <div class="hero-content">
                        <h1>Fresh Groceries Delivered Fast</h1>
                        <p>Experience the easiest way to shop for your daily essentials, fresh fruits, and vegetables.</p>
                        <button class="btn-secondary" onclick="app.navigate('categories')">Shop Now</button>
                    </div>
                    <div class="hero-graphics">🛒</div>
                </div>

                <div class="section-title">
                    <h2>Shop by Category</h2>
                </div>
                <div class="categories-grid">
                    ${window.INITIAL_DATA.categories.map(c => this.renderCategoryCard(c)).join('')}
                </div>

                <div class="section-title">
                    <h2>Featured Products</h2>
                </div>
                <div class="products-grid">
                    ${featuredProducts.map(p => this.renderProductCard(p)).join('')}
                </div>
            </div>
        `;
    },

    renderCategoryView(categoryId) {
        const products = window.store.state.products.filter(p => p.category === categoryId);
        const catName = this.getCategoryName(categoryId);

        if(products.length === 0) {
            return `<div class="container"><h2>${catName}</h2><p>No products found in this category.</p></div>`;
        }

        return `
            <div class="container">
                <div class="section-title">
                    <h2>${catName}</h2>
                </div>
                <div class="products-grid">
                    ${products.map(p => this.renderProductCard(p)).join('')}
                </div>
            </div>
        `;
    },

    renderCategoriesList() {
        return `
            <div class="container">
                <div class="section-title">
                    <h2>All Categories</h2>
                </div>
                <div class="categories-grid">
                    ${window.INITIAL_DATA.categories.map(c => this.renderCategoryCard(c)).join('')}
                </div>
            </div>
        `;
    },

    renderProductDetailView(productId) {
        const product = window.store.state.products.find(p => p.id === productId);
        if (!product) return 'Product not found';

        return `
            <div class="container">
                <div class="product-detail-layout">
                    <div class="product-detail-image" style="background: ${this.getCategoryColor(product.category)}">
                        ${product.image}
                    </div>
                    <div class="product-detail-info">
                        <div class="product-category">${this.getCategoryName(product.category)}</div>
                        <h1>${product.name}</h1>
                        <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                        <p style="margin-bottom: 2rem; color: var(--clr-text-muted); font-size: 1.1rem;">${product.description}</p>
                        
                        <div class="qty-selector">
                            <label>Quantity: </label>
                            <input type="number" id="detailQty" value="1" min="1">
                        </div>
                        
                        <button class="btn-primary" style="font-size: 1.25rem; padding: 1rem 3rem;" onclick="app.detailAddToCart('${product.id}')">🛒 Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderSearchView(query) {
        const term = query.toLowerCase();
        const results = window.store.state.products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term) ||
            (p.description && p.description.toLowerCase().includes(term))
        );

        return `
            <div class="container">
                <div class="section-title">
                    <h2>Search Results for "${query}"</h2>
                </div>
                ${results.length === 0 ? '<p>No products found.</p>' : `
                    <div class="products-grid">
                        ${results.map(p => this.renderProductCard(p)).join('')}
                    </div>
                `}
            </div>
        `;
    },

    renderCheckoutView() {
        const total = window.store.getCartTotal();
        
        if(window.store.state.cart.length === 0) {
            return `
                <div class="container" style="text-align: center; padding: 4rem;">
                    <h2>Your cart is empty</h2>
                    <br>
                    <button class="btn-primary" onclick="app.navigate('home')">Return to Shop</button>
                </div>
            `;
        }

        return `
            <div class="container">
                <h2 style="text-align: center; margin-bottom: 1rem;">Complete Your Order</h2>
                <div class="form-card">
                    <h3 style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem;">Order Summary: $${total.toFixed(2)}</h3>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="chkName" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label>Delivery Address</label>
                        <textarea id="chkAddress" rows="3" placeholder="123 Fresh Lane, City" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Payment Method</label>
                        <select id="chkPayment">
                            <option value="card">Credit/Debit Card</option>
                            <option value="cod">Cash on Delivery</option>
                        </select>
                    </div>
                    <button class="btn-primary btn-full" onclick="app.processCheckout()">Confirm Order & Pay</button>
                </div>
            </div>
        `;
    },

    renderLoginView() {
        return `
            <div class="container">
                <div class="form-card">
                    <h2 style="margin-bottom: 1.5rem; text-align: center;">Welcome Back</h2>
                    <p style="text-align:center; color: var(--clr-text-muted); margin-bottom: 2rem;">Demo users: admin/admin, or anything else for normal user</p>
                    <div class="form-group">
                        <label>Username or Email</label>
                        <input type="text" id="loginUsername" placeholder="Enter username">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" placeholder="Enter password">
                    </div>
                    <button class="btn-primary btn-full" onclick="app.processLogin()">Login</button>
                    <p style="margin-top: 1rem; text-align: center;">
                        <a href="javascript:void(0)" style="color: var(--clr-primary);">Forgot password?</a>
                    </p>
                </div>
            </div>
        `;
    },

    renderOrdersView() {
        // filter orders for user if not admin
        let orders = window.store.state.orders;
        const user = window.store.state.user;
        
        if (!user) {
            return `<div class="container"><h2>Please log in to view orders</h2></div>`;
        }
        
        if (user.role !== 'admin') {
            orders = orders.filter(o => o.user === user.name);
        }

        return `
            <div class="container">
                <div class="section-title">
                    <h2>${user.role === 'admin' ? 'All System Orders' : 'My Orders'}</h2>
                </div>
                ${orders.length === 0 ? '<p>No orders found.</p>' : `
                    <div class="admin-table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(o => `
                                    <tr>
                                        <td><strong>${o.id}</strong></td>
                                        <td>${o.date}</td>
                                        <td>${o.user}</td>
                                        <td>$${o.total.toFixed(2)}</td>
                                        <td><span style="color: var(--clr-primary-dark); font-weight:600;">${o.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    },

    renderAdminView() {
        return `
            <div class="container">
                <div class="section-title">
                    <h2>Admin Dashboard</h2>
                </div>
                
                <div style="display: flex; gap: 2rem;">
                    <div class="form-card" style="flex: 1; margin: 0;">
                        <h3>Add New Product (Mock)</h3>
                        <br>
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" id="adminPName" placeholder="e.g. Green Grapes">
                        </div>
                        <div class="form-group">
                            <label>Category (fruits / vegetables / dairy / pantry)</label>
                            <input type="text" id="adminPCat" placeholder="fruits">
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" id="adminPPrice" step="0.01" placeholder="4.99">
                        </div>
                        <div class="form-group">
                            <label>Emoji (Image)</label>
                            <input type="text" id="adminPEmoji" placeholder="🍇">
                        </div>
                        <button class="btn-primary btn-full" onclick="app.adminAddProduct()">Add Product</button>
                    </div>
                    
                    <div style="flex: 2;">
                        ${this.renderOrdersView()}
                    </div>
                </div>
            </div>
        `;
    }
};

window.ui = ui;
