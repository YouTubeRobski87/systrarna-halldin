/**
 * Ange butikens riktiga Swish-nummer här när manuella Swish-betalningar aktiveras.
 * Ett tomt värde håller kassan i ett säkert förhandsläge och förhindrar beställningar.
 */
export const SWISH_NUMBER = '0761905176';
export const isSwishConfigured = SWISH_NUMBER.trim().length > 0;
