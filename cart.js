/**
 * FitClub - Shopping Cart Page Logic (cart.js)
 * ============================================
 * Renders stored items from localStorage, updates quantities,
 * removes items, computes subtotal and grand total, and handles
 * the demo checkout modal.
 */

document.addEventListener('DOMContentLoaded', function () {

    const emptyCartContainer = document.getElementById('emptyCartContainer');
    const cartLayoutContainer = document.getElementById('cartLayoutContainer');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSubtotalElem = document.getElementById('cartSubtotal');
    const cartTotalElem = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutFormView = document.getElementById('checkoutFormView');
    const checkoutSuccessView = document.getElementById('checkoutSuccessView');
    const modalOrderTotal = document.getElementById('modalOrderTotal');

    // Format Indian Rupees
    function formatRupees(amount) {
        return '₹' + Number(amount).toLocaleString('en-IN');
    }

    // Render the Cart UI
    function renderCart() {
        const items = window.fitclubCart ? window.fitclubCart.getItems() : [];

        if (items.length === 0) {
            if (emptyCartContainer) emptyCartContainer.style.display = 'block';
            if (cartLayoutContainer) cartLayoutContainer.style.display = 'none';
            if (window.fitclubCart) window.fitclubCart.updateNavBadge();
            return;
        }

        if (emptyCartContainer) emptyCartContainer.style.display = 'none';
        if (cartLayoutContainer) cartLayoutContainer.style.display = 'grid';

        let subtotal = 0;

        if (cartItemsList) {
            cartItemsList.innerHTML = items.map(function (item, index) {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                subtotal += itemTotal;

                return `
                    <div class="cart-item" data-index="${index}" data-id="${item.id}">
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>

                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <span>${item.size || item.category || ''}</span>
                        </div>

                        <div class="cart-item-price">
                            ${formatRupees(item.price)}
                        </div>

                        <div class="qty-control">
                            <button type="button" class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                            <span class="qty-number">${item.quantity || 1}</span>
                            <button type="button" class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>

                        <div class="cart-item-subtotal">
                            ${formatRupees(itemTotal)}
                        </div>

                        <button type="button" class="cart-item-remove" data-id="${item.id}" title="Remove item" aria-label="Remove item">
                            &#10005;
                        </button>
                    </div>
                `;
            }).join('');
        }

        // Update Summary Totals
        if (cartSubtotalElem) cartSubtotalElem.textContent = formatRupees(subtotal);
        if (cartTotalElem) cartTotalElem.textContent = formatRupees(subtotal);
        if (modalOrderTotal) modalOrderTotal.textContent = formatRupees(subtotal);

        // Update nav counter
        if (window.fitclubCart) window.fitclubCart.updateNavBadge();

        // Attach Listeners to Quantity Buttons and Remove Buttons
        attachCartListeners();
    }

    // Attach Event Listeners to Cart Item Elements
    function attachCartListeners() {
        if (!cartItemsList) return;

        // Increase Quantity (+)
        cartItemsList.querySelectorAll('.qty-plus').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const items = window.fitclubCart.getItems();
                const target = items.find(i => i.id === id);
                if (target) {
                    target.quantity = (target.quantity || 1) + 1;
                    window.fitclubCart.saveItems(items);
                    renderCart();
                }
            });
        });

        // Decrease Quantity (-)
        cartItemsList.querySelectorAll('.qty-minus').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const items = window.fitclubCart.getItems();
                const target = items.find(i => i.id === id);
                if (target) {
                    if ((target.quantity || 1) > 1) {
                        target.quantity -= 1;
                        window.fitclubCart.saveItems(items);
                        renderCart();
                    } else {
                        // Remove item if decreasing below 1
                        const filtered = items.filter(i => i.id !== id);
                        window.fitclubCart.saveItems(filtered);
                        renderCart();
                        window.fitclubShowToast(`Removed item from cart`);
                    }
                }
            });
        });

        // Remove Item (✕)
        cartItemsList.querySelectorAll('.cart-item-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const items = window.fitclubCart.getItems();
                const removedItem = items.find(i => i.id === id);
                const filtered = items.filter(i => i.id !== id);
                window.fitclubCart.saveItems(filtered);
                renderCart();
                if (removedItem) {
                    window.fitclubShowToast(`Removed "${removedItem.name}" from cart`);
                }
            });
        });
    }

    // Clear Cart Button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to clear all items from your cart?')) {
                window.fitclubCart.saveItems([]);
                renderCart();
                window.fitclubShowToast('Cart cleared');
            }
        });
    }

    // Open Checkout Modal
    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', function () {
            const items = window.fitclubCart.getItems();
            if (items.length === 0) {
                alert('Your cart is empty. Add products before checking out.');
                return;
            }

            // Reset modal view
            if (checkoutFormView) checkoutFormView.style.display = 'block';
            if (checkoutSuccessView) checkoutSuccessView.style.display = 'none';
            if (checkoutForm) checkoutForm.reset();

            // Clear errors
            const errElem = document.getElementById('checkoutErrorMsg');
            if (errElem) errElem.textContent = '';

            checkoutModal.classList.add('active');
            checkoutModal.setAttribute('aria-hidden', 'false');
        });
    }

    // Close Checkout Modal
    function closeCheckout() {
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            checkoutModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);

    if (checkoutModal) {
        checkoutModal.addEventListener('click', function (e) {
            if (e.target === checkoutModal) closeCheckout();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && checkoutModal.classList.contains('active')) {
                closeCheckout();
            }
        });
    }

    // Demo Checkout Form Submission Handler
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('custName');
            const emailInput = document.getElementById('custEmail');
            const addressInput = document.getElementById('custAddress');
            const errorElem = document.getElementById('checkoutErrorMsg');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const address = addressInput ? addressInput.value.trim() : '';

            // Validation
            if (!name || name.length < 2) {
                if (errorElem) errorElem.textContent = 'Please enter your full name.';
                if (nameInput) nameInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                if (errorElem) errorElem.textContent = 'Please enter a valid email address.';
                if (emailInput) emailInput.focus();
                return;
            }

            if (!address || address.length < 5) {
                if (errorElem) errorElem.textContent = 'Please enter your shipping/delivery address.';
                if (addressInput) addressInput.focus();
                return;
            }

            // Order Success Receipt Generation
            const orderId = 'FC-' + Math.floor(100000 + Math.random() * 900000);
            const items = window.fitclubCart.getItems();
            let total = 0;
            const itemsSummary = items.map(function (item) {
                const itemTotal = item.price * (item.quantity || 1);
                total += itemTotal;
                return `<li>${item.name} × ${item.quantity || 1} — ${formatRupees(itemTotal)}</li>`;
            }).join('');

            // Fill receipt details
            const receiptDetails = document.getElementById('receiptDetails');
            if (receiptDetails) {
                receiptDetails.innerHTML = `
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Customer:</strong> ${document.createTextNode(name).wholeText}</p>
                    <p><strong>Email:</strong> ${document.createTextNode(email).wholeText}</p>
                    <p><strong>Delivery Address:</strong> ${document.createTextNode(address).wholeText}</p>
                    <p style="margin-top: 12px; margin-bottom: 6px;"><strong>Items Ordered:</strong></p>
                    <ul style="padding-left: 20px; color: var(--text-secondary); margin-bottom: 12px;">
                        ${itemsSummary}
                    </ul>
                    <p style="font-size: 16px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                        <strong>Total Amount:</strong> <span style="color: var(--accent-red); font-weight: 800;">${formatRupees(total)}</span>
                    </p>
                `;
            }

            // Clear Cart from localStorage
            window.fitclubCart.saveItems([]);

            // Switch view in modal
            if (checkoutFormView) checkoutFormView.style.display = 'none';
            if (checkoutSuccessView) checkoutSuccessView.style.display = 'block';

            // Refresh underlying cart page state
            renderCart();
        });
    }

    // Initial render
    renderCart();

});
