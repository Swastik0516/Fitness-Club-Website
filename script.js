/**
 * FitClub - Global JavaScript (script.js)
 * =======================================
 * Handles global navbar interactions, mobile menu, Back to Top,
 * toast notifications, and cart count synchronization across pages.
 */

// Global FitClub Cart Helper Functions
window.fitclubCart = {
    // Get all items from localStorage
    getItems: function () {
        try {
            const raw = localStorage.getItem('fitclub_cart');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    },

    // Save items to localStorage and trigger count update
    saveItems: function (items) {
        try {
            localStorage.setItem('fitclub_cart', JSON.stringify(items));
            window.fitclubCart.updateNavBadge();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    },

    // Add a product to the cart
    addItem: function (product) {
        const items = window.fitclubCart.getItems();
        const existingIndex = items.findIndex(function (item) {
            return item.id === product.id;
        });

        if (existingIndex > -1) {
            items[existingIndex].quantity = (items[existingIndex].quantity || 1) + (product.quantity || 1);
        } else {
            items.push({
                id: product.id,
                name: product.name,
                category: product.category || 'Supplements',
                price: Number(product.price),
                image: product.image,
                size: product.size || '',
                quantity: product.quantity || 1
            });
        }

        window.fitclubCart.saveItems(items);
        window.fitclubShowToast(`Added "${product.name}" to cart!`);
    },

    // Calculate total quantity of items in cart
    getTotalCount: function () {
        const items = window.fitclubCart.getItems();
        return items.reduce(function (total, item) {
            return total + (item.quantity || 1);
        }, 0);
    },

    // Update the cart badge number in the navbar
    updateNavBadge: function () {
        const badge = document.getElementById('navCartCount');
        if (badge) {
            const count = window.fitclubCart.getTotalCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// Global Toast Notification Helper
window.fitclubShowToast = function (message) {
    let toast = document.getElementById('fitclubToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'fitclubToast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">&#10003;</span> ${message}`;
    toast.classList.add('show');

    if (window._toastTimeout) {
        clearTimeout(window._toastTimeout);
    }

    window._toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 3000);
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', function () {

    // 1. Initialize Cart Badge in Navigation
    window.fitclubCart.updateNavBadge();

    // 2. Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('active');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close when clicking any nav link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close on clicking outside navbar
        document.addEventListener('click', function (e) {
            const inside = navToggle.contains(e.target) || navLinks.contains(e.target);
            if (!inside && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
