// lib/pin.ts
export const PIN_CONFIG = {
  // Use NEXT_PUBLIC_ para funcionar no cliente
  requiredPin: process.env.NEXT_PUBLIC_APP_PIN || '1234'
}
