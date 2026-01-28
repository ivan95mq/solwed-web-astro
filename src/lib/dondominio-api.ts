/**
 * DonDominio API Wrapper
 * Documentación: https://dev.dondominio.com/api/docs/
 */

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  price?: number;
  currency?: string;
  tld: string;
}

export interface DomainPricing {
  tld: string;
  register: number;
  transfer: number;
  renew: number;
  currency: string;
}

export interface PurchaseRequest {
  domain: string;
  tld: string;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export class DonDominioAPI {
  private apiUser: string;
  private apiPass: string;
  private baseUrl: string;

  constructor() {
    // Use process.env for server-side runtime access (SSR)
    // import.meta.env only works at build time
    this.apiUser = process.env.DONDOMINIO_API_USER || import.meta.env.DONDOMINIO_API_USER || '';
    this.apiPass = process.env.DONDOMINIO_API_PASS || import.meta.env.DONDOMINIO_API_PASS || '';
    this.baseUrl = process.env.DONDOMINIO_API_URL || import.meta.env.DONDOMINIO_API_URL || 'https://simple-api.dondominio.net';

    if (!this.apiUser || !this.apiPass) {
      console.warn('[DonDominio] API credentials not configured. Domain checks will be simulated.');
    }
  }

  /**
   * Verifica la disponibilidad de múltiples dominios
   */
  async checkDomains(domains: string[]): Promise<DomainCheckResult[]> {
    // Si no hay credenciales, simular resultados
    if (!this.apiUser || !this.apiPass) {
      return this.simulateCheck(domains);
    }

    try {
      // DonDominio usa form-data con apiuser y apipasswd
      const formData = new URLSearchParams();
      formData.append('apiuser', this.apiUser);
      formData.append('apipasswd', this.apiPass);
      formData.append('domain', domains.join(','));

      const response = await fetch(`${this.baseUrl}/domain/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`DonDominio API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseCheckResponse(data);
    } catch (error) {
      console.error('[DonDominio] Error checking domains:', error);
      // Fallback a simulación en caso de error
      return this.simulateCheck(domains);
    }
  }

  /**
   * Obtiene los precios de TLDs específicos
   */
  async getPricing(tlds: string[]): Promise<DomainPricing[]> {
    // Si no hay credenciales, simular resultados
    if (!this.apiUser || !this.apiPass) {
      return this.simulatePricing(tlds);
    }

    try {
      const formData = new URLSearchParams();
      formData.append('apiuser', this.apiUser);
      formData.append('apipasswd', this.apiPass);
      tlds.forEach(tld => formData.append('tld', tld));

      const response = await fetch(`${this.baseUrl}/pricing/domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`DonDominio API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parsePricingResponse(data);
    } catch (error) {
      console.error('[DonDominio] Error getting pricing:', error);
      return this.simulatePricing(tlds);
    }
  }

  /**
   * Parsea la respuesta de check domains
   */
  private parseCheckResponse(data: any): DomainCheckResult[] {
    // DonDominio devuelve: { success: true, responseData: { domains: [...] } }
    if (!data || !data.success || !data.responseData || !data.responseData.domains) {
      console.error('[DonDominio] Invalid response format:', data);
      return [];
    }

    return data.responseData.domains.map((domain: any) => ({
      domain: domain.name,
      available: domain.available === true,
      price: domain.price || 0, // Precio directo en EUR
      currency: domain.currency || 'EUR',
      tld: this.extractTLD(domain.name),
    }));
  }

  /**
   * Parsea la respuesta de pricing
   */
  private parsePricingResponse(data: any): DomainPricing[] {
    // DonDominio devuelve: { success: true, responseData: { pricing: [...] } }
    if (!data || !data.success || !data.responseData) {
      console.error('[DonDominio] Invalid pricing response:', data);
      return [];
    }

    const pricing = data.responseData.pricing || data.responseData;
    if (!Array.isArray(pricing)) {
      return [];
    }

    return pricing.map((item: any) => ({
      tld: item.tld,
      register: item.register || item.price || 0,
      transfer: item.transfer || 0,
      renew: item.renew || 0,
      currency: item.currency || 'EUR',
    }));
  }

  /**
   * Extrae el TLD de un nombre de dominio
   */
  private extractTLD(domain: string): string {
    const parts = domain.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  }

  /**
   * Simula la verificación de dominios (cuando no hay API key)
   */
  private simulateCheck(domains: string[]): DomainCheckResult[] {
    const commonTLDs = ['.com', '.es', '.net', '.org', '.dev', '.io', '.app'];

    return domains.map(domain => {
      const tld = this.extractTLD(domain);
      // Simulamos que el 70% de dominios están disponibles
      const available = Math.random() > 0.3;

      return {
        domain,
        available,
        price: this.getSimulatedPrice(tld),
        currency: 'EUR',
        tld,
      };
    });
  }

  /**
   * Simula precios de TLDs (cuando no hay API key)
   */
  private simulatePricing(tlds: string[]): DomainPricing[] {
    return tlds.map(tld => ({
      tld,
      register: this.getSimulatedPrice(tld),
      transfer: this.getSimulatedPrice(tld) * 0.9,
      renew: this.getSimulatedPrice(tld) * 1.1,
      currency: 'EUR',
    }));
  }

  /**
   * Obtiene un precio simulado basado en el TLD
   */
  private getSimulatedPrice(tld: string): number {
    const prices: Record<string, number> = {
      '.com': 14.99,
      '.es': 9.99,
      '.net': 16.99,
      '.org': 14.99,
      '.dev': 24.99,
      '.io': 39.99,
      '.app': 24.99,
      '.tech': 29.99,
      '.shop': 19.99,
      '.store': 29.99,
      '.online': 19.99,
    };

    return prices[tld] || 19.99;
  }
}

/**
 * Instancia singleton de la API
 */
export const donDominioAPI = new DonDominioAPI();
