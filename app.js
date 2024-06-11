document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'https://fakestoreapi.com';
    const categoryList = document.getElementById('category-list');
    const productList = document.getElementById('product-list');
    const productDetailsModal = document.getElementById('product-details-modal');
    const productDetails = document.getElementById('product-details');
    const closeButton = document.querySelector('.close-button');
    const cartSection = document.getElementById('cart-section');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const toggleCartButton = document.getElementById('toggle-cart');
    const cartIcon = document.getElementById('cart-icon');

    let cartData = [];

    // Categorias por API
    async function fetchCategories() {
        const response = await fetch(`${apiUrl}/products/categories`);
        const categories = await response.json();
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => fetchProductsByCategory(category));
            categoryList.appendChild(li);
        });
    }

    // Productos de categoria por API
    async function fetchProductsByCategory(category) {
        const response = await fetch(`${apiUrl}/products/category/${category}`);
        const products = await response.json();
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
            `;
            productDiv.addEventListener('click', () => fetchProductDetails(product.id));
            productList.appendChild(productDiv);
        });
    }

    // Detalles del producto por API
    async function fetchProductDetails(productId) {
        const response = await fetch(`${apiUrl}/products/${productId}`);
        const product = await response.json();
        productDetails.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>$${product.price}</p>
            <p>${product.description}</p>
            <button id="add-to-cart">Agregar al Carrito</button>
        `;
        productDetailsModal.classList.remove('hidden');
        productDetailsModal.style.display = 'block';
        document.getElementById('add-to-cart').addEventListener('click', () => addToCart(product));
    }

    // Cerrar detalles
    closeButton.addEventListener('click', () => {
        productDetailsModal.classList.add('hidden');
        productDetailsModal.style.display = 'none';
    });

    // Agregar al carrito
    function addToCart(product) {
        cartData.push(product);
        updateCart();
        alert(`${product.title} ha sido agregado al carrito.`);
    }

    // Actualizar carrito
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cartData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                ${item.title} - $${item.price}
                <button class="remove-from-cart">Eliminar</button>
            `;
            li.querySelector('.remove-from-cart').addEventListener('click', () => removeFromCart(item));
            cartItems.appendChild(li);
            total += item.price;
        });
        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartSection.classList.remove('hidden');
        cartIcon.classList.add('hidden');
    }

    // Sacar producto del carrito
    function removeFromCart(item) {
        cartData = cartData.filter(cartItem => cartItem.id !== item.id);
        updateCart();
    }

    // Ver o cerrar carrito
    toggleCartButton.addEventListener('click', () => {
        cartSection.classList.toggle('hidden');
        if (cartSection.classList.contains('hidden')) {
            cartIcon.classList.remove('hidden');
            toggleCartButton.textContent = 'Ver Carrito';
        } else {
            cartIcon.classList.add('hidden');
            toggleCartButton.textContent = 'Cerrar Carrito';
        }
    });

    // Mostrar carrito por icono
    cartIcon.addEventListener('click', () => {
        cartSection.classList.remove('hidden');
        cartIcon.classList.add('hidden');
        toggleCartButton.textContent = 'Cerrar Carrito';
    });

    fetchCategories();
});
