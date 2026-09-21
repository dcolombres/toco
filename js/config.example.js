/**
 * Ejemplo de configuración. Copiá valores a js/config.js según tu entorno local.
 */
window.TOCO_PUBLIC_CONFIG = {
    whatsappNumber: '54911XXXXXXXX',
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
