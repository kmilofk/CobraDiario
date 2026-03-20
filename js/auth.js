// auth.js - Authentication System
const Auth = {
    // Credentials
    VALID_USER: '3102668316',
    VALID_PASSWORD: 'Jhomedin*890',

    // Session storage key
    SESSION_KEY: 'prestoManage_session',

    // Initialize authentication system
    init() {
        // Add styles for login modal
        this.addStyles();

        // Check if user is already logged in
        if (this.isAuthenticated()) {
            this.unblockApp();
        } else {
            this.showLoginModal();
            this.blockApp();
        }
    },

    // Add CSS styles for login modal
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake 0.5s;
            }
            #login-modal.active #login-overlay {
                opacity: 1;
            }
            #login-modal.active #login-card {
                transform: scale(1);
                opacity: 1;
            }
            /* App visibility control - only shown when authenticated */
            body.authenticated #app-shell,
            body.authenticated #bottom-nav {
                visibility: visible !important;
                opacity: 1 !important;
            }
            body.authenticated {
                overflow: auto !important;
            }
        `;
        document.head.appendChild(style);
    },

    // Check if user is authenticated
    isAuthenticated() {
        const session = sessionStorage.getItem(this.SESSION_KEY);
        return session === 'authenticated';
    },

    // Validate credentials
    validateCredentials(username, password) {
        return username === this.VALID_USER && password === this.VALID_PASSWORD;
    },

    // Login user
    login(username, password) {
        if (this.validateCredentials(username, password)) {
            sessionStorage.setItem(this.SESSION_KEY, 'authenticated');
            this.unblockApp();
            this.hideLoginModal();

            // Initialize app after successful login
            if (typeof app !== 'undefined' && !app.contentArea.innerHTML) {
                app.init();
            }

            return { success: true };
        } else {
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        }
    },

    // Logout user
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        this.blockApp();
        this.showLoginModal();
    },

    // Block application access
    blockApp() {
        document.body.classList.remove('authenticated');
    },

    // Unblock application access
    unblockApp() {
        document.body.classList.add('authenticated');
    },

    // Show login modal
    showLoginModal() {
        let loginModal = document.getElementById('login-modal');
        if (!loginModal) {
            loginModal = document.createElement('div');
            loginModal.id = 'login-modal';
            loginModal.innerHTML = this.getLoginModalHTML();
            document.body.appendChild(loginModal);
        }

        setTimeout(() => {
            loginModal.classList.add('active');
        }, 10);
    },

    // Hide login modal
    hideLoginModal() {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('active');
            setTimeout(() => {
                loginModal.remove();
            }, 300);
        }
    },

    // Get login modal HTML
    getLoginModalHTML() {
        return `
            <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300" id="login-overlay">
                <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 transform scale-95 opacity-0 transition-all duration-300" id="login-card">
                    <!-- Logo / App Name -->
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span class="material-symbols-outlined text-4xl text-primary">account_balance</span>
                        </div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">PrestoManage</h1>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Sistema de Préstamos</p>
                    </div>
                    
                    <!-- Login Form -->
                    <form id="login-form" class="space-y-6">
                        <!-- Username Field -->
                        <div class="relative group">
                            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Usuario
                            </label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
                                    <span class="material-symbols-outlined">person</span>
                                </span>
                                <input 
                                    type="text" 
                                    id="login-username"
                                    class="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    placeholder="Ingrese su usuario"
                                    autocomplete="username"
                                    required
                                />
                            </div>
                        </div>
                        
                        <!-- Password Field -->
                        <div class="relative group">
                            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Contraseña
                            </label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
                                    <span class="material-symbols-outlined">lock</span>
                                </span>
                                <input 
                                    type="password" 
                                    id="login-password"
                                    class="w-full h-14 pl-12 pr-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    placeholder="Ingrese su contraseña"
                                    autocomplete="current-password"
                                    required
                                />
                                <button 
                                    type="button"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    onclick="Auth.togglePasswordVisibility()"
                                >
                                    <span class="material-symbols-outlined" id="password-visibility-icon">visibility_off</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Error Message -->
                        <div id="login-error" class="hidden bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                            <span class="material-symbols-outlined text-red-500">error</span>
                            <p class="text-sm text-red-600 dark:text-red-400 font-medium" id="login-error-text"></p>
                        </div>
                        
                        <!-- Login Button -->
                        <button 
                            type="submit"
                            class="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span class="material-symbols-outlined">login</span>
                            Iniciar Sesión
                        </button>
                    </form>
                    
                    <!-- Footer -->
                    <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
                        © 2024 PrestoManage. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `;
    },

    // Toggle password visibility
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('login-password');
        const visibilityIcon = document.getElementById('password-visibility-icon');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            visibilityIcon.textContent = 'visibility';
        } else {
            passwordInput.type = 'password';
            visibilityIcon.textContent = 'visibility_off';
        }
    },

    // Show error message
    showError(message) {
        const errorDiv = document.getElementById('login-error');
        const errorText = document.getElementById('login-error-text');
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');

        // Add shake animation
        const loginCard = document.getElementById('login-card');
        loginCard.classList.add('animate-shake');
        setTimeout(() => {
            loginCard.classList.remove('animate-shake');
        }, 500);
    },

    // Hide error message
    hideError() {
        const errorDiv = document.getElementById('login-error');
        errorDiv.classList.add('hidden');
    }
};

// Initialize auth system immediately (before DOM is fully loaded)
(function () {
    // Add initial blocking styles immediately
    const style = document.createElement('style');
    style.textContent = `
        #app-shell, #bottom-nav {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        body {
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize auth when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(() => Auth.init(), 10);
        });
    } else {
        setTimeout(() => Auth.init(), 10);
    }
})();

