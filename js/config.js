/**
 * Configuración pública del frontend.
 * Usá placeholders en el repo. Si cargás un número real, no lo subas en el commit.
 */
window.TOCO_PUBLIC_CONFIG = {
    // Formato internacional sin + ni espacios. Ej: 54911XXXXXXXX
    whatsappNumber: '54911XXXXXXXX',
    // Base de API (dejar vacío o '/api' en local)
    apiBase: '/api'
};

window.TOCO_WA = function (text) {
    const number = (window.TOCO_PUBLIC_CONFIG && window.TOCO_PUBLIC_CONFIG.whatsappNumber) || '';
    if (!number || /X/i.test(number)) {
        console.warn('TOCO: configurá whatsappNumber en js/config.js');
        return '#';
    }
    const base = `https://wa.me/${number}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};
