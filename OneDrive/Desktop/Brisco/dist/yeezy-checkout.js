// BRISC Yeezy-Inspired Checkout System
class YeezyCheckout {
  constructor() {
    this.currentStep = 'product';
    this.selectedProduct = null;
    this.selectedSize = null;
    this.quantity = 1;
    this.customerInfo = {};
    this.stripe = null;
    this.cardElement = null;
    this.isProcessing = false;
    
    this.init();
  }

  init() {
    console.log('Initializing Yeezy-inspired checkout...');
    this.bindEvents();
    this.initializeStripe();
  }

  // Initialize Stripe (you'll need to add your publishable key)
  async initializeStripe() {
    try {
      // Load Stripe dynamically
      if (typeof Stripe === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      // Replace with your actual Stripe publishable key
      // For demo purposes, we'll use a placeholder
      const stripeKey = 'pk_test_your_stripe_publishable_key_here';
      
      if (stripeKey.includes('your_stripe_publishable_key_here')) {
        console.warn('Stripe key not configured - using demo mode');
        return;
      }
      
      this.stripe = Stripe(stripeKey);
      
      const elements = this.stripe.elements({
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#ffffff',
            colorBackground: 'rgba(255, 255, 255, 0.05)',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            spacingUnit: '4px',
            borderRadius: '0px',
          }
        }
      });

      this.cardElement = elements.create('card');
      
      // Mount card element when payment step is reached
      this.cardElement.on('change', (event) => {
        const displayError = document.getElementById('stripe-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
      
    } catch (error) {
      console.warn('Stripe not loaded - using demo mode');
    }
  }

  bindEvents() {
    // Modal controls
    document.addEventListener('click', (e) => {
      if (e.target.id === 'checkout-close' || e.target.id === 'checkout-overlay') {
        this.closeCheckout();
      }
    });

    // Step navigation
    this.bindStepNavigation();
    
    // Product selection
    this.bindProductSelection();
    
    // Form handling
    this.bindFormHandling();
    
    // Payment processing
    this.bindPaymentProcessing();
  }

  bindStepNavigation() {
    // Continue buttons
    document.getElementById('continue-to-info')?.addEventListener('click', () => {
      if (this.validateProductStep()) {
        this.goToStep('info');
      }
    });

    document.getElementById('continue-to-payment')?.addEventListener('click', () => {
      if (this.validateInfoStep()) {
        this.goToStep('payment');
      }
    });

    // Back buttons
    document.getElementById('back-to-product')?.addEventListener('click', () => {
      this.goToStep('product');
    });

    document.getElementById('back-to-info')?.addEventListener('click', () => {
      this.goToStep('info');
    });

    // Continue shopping
    document.getElementById('continue-shopping')?.addEventListener('click', () => {
      this.closeCheckout();
    });
  }

  bindProductSelection() {
    // Size selection
    document.querySelectorAll('.size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedSize = btn.dataset.size;
        this.updatePricing();
      });
    });