// Form submission handler
document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'login-form') {
        e.preventDefault();

        // Bloqueo total: SIEMPRE mostrar el modal, NUNCA entra a la aplicación.
        showValidationModal();
    }
});

// VALIDATION MODAL LOGIC - Premium SaaS Design
function showValidationModal() {
    let modal = document.getElementById('validation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'validation-modal';
        modal.className = 'fixed inset-0 z-[200] flex items-center justify-center opacity-0 pointer-events-auto';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 backdrop-blur-md" id="validation-overlay"></div>
            <div id="validation-card" class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 overflow-hidden transform scale-95 opacity-0 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50">

                <!-- STEP 1 -->
                <div id="val-step-1" class="p-8 flex flex-col">
                    <!-- Modern Icon -->
                    <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 mx-auto mb-6 shadow-sm">
                        <span class="material-symbols-outlined text-3xl text-amber-500">warning</span>
                    </div>

                    <!-- Title -->
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white text-center mb-4 leading-tight">
                        Actualización requerida para continuar
                    </h2>

                    <!-- Message -->
                    <p class="text-sm text-slate-600 dark:text-slate-300 text-center mb-8 leading-relaxed">
                        Detectamos datos antiguos que pueden causar errores. Para un funcionamiento óptimo, elimina el caché de los últimos 15 días y continúa con la versión actualizada del sistema.
                    </p>

                    <!-- Buttons -->
                    <div class="flex flex-col space-y-3">
                        <button onclick="showValidationStep2()" type="button" class="group w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                            Entendido, continuar
                            <span class="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                        <button onclick="hideValidationModal()" type="button" class="w-full h-12 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-xl transition-all duration-200">
                            Cancelar
                        </button>
                    </div>
                </div>

                <!-- STEP 2 -->
                <div id="val-step-2" class="p-8 hidden flex flex-col items-center">
                    <!-- Confirmation Icon -->
                    <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 mx-auto mb-5 shadow-sm">
                        <span class="material-symbols-outlined text-3xl text-blue-500">check_circle</span>
                    </div>

                    <!-- Confirmation Message -->
                    <h3 class="text-base font-bold text-slate-900 dark:text-white text-center mb-3 leading-snug">
                        ¿Confirmas que borrarás el caché y los datos del navegador para continuar correctamente?
                    </h3>

                    <!-- Buttons -->
                    <div class="flex flex-row gap-3 w-full mt-6">
                        <button onclick="backToValidationStep1()" type="button" class="flex-1 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all duration-200 hover:shadow-md">
                            Aún no
                        </button>
                        <button onclick="completeValidation()" type="button" class="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0">
                            Sí, ya lo haré
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const step1 = document.getElementById('val-step-1');
    const step2 = document.getElementById('val-step-2');
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');

    // Fade + Scale entrance animation
    requestAnimationFrame(() => {
        modal.classList.add('transition-opacity', 'duration-300', 'opacity-100');
        const card = document.getElementById('validation-card');
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    });
}

window.hideValidationModal = function() {
    const modal = document.getElementById('validation-modal');
    if (modal) {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        const card = document.getElementById('validation-card');
        if (card) {
            card.classList.remove('scale-100', 'opacity-100');
            card.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

window.showValidationStep2 = function() {
    const step1 = document.getElementById('val-step-1');
    const step2 = document.getElementById('val-step-2');

    step1.classList.add('hidden');
    step2.classList.remove('hidden');

    // Animate step 2 entrance
    step2.classList.add('scale-95', 'opacity-0');
    requestAnimationFrame(() => {
        step2.classList.remove('scale-95', 'opacity-0');
        step2.classList.add('scale-100', 'opacity-100');
    });
};

window.backToValidationStep1 = function() {
    const step1 = document.getElementById('val-step-1');
    const step2 = document.getElementById('val-step-2');

    step2.classList.add('hidden');
    step1.classList.remove('hidden');

    // Animate step 1 entrance
    step1.classList.add('scale-95', 'opacity-0');
    requestAnimationFrame(() => {
        step1.classList.remove('scale-95', 'opacity-0');
        step1.classList.add('scale-100', 'opacity-100');
    });
};

window.completeValidation = function() {
    // Al finalizar, se oculta el modal devolviéndolo al login.
    // Al intentar iniciar sesión de nuevo, el ciclo se repetirá.
    window.hideValidationModal();
}
