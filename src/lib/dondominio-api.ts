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
    this.apiUser = import.meta.env.DONDOMINIO_API_USER || '';
    this.apiPass = import.meta.env.DONDOMINIO_API_PASS || '';
    this.baseUrl = import.meta.env.DONDOMINIO_API_URL || 'https://simple-api.dondominio.net';

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
    if (!data || !data.domains) {
      return [];
    }

    return data.domains.map((domain: any) => ({
      domain: domain.name,
      available: domain.available === true,
      price: domain.price?.register,
      currency: domain.price?.currency || 'EUR',
      tld: this.extractTLD(domain.name),
    }));
  }

  /**
   * Parsea la respuesta de pricing
   */
  private parsePricingResponse(data: any): DomainPricing[] {
    if (!data || !data.pricing) {
      return [];
    }

    return data.pricing.map((item: any) => ({
      tld: item.tld,
      register: item.register || 0,
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