    // Quantity controls
    document.getElementById('quantity-minus')?.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        this.updateQuantityDisplay();
        this.updatePricing();
      }
    });

    document.getElementById('quantity-plus')?.addEventListener('click', () => {
      if (this.quantity < 10) {
        this.quantity++;
        this.updateQuantityDisplay();
        this.updatePricing();
      }
    });
  }

  bindFormHandling() {
    // Auto-format phone number
    document.getElementById('phone')?.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
      }
      e.target.value = value;
    });

    // Auto-format ZIP code
    document.getElementById('zip')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
  }

  bindPaymentProcessing() {
    // Payment method selection
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateInstallmentAmount();
      });
    });

    // Complete order
    document.getElementById('complete-order')?.addEventListener('click', () => {
      this.processOrder();
    });
  }

  // Open checkout with product data
  openCheckout(product) {
    console.log('Opening Yeezy checkout for:', product);
    
    this.selectedProduct = product;
    this.quantity = 1;
    this.selectedSize = null;
    
    // Show modal
    const modal = document.getElementById('yeezy-checkout-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Populate product data
      this.populateProductData();
      
      // Reset to first step
      this.goToStep('product');
      
      // Sometimes show waiting room (Yeezy-style randomness)
      if (Math.random() < 0.3) { // 30% chance
        this.showWaitingRoom();
      }
    }
  }

  closeCheckout() {
    const modal = document.getElementById('yeezy-checkout-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form
      this.resetCheckout();
    }
  }

  goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => {
      s.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById(`checkout-step-${step}`);
    if (targetStep) {
      targetStep.classList.add('active');
      this.currentStep = step;
      
      // Special handling for payment step
      if (step === 'payment') {
        this.mountStripeElements();
        this.populateOrderSummary();
      }
    }
  }

  showWaitingRoom() {
    // Show waiting room first
    this.goToStep('waiting-room');
    
    // Simulate queue position and wait time
    let position = Math.floor(Math.random() * 500) + 100;
    let waitTime = Math.floor(Math.random() * 3) + 2; // 2-5 minutes
    
    document.getElementById('queue-position').textContent = position.toLocaleString();
    document.getElementById('wait-time').textContent = `${waitTime}-${waitTime + 2} minutes`;
    
    // Simulate queue movement
    const updateQueue = () => {
      if (position > 1) {
        position -= Math.floor(Math.random() * 5) + 1;
        document.getElementById('queue-position').textContent = position.toLocaleString();
        
        if (position <= 1) {
          // Allow access to checkout
          setTimeout(() => {
            this.goToStep('product');
          }, 1000);
        } else {
          setTimeout(updateQueue, Math.random() * 3000 + 2000); // 2-5 seconds
        }
      }
    };
    
    setTimeout(updateQueue, 2000);
  }

  populateProductData() {
    if (!this.selectedProduct) return;
    
    const preview = document.getElementById('product-preview');
    if (preview) {
      preview.innerHTML = `
        <img src="${this.selectedProduct.frontImg}" alt="${this.selectedProduct.name}" />
        <div class="product-info">
          <h3>${this.selectedProduct.name}</h3>
          <div class="price">$${this.selectedProduct.price}</div>
        </div>
      `;
    }
    
    this.updatePricing();
  }

  updateQuantityDisplay() {
    const display = document.getElementById('quantity-display');
    if (display) {
      display.textContent = this.quantity;
    }
  }

  updatePricing() {
    if (!this.selectedProduct) return;
    
    const basePrice = this.selectedProduct.price;
    const subtotal = basePrice * this.quantity;
    
    // Apply quantity discounts (like your existing cart)
    let effectivePrice = basePrice;
    if (this.quantity >= 4) {
      effectivePrice = 50;
    } else if (this.quantity >= 2) {
      effectivePrice = 55;
    }
    
    const total = effectivePrice * this.quantity;
    
    // Update displays
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
    
    // Update installment amount
    this.updateInstallmentAmount();
  }

  updateInstallmentAmount() {
    const total = this.calculateTotal();
    const installmentAmount = total / 4;
    
    const installmentDisplay = document.getElementById('installment-amount');
    if (installmentDisplay) {
      installmentDisplay.textContent = `$${installmentAmount.toFixed(2)}`;
    }
  }

  calculateTotal() {
    if (!this.selectedProduct) return 0;
    
    const basePrice = this.selectedProduct.price;
    let effectivePrice = basePrice;
    
    if (this.quantity >= 4) {
      effectivePrice = 50;
    } else if (this.quantity >= 2) {
      effectivePrice = 55;
    }
    
    return effectivePrice * this.quantity;
  }

  validateProductStep() {
    if (!this.selectedSize) {
      this.showToast('Please select a size', 'error');
      return false;
    }
    return true;
  }

  validateInfoStep() {
    const requiredFields = ['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip', 'phone'];
    
    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        this.showToast(`Please fill in all required fields`, 'error');
        field?.focus();
        return false;
      }
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    if (!this.isValidEmail(email)) {
      this.showToast('Please enter a valid email address', 'error');
      return false;
    }
    
    // Store customer info
    this.customerInfo = {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zip: document.getElementById('zip').value,
      phone: document.getElementById('phone').value
    };
    
    return true;
  }

  mountStripeElements() {
    if (this.cardElement) {
      const cardElementContainer = document.getElementById('stripe-card-element');
      if (cardElementContainer && !cardElementContainer.hasChildNodes()) {
        this.cardElement.mount('#stripe-card-element');
      }
    }
  }

  populateOrderSummary() {
    if (!this.selectedProduct) return;
    
    const summaryItem = document.getElementById('summary-item');
    const summaryTotal = document.getElementById('summary-total');
    const finalTotal = document.getElementById('final-total');
    
    const total = this.calculateTotal();
    
    if (summaryItem) {
      summaryItem.innerHTML = `
        <div>
          <div>${this.selectedProduct.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-gray);">
            Size: ${this.selectedSize} | Qty: ${this.quantity}
          </div>
        </div>
        <div>$${total.toFixed(2)}</div>
      `;
    }
    
    if (summaryTotal) {
      summaryTotal.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      `;
    }
    
    if (finalTotal) {
      finalTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  async processOrder() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.showProcessingState(true);
    
    try {
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
      
      if (paymentMethod === 'full') {
        await this.processFullPayment();
      } else {
        await this.processInstallmentPayment();
      }
      
    } catch (error) {
      console.error('Payment processing error:', error);
      this.showToast('Payment failed. Please try again.', 'error');
    } finally {
      this.isProcessing = false;
      this.showProcessingState(false);
    }
  }

  async processFullPayment() {
    if (!this.stripe || !this.cardElement) {
      // Demo mode - simulate successful payment
      await this.simulatePayment();
      return;
    }
    
    const total = this.calculateTotal();
    
    // Create payment intent on your server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        customer: this.customerInfo,
        product: this.selectedProduct,
        size: this.selectedSize,
        quantity: this.quantity
      }),
    });
    
    const { client_secret } = await response.json();
    
    // Confirm payment
    const result = await this.stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: this.cardElement,
        billing_details: {
          name: `${this.customerInfo.firstName} ${this.customerInfo.lastName}`,
          email: this.customerInfo.email,
          address: {
            line1: this.customerInfo.address,
            city: this.customerInfo.city,
            state: this.customerInfo.state,
            postal_code: this.customerInfo.zip,
          },
        },
      },
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    } else {
      this.showOrderConfirmation(result.paymentIntent);
    }
  }

  async processInstallmentPayment() {
    // For demo purposes - in production, integrate with services like Sezzle, Klarna, etc.
    this.showToast('Installment payments coming soon!', 'info');
    await this.simulatePayment();
  }

  async simulatePayment() {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success
    this.showOrderConfirmation({
      id: 'demo_' + Date.now(),
      amount: Math.round(this.calculateTotal() * 100),
      status: 'succeeded'
    });
  }

  showOrderConfirmation(paymentIntent) {
    // Populate order details
    const orderDetails = document.getElementById('order-details');
    if (orderDetails) {
      orderDetails.innerHTML = `
        <div style="text-align: left;">
          <h4 style="margin-bottom: 1rem; color: var(--primary-white);">Order Details</h4>
          <div style="margin-bottom: 0.5rem;">
            <strong>Order ID:</strong> ${paymentIntent.id}
          </div>
          <div style="margin-bottom: 0.5rem;">
            <strong>Product:</strong> ${this.selectedProduct.name}
          </div>
          <div style="margin-bottom: 0.5rem;">
            <strong>Size:</strong> ${this.selectedSize}
          </div>
          <div style="margin-bottom: 0.5rem;">
            <strong>Quantity:</strong> ${this.quantity}
          </div>
          <div style="margin-bottom: 0.5rem;">
            <strong>Total:</strong> $${(paymentIntent.amount / 100).toFixed(2)}
          </div>
          <div style="margin-bottom: 0.5rem;">
            <strong>Email:</strong> ${this.customerInfo.email}
          </div>
        </div>
      `;
    }
    
    // Show confirmation step
    this.goToStep('confirmation');
    
    // Add to cart for tracking (optional)
    if (window.briscoCart) {
      window.briscoCart.addItem({
        ...this.selectedProduct,
        size: this.selectedSize,
        quantity: this.quantity
      });
    }
  }

  showProcessingState(processing) {
    const btn = document.getElementById('complete-order');
    const btnText = btn?.querySelector('.btn-text');
    const btnLoader = btn?.querySelector('.btn-loader');
    
    if (processing) {
      btn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'flex';
    } else {
      btn.disabled = false;
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
    }
  }

  showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.yeezy-toast').forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `yeezy-toast yeezy-toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      padding: '1rem 1.5rem',
      borderRadius: '4px',
      color: 'white',
      fontSize: '0.85rem',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease',
      zIndex: '10002',
      maxWidth: '300px',
      backdropFilter: 'blur(10px)'
    });
    
    // Type-specific styles
    if (type === 'error') {
      toast.style.background = 'rgba(220, 38, 38, 0.9)';
      toast.style.border = '1px solid rgba(220, 38, 38, 0.3)';
    } else if (type === 'success') {
      toast.style.background = 'rgba(16, 185, 129, 0.9)';
      toast.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    } else {
      toast.style.background = 'rgba(59, 130, 246, 0.9)';
      toast.style.border = '1px solid rgba(59, 130, 246, 0.3)';
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  resetCheckout() {
    this.selectedProduct = null;
    this.selectedSize = null;
    this.quantity = 1;
    this.customerInfo = {};
    this.currentStep = 'product';
    
    // Reset form fields
    document.querySelectorAll('.checkout-form input').forEach(input => {
      input.value = '';
    });
    
    // Reset selections
    document.querySelectorAll('.size-option').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Reset payment method
    document.getElementById('pay-full').checked = true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Initialize Yeezy checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Yeezy checkout system...');
  window.yeezyCheckout = new YeezyCheckout();
  
  // Add global function to open checkout
  window.openYeezyCheckout = (product) => {
    window.yeezyCheckout.openCheckout(product);
  };
  
  console.log('Yeezy checkout ready!');
});

// Keyboard shortcuts (Yeezy-style)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('yeezy-checkout-modal');
    if (modal && modal.classList.contains('active')) {
      window.yeezyCheckout.closeCheckout();
    }
  }
});
