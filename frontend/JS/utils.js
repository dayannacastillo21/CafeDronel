// utils.js - Funciones utilitarias para todo el sistema

class CoffeUtils {
    // ========== FORMATO DE FECHAS ==========
    static formatDate(date, includeTime = false) {
        if (!date) return '-';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return d.toLocaleDateString('es-ES', options);
    }

    static formatCurrency(amount, currency = 'PEN') {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // ========== VALIDACIONES ==========
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[0-9]{9}$/;
        return re.test(phone.replace(/\D/g, ''));
    }

    // ========== MANEJO DEL CARRITO ==========
    static getCart() {
        try {
            return JSON.parse(localStorage.getItem('carrito')) || [];
        } catch (error) {
            console.error('Error obteniendo carrito:', error);
            return [];
        }
    }

    static saveCart(cart) {
        try {
            localStorage.setItem('carrito', JSON.stringify(cart));
            this._updateCartCount();
            return true;
        } catch (error) {
            console.error('Error guardando carrito:', error);
            return false;
        }
    }

    static addToCart(product, quantity = 1) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        return this.saveCart(cart);
    }

    static removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.id !== productId);
        return this.saveCart(cart);
    }

    static clearCart() {
        return this.saveCart([]);
    }

    static getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    }

    static _updateCartCount() {
        const cart = this.getCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Actualizar en todos los elementos con la clase cart-count
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    // ========== NOTIFICACIONES ==========
    static showToast(message, type = 'success') {
        // Buscar toast existente o crear uno nuevo
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        // Remover del DOM después de ocultarse
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // ========== MANEJO DE FORMULARIOS ==========
    static serializeForm(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    static validateForm(formElement, rules) {
        const errors = {};
        const formData = this.serializeForm(formElement);
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = rule.requiredMessage || 'Este campo es requerido';
            } else if (rule.pattern && value && !rule.pattern.test(value)) {
                errors[field] = rule.patternMessage || 'Formato inválido';
            } else if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = rule.minLengthMessage || `Mínimo ${rule.minLength} caracteres`;
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    // ========== UTILIDADES DE RENDIMIENTO ==========
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========== MANEJO DE ERRORES ==========
    static handleError(error, userMessage = 'Ocurrió un error') {
        console.error('Error:', error);
        
        // Mostrar mensaje al usuario
        this.showToast(userMessage, 'danger');
        
        // Enviar error a servicio de monitoreo (si existe)
        if (window.analytics) {
            window.analytics.track('Error', {
                message: error.message,
                stack: error.stack,
                url: window.location.href
            });
        }
        
        return { success: false, error: error.message };
    }

    // ========== UTILIDADES DE DOM ==========
    static toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }

    static addLoading(element) {
        element.disabled = true;
        element.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Cargando...';
    }

    static removeLoading(element, originalText) {
        element.disabled = false;
        element.innerHTML = originalText;
    }
}

// Hacer disponible globalmente
window.CoffeUtils = CoffeUtils;

// Inicializar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    CoffeUtils._updateCartCount();
});