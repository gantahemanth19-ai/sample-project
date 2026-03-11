// js/data.js

const INITIAL_CATEGORIES = [
    { id: 'fruits', name: 'Fresh Fruits', icon: '🍎', color: 'hsl(350, 80%, 95%)' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', color: 'hsl(130, 60%, 95%)' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🥚', color: 'hsl(45, 100%, 95%)' },
    { id: 'pantry', name: 'Pantry Staples', icon: '🍚', color: 'hsl(30, 50%, 95%)' },
];

const INITIAL_PRODUCTS = [
    // Fruits
    { id: 'p1', name: 'Organic Red Apples', category: 'fruits', price: 4.99, image: '🍎', description: 'Crisp and sweet organic red apples. Perfect for a healthy snack or baking.', inStock: true, featured: true },
    { id: 'p2', name: 'Fresh Bananas', category: 'fruits', price: 1.99, image: '🍌', description: 'Bunch of fresh, yellow bananas rich in potassium.', inStock: true, featured: true },
    { id: 'p3', name: 'Navel Oranges', category: 'fruits', price: 3.49, image: '🍊', description: 'Juicy, seedless navel oranges full of Vitamin C.', inStock: true, featured: false },
    { id: 'p4', name: 'Alphonso Mangoes', category: 'fruits', price: 6.99, image: '🥭', description: 'Sweet and tropical premium Alphonso mangoes.', inStock: true, featured: false },
    
    // Vegetables
    { id: 'p5', name: 'Vine Tomatoes', category: 'vegetables', price: 2.99, image: '🍅', description: 'Freshly picked vine-ripened red tomatoes.', inStock: true, featured: true },
    { id: 'p6', name: 'Russet Potatoes', category: 'vegetables', price: 3.99, image: '🥔', description: 'A 5lb bag of versatile russet potatoes for baking or mashing.', inStock: true, featured: false },
    { id: 'p7', name: 'Red Onions', category: 'vegetables', price: 1.49, image: '🧅', description: 'Crisp red onions perfect for salads and cooking.', inStock: true, featured: false },
    { id: 'p8', name: 'Organic Carrots', category: 'vegetables', price: 2.49, image: '🥕', description: 'Crunchy and sweet organic carrots.', inStock: true, featured: false },
    
    // Dairy (Daily Essentials)
    { id: 'p9', name: 'Whole Milk (1 Gallon)', category: 'dairy', price: 3.79, image: '🥛', description: 'Fresh, pasteurized whole milk.', inStock: true, featured: true },
    { id: 'p10', name: 'Free-Range Eggs (Dozen)', category: 'dairy', price: 4.49, image: '🥚', description: 'Farm-fresh free-range large brown eggs.', inStock: true, featured: true },
    
    // Pantry (Daily Essentials)
    { id: 'p11', name: 'Whole Wheat Bread', category: 'pantry', price: 2.99, image: '🍞', description: 'Freshly baked sliced whole wheat bread.', inStock: true, featured: true },
    { id: 'p12', name: 'Basmati Rice (5 lbs)', category: 'pantry', price: 8.99, image: '🍚', description: 'Premium long-grain fragrant basmati rice.', inStock: true, featured: false },
    { id: 'p13', name: 'Vegetable Cooking Oil', category: 'pantry', price: 5.49, image: '🍾', description: '1 liter of all-purpose vegetable cooking oil.', inStock: true, featured: false },
    { id: 'p14', name: 'White Sugar', category: 'pantry', price: 2.29, image: '🧂', description: 'Granulated pure white cane sugar, 2 lbs.', inStock: true, featured: false },
    { id: 'p15', name: 'Sea Salt', category: 'pantry', price: 1.99, image: '🧂', description: 'Fine sea salt for everyday cooking.', inStock: true, featured: false }
];

window.INITIAL_DATA = {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS
};
