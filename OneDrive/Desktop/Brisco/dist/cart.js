// BRISC Streetwear - Simple Demo Cart System
class BriscoCart {
  constructor() {
    this.items = [];
    this.init();
  }

  init() {
    console.log('Initializing simple cart system');
    this.bindEvents();
    this.updateCartUI();
  }

  addItem(product) {
    console.log('Adding item to cart:', product);
    
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      console.log('Updated existing item:', existingItem);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        frontImg: product.frontImg,
        quantity: 1
      };
      this.items.push(newItem);
      console.log('Added new item:', newItem);
    }

    this.updateCartUI();
    this.showToast("Thank you, sincerely, Family.");
  }

  removeItem(productId) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const removedItem = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      this.updateCartUI();
      this.showToast(`${removedItem.name} removed from cart`);
    }
  }

  updateQuantity(productId, newQuantity) {
    const item = this.items.find(item => item.id === productId);
    
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
        this.updateCartUI();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartUI() {
    this.updateCartIcon();
    this.updateCartDrawer();
  }

  updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    
    if (cartIcon && cartCount) {
      const itemCount = this.getItemCount();
      cartCount.textContent = itemCount;
      
      if (itemCount > 0) {
        cartCount.classList.add('show');
        cartIcon.classList.add('has-items');
      } else {
        cartCount.classList.remove('show');
        cartIcon.classList.remove('has-items');
      }
    }
  }

  updateCartDrawer() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    console.log('Updating cart drawer. Items count:', this.items.length);
    
    if (!cartItems || !cartTotal) {
      console.error('Cart elements not found!');
      return;
    }
    
    // Update total
    cartTotal.textContent = this.getTotal().toFixed(2);
    
    // Clear current items
    cartItems.innerHTML = '';
    
    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🔥</div>
          <p>Your cart is waiting. Take the next step — carry BRISCO with you.</p>
        </div>
      `;
      return;
    }
    
    // Populate cart items
    this.items.forEach(item => {
      console.log('Creating cart item for:', item.name);
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.frontImg}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="window.briscoCart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="window.briscoCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  bindEvents() {
    // Cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        console.log('Cart icon clicked');
        this.toggleCartDrawer();
      });
    }

    // Cart close button
    const cartClose = document.querySelector('.cart-close');
    if (cartClose) {
      cartClose.addEventListener('click', () => {
        this.closeCartDrawer();
      });
    }

    // Cart overlay click
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => {
        this.closeCartDrawer();
      });
    }

    // Note: Add to cart is handled via direct onclick calls

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCartDrawer();
      }
    });
  }

  toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer && overlay) {
      const isOpen = drawer.classList.contains('open');
      
      if (isOpen) {
        this.closeCartDrawer();
      } else {
        this.openCartDrawer();
      }
    }
  }

  openCartDrawer() {
    console.log('Opening cart drawer');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
      
      // Update drawer content
      this.updateCartDrawer();
    }
  }

  closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  showToast(message) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Test function for debugging
  testAddItem() {
    const testProduct = {
      id: 999,
      name: 'Test Product',
      price: 65,
      frontImg: '/images/fatlil.2_1755650727_3702989146314406154_305151088.jpg'
    };
    console.log('Testing cart with product:', testProduct);
    this.addItem(testProduct);
    this.openCartDrawer();
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing simple cart...');
  window.briscoCart = new BriscoCart();
  console.log('Cart ready!');
});