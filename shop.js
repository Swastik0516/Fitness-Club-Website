/**
 * FitClub - Supplement Shop Logic (shop.js)
 * =========================================
 * Manages product rendering, real-time search, category filters,
 * price sorting, and adding items to the global cart.
 */

document.addEventListener('DOMContentLoaded', function () {

    // Product Inventory Database
    const products = [
        {
            id: 'sp-1',
            name: '100% Whey Gold Protein',
            category: 'Whey Protein',
            group: 'protein',
            size: '1 kg (2.2 lbs)',
            price: 2499,
            badge: 'Best Seller',
            image: 'https://purenutrition.in/cdn/shop/files/Whey_Protein_Blend_kulfi_1kg.jpg?v=1786964924&width=1500',
            desc: 'Ultra-filtered whey protein isolate providing 25g protein and 5.5g BCAAs per scoop.'
        },
        {
            id: 'sp-2',
            name: 'Plant Performance Isolate',
            category: 'Plant Protein',
            group: 'protein',
            size: '1 kg (2.2 lbs)',
            price: 2199,
            badge: 'Vegan',
            image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR0ylAOnHKLuLE36u3DzDSFHoHWxAgJl3gRYPmNjrmL3CHnIRL25jvL0hB1LSDDKwbEXzEBh0OHo0eHTKYlZnQTZiaOskCT0EgqP0mEJDLL&usqp=CAc',
            desc: 'Organic pea and brown rice protein blend fortified with digestive enzymes and B12.'
        },
        {
            id: 'sp-3',
            name: 'Micronized Creatine Powder',
            category: 'Creatine Monohydrate',
            group: 'creatine',
            size: '250g (83 Servings)',
            price: 899,
            badge: 'Strength',
            image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSxaaldhYhk2406CgL1c-qpYb9nIjMptehJmwNwjpAVr7EfxDva1EGTIQ9il7OOSEiOp1ULHTQVtrChGne3NaSaLTvEHgCJI4ACgXtuAfRAKVGC_Lw4wDfzJRLoXQwkIYxkC0NN_g&usqp=CAc',
            desc: '100% pure pharmaceutical grade creatine monohydrate to support ATP replenishment.'
        },
        {
            id: 'sp-4',
            name: 'Creapure German Creatine',
            category: 'Creatine Monohydrate',
            group: 'creatine',
            size: '300g (100 Servings)',
            price: 1299,
            badge: 'Premium',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRE6nZj55IPUmB2wxgVcLEvQ1b5rnm1g_xdsxFz69YCA&s=10',
            desc: 'Highest purity Creapure patented creatine powder for zero bloating and fast absorption.'
        },
        {
            id: 'sp-5',
            name: 'Ignite Pre-Workout Boost',
            category: 'Pre-Workout Supplements',
            group: 'preworkout',
            size: '300g (30 Servings)',
            price: 1299,
            badge: 'High Energy',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStF6mlfGjcnNfYNcUF4ZJLpmTrTU5VVuSa2GHCWkCO1A&s=10',
            desc: 'Formulated with 200mg caffeine, Beta-Alanine, and L-Citrulline for extreme focus and pump.'
        },
        {
            id: 'sp-6',
            name: 'Pump Surge Stim-Free',
            category: 'Pre-Workout Supplements',
            group: 'preworkout',
            size: '280g (25 Servings)',
            price: 1499,
            badge: 'Stim-Free',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ15caW1nptlFLttiQmwiFdSZRW_PhAXAEXUE2cACqpag&s',
            desc: 'Nitric oxide booster designed for late-night workouts without caffeine or sleep disruption.'
        },
        {
            id: 'sp-7',
            name: 'Crunch Energy Protein Bars',
            category: 'Protein Bars',
            group: 'accessories',
            size: 'Box of 6 Bars',
            price: 599,
            badge: 'Snack',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgRlaXZe_X50-fIhvB7rtT7QNfXbB_PrbykYzbPWOPkg&s=10',
            desc: 'Crispy high-fiber snack delivering 20g protein and less than 2g sugar per bar.'
        },
        {
            id: 'sp-8',
            name: 'Steel Pro Shaker Bottle',
            category: 'Shakers and Accessories',
            group: 'accessories',
            size: '750ml Capacity',
            price: 499,
            badge: 'Durable',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUYooLNpxe2h7uBLblaKZ8LCoXUmcFK9i4I1wJ0BiW1w&s=10',
            desc: 'Double-walled stainless steel insulated gym shaker with leak-proof lid and mixing ball.'
        },
        {
            id: 'sp-9',
            name: 'Heavy-Duty Lifting Straps',
            category: 'Shakers and Accessories',
            group: 'accessories',
            size: '1 Pair (Universal)',
            price: 349,
            badge: 'Gear',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbo5iBkOVWGfIfz_iPq0R1yGoY_LDtxnZN6C7n0lp1Gw&s=10',
            desc: 'Non-slip cotton webbing straps with neoprene wrist padding for heavy deadlifts and shrugs.'
        },
        {
            id: 'sp-10',
            name: 'Nitro Whey Pro Performance',
            category: 'Whey Protein',
            group: 'protein',
            size: '2 kg (4.4 lbs)',
            price: 4299,
            badge: 'Value Tub',
            image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS3U-ribw3mlG2reNr3KamYud4bv_an2Uuxh3myqlEnyMf0-Jhhc4VC_6rUMBY1A13DI-HHAbhBiQh0iktY2gkmYKbFM9oVzcpjrXQgZFxde4gfcTflBF2sHyUQn5kgS-Qcijvslw&usqp=CAc',
            desc: 'Hydrolyzed and isolate matrix delivering rapid amino acid delivery and rich chocolate taste.'
        }
    ];

    const shopGrid = document.getElementById('shopGrid');
    const searchInput = document.getElementById('shopSearchInput');
    const sortSelect = document.getElementById('shopSortSelect');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentCategory = 'all';
    let searchQuery = '';
    let sortMode = 'default';

    // Format Indian Rupees currency
    function formatRupees(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    // Render Product Cards
    function renderProducts() {
        if (!shopGrid) return;

        // Filter by category
        let filtered = products.filter(function (prod) {
            if (currentCategory === 'all') return true;
            return prod.group === currentCategory;
        });

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(function (prod) {
                return prod.name.toLowerCase().includes(query) ||
                       prod.category.toLowerCase().includes(query) ||
                       prod.desc.toLowerCase().includes(query);
            });
        }

        // Sort items
        if (sortMode === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortMode === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortMode === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Render HTML
        if (filtered.length === 0) {
            shopGrid.innerHTML = `
                <div class="empty-shop-msg">
                    <h3>No products found</h3>
                    <p>We couldn't find any supplement matching "${searchQuery}".</p>
                    <button type="button" class="btn btn-secondary btn-sm" id="clearFilterBtn">Clear Filters</button>
                </div>
            `;
            const clearBtn = document.getElementById('clearFilterBtn');
            if (clearBtn) {
                clearBtn.addEventListener('click', function () {
                    searchQuery = '';
                    currentCategory = 'all';
                    if (searchInput) searchInput.value = '';
                    filterButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all'));
                    renderProducts();
                });
            }
            return;
        }

        shopGrid.innerHTML = filtered.map(function (p) {
            return `
                <div class="shop-card" data-id="${p.id}">
                    <div class="shop-card-img-wrap">
                        ${p.badge ? `<span class="shop-card-badge">${p.badge}</span>` : ''}
                        <img src="${p.image}" alt="${p.name}">
                    </div>
                    <div class="shop-card-body">
                        <span class="shop-card-category">${p.category}</span>
                        <h3 class="shop-card-title">${p.name}</h3>
                        <span class="shop-card-size">${p.size}</span>
                        <p class="shop-card-desc">${p.desc}</p>
                        <div class="shop-card-footer">
                            <span class="shop-card-price">${formatRupees(p.price)}</span>
                            <button type="button" class="btn btn-sm add-to-cart-btn" data-id="${p.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach Add to Cart Listeners
        const addButtons = shopGrid.querySelectorAll('.add-to-cart-btn');
        addButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const prodId = this.getAttribute('data-id');
                const targetProduct = products.find(p => p.id === prodId);
                if (targetProduct && window.fitclubCart) {
                    window.fitclubCart.addItem(targetProduct);
                }
            });
        });
    }

    // Filter Buttons Click Handler
    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-filter') || 'all';
            renderProducts();
        });
    });

    // Real-Time Search Handler
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            searchQuery = this.value;
            renderProducts();
        });
    }

    // Sort Dropdown Handler
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortMode = this.value;
            renderProducts();
        });
    }

    // Initial Render
    renderProducts();

});
