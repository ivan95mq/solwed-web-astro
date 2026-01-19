import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitize a company name to create a valid client ID / subdomain
 * Used for ERP provisioning - must match backend's sanitization logic
 *
 * Rules:
 * - Lowercase
 * - Remove accents (á→a, ñ→n, etc.)
 * - Keep only alphanumeric characters
 * - Maximum 20 characters
 *
 * @example
 * sanitizeClientId("Acme Solutions S.L.") // "acmesolutionssl"
 * sanitizeClientId("García & Hermanos") // "garciahermanos"
 * sanitizeClientId("Café París") // "cafeparis"
 */
export function sanitizeClientId(companyName: string): string {
  let clientId = companyName.toLowerCase()
  // Remove accents (normalize to NFD, then strip combining diacritical marks)
  clientId = clientId.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  // Keep only alphanumeric characters
  clientId = clientId.replace(/[^a-z0-9]/g, '')
  // Limit to 20 characters
  return clientId.slice(0, 20)
}
