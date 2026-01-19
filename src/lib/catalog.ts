/**
 * SOLWED Service Catalog
 * Updated: December 2024
 *
 * Central data source for all products, pricing, and Stripe integration
 */

// ============================================================================
// STRIPE PAYMENT LINKS (from environment variables)
// ============================================================================
// Note: These are defined as string literals to avoid hydration mismatches.
// For production, replace with live mode links or use a build-time replacement.

const PAYMENT_LINKS = {
  // Todo en Uno
  TODO_EN_UNO_MENSUAL: 'https://buy.stripe.com/3cI3cveDugFgbz7dyCco00I',
  TODO_EN_UNO_ANUAL: 'https://buy.stripe.com/eVq28rfHy3Su46F2TYco00J',
  // WordPress Hosting - Monthly
  WORDPRESS_STARTER_MENSUAL: 'https://buy.stripe.com/bJe7sL52UfBc8mV8eico00K',
  WORDPRESS_PRO_MENSUAL: 'https://buy.stripe.com/14A4gz2UM0Gi32B7aeco00L',
  WORDPRESS_VPS_MENSUAL: 'https://buy.stripe.com/dRmeVdanecp0fPn9imco00M',
  // WordPress Hosting - Annual
  WORDPRESS_STARTER_ANUAL: 'https://buy.stripe.com/aFacN5eDu60C46F66aco00Q',
  WORDPRESS_PRO_ANUAL: 'https://buy.stripe.com/5kQ6oHane4WycDbdyCco00R',
  WORDPRESS_VPS_ANUAL: 'https://buy.stripe.com/14A28rfHyex85aJdyCco00S',
  // ERP - Monthly
  ERP_PRINCIPIANTE_MENSUAL: 'https://buy.stripe.com/eVq28r3YQdt45aJ526co00N',
  ERP_ESTANDAR_MENSUAL: 'https://buy.stripe.com/28E9ATdzqfBc8mV3Y2co00O',
  ERP_PROFESIONAL_MENSUAL: 'https://buy.stripe.com/14A7sL7b29cO46F526co00P',
  // ERP - Annual
  ERP_PRINCIPIANTE_ANUAL: 'https://buy.stripe.com/8x29ATgLCbkW6eN9imco00T',
  ERP_ESTANDAR_ANUAL: 'https://buy.stripe.com/aFafZh9ja9cO46Fbquco00U',
  ERP_PROFESIONAL_ANUAL: 'https://buy.stripe.com/dRmcN52UM4Wy7iR7aeco00V',
  // Extras
  DOMINIO: 'https://buy.stripe.com/aFadR91QI3SueLjamqco00s',
  SOPORTE_PREMIUM: 'https://buy.stripe.com/9B67sLcvm74G9qZ66aco00W',
} as const

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PriceOption {
  price: number
  priceWithTax: number
  period: 'mes' | 'año'
  stripeLink: string
  savings?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  category: 'star' | 'hosting' | 'erp' | 'addon'
  isStar?: boolean
  badge?: string
  pricing: {
    monthly?: PriceOption
    annual?: PriceOption
  }
  features: string[]
  includedServices?: IncludedService[]
  icon?: string
}

export interface IncludedService {
  name: string
  description: string
  icon: string
}

export interface Coupon {
  code: string
  partner: string
  description: string
  discount: string
}

// ============================================================================
// STRIPE PORTAL
// ============================================================================

export const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/3cs7utgjNeEweB29AA'

// ============================================================================
// STAR PRODUCT: SOLWED TODO EN UNO
// ============================================================================

export const STAR_PRODUCT: Product = {
  id: 'todo-en-uno',
  slug: 'solwed-todo-en-uno',
  name: 'SOLWED Todo en Uno',
  tagline: 'Tu departamento digital completo por menos de lo que cuesta un empleado',
  description:
    'Pack integral de digitalización para pymes. Un único proveedor, una cuota fija, todo incluido.',
  category: 'star',
  isStar: true,
  badge: 'Servicio Estrella',
  pricing: {
    monthly: {
      price: 150,
      priceWithTax: 181.5,
      period: 'mes',
      stripeLink: PAYMENT_LINKS.TODO_EN_UNO_MENSUAL,
      savings: 'Solo mantenimiento web',
    },
    annual: {
      price: 1500,
      priceWithTax: 1815,
      period: 'año',
      stripeLink: PAYMENT_LINKS.TODO_EN_UNO_ANUAL,
      savings: 'Web/tienda de REGALO + 2 meses GRATIS',
    },
  },
  features: [
    'Sin coste de alta — Empiezas sin inversión inicial',
    'Sin permanencia — Cancela cuando quieras',
    'Soporte ilimitado — Email, tickets y WhatsApp',
    'Sin límites de licencias — Usuarios ilimitados en ERP',
    'Chatbot flexible — Uso ilimitado',
  ],
  includedServices: [
    {
      name: 'CRM + Mailing + Calendario',
      description: 'Brevo integrado para gestión de clientes y comunicación',
      icon: 'users',
    },
    {
      name: 'Web o Tienda Online',
      description: 'Mantenimiento mensual incluido',
      icon: 'globe',
    },
    {
      name: 'Chatbot IA',
      description: 'Desarrollo propio SOLWED con ChatGPT, entrenado con datos de tu negocio',
      icon: 'bot',
    },
    {
      name: 'ERP + Verifactu',
      description: 'FacturaScripts completo con facturación electrónica',
      icon: 'file-text',
    },
    {
      name: 'Control de Fichajes',
      description: 'Sistema de control horario para empleados',
      icon: 'clock',
    },
    {
      name: 'Canva Corporativo',
      description: 'Cuenta corporativa para diseño de marca',
      icon: 'palette',
    },
    {
      name: 'Formación Mensual',
      description: 'Sesión grupal online cada mes',
      icon: 'graduation-cap',
    },
    {
      name: 'Hosting + Dominio + Correos',
      description: 'Hasta 50GB de correos corporativos',
      icon: 'server',
    },
  ],
}

// ============================================================================
// WORDPRESS HOSTING PLANS
// ============================================================================

export const HOSTING_PLANS: Product[] = [
  {
    id: 'hosting-starter',
    slug: 'wordpress-starter',
    name: 'WordPress Starter',
    tagline: 'Perfecto para empezar',
    description: 'Hosting WordPress gestionado con soporte técnico incluido.',
    category: 'hosting',
    pricing: {
      monthly: {
        price: 9.89,
        priceWithTax: 11.97,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.WORDPRESS_STARTER_MENSUAL,
      },
      annual: {
        price: 98.90,
        priceWithTax: 119.67,
        period: 'año',
        stripeLink: PAYMENT_LINKS.WORDPRESS_STARTER_ANUAL,
        savings: '2 meses gratis',
      },
    },
    features: [
      '1 sitio WordPress',
      '5GB de almacenamiento',
      'Certificado SSL gratuito',
      'Backups semanales',
      'Panel de control intuitivo',
      'Actualizaciones automáticas',
      'Soporte técnico por email',
      'Migración gratuita',
    ],
  },
  {
    id: 'hosting-pro',
    slug: 'wordpress-pro',
    name: 'WordPress Pro',
    tagline: 'Para negocios en crecimiento',
    description: 'Más recursos y funcionalidades avanzadas.',
    category: 'hosting',
    badge: 'Popular',
    pricing: {
      monthly: {
        price: 19.89,
        priceWithTax: 24.07,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.WORDPRESS_PRO_MENSUAL,
      },
      annual: {
        price: 198.90,
        priceWithTax: 240.67,
        period: 'año',
        stripeLink: PAYMENT_LINKS.WORDPRESS_PRO_ANUAL,
        savings: '2 meses gratis',
      },
    },
    features: [
      '3 sitios WordPress',
      '15GB de almacenamiento',
      'Certificado SSL gratuito',
      'Backups diarios',
      'Entorno staging',
      'Panel de control intuitivo',
      'Actualizaciones automáticas',
      'Soporte técnico prioritario',
      'Migración gratuita',
    ],
  },
  {
    id: 'hosting-vps',
    slug: 'wordpress-vps',
    name: 'WordPress VPS',
    tagline: 'Máximo rendimiento',
    description: 'Recursos dedicados para proyectos exigentes.',
    category: 'hosting',
    pricing: {
      monthly: {
        price: 49.89,
        priceWithTax: 60.37,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.WORDPRESS_VPS_MENSUAL,
      },
      annual: {
        price: 498.90,
        priceWithTax: 603.67,
        period: 'año',
        stripeLink: PAYMENT_LINKS.WORDPRESS_VPS_ANUAL,
        savings: '2 meses gratis',
      },
    },
    features: [
      'Sitios ilimitados',
      '50GB SSD dedicado',
      'Certificado SSL gratuito',
      'Backups diarios',
      'Entorno staging',
      'Recursos dedicados',
      'Panel de control avanzado',
      'Soporte técnico premium',
      'Migración gratuita',
    ],
  },
]

// ============================================================================
// ERP PLANS
// ============================================================================

export const ERP_PLANS: Product[] = [
  {
    id: 'erp-principiante',
    slug: 'erp-principiante',
    name: 'ERP Principiante',
    tagline: 'Para autónomos',
    description: 'ERP en la nube basado en FacturaScripts con portal personalizado.',
    category: 'erp',
    pricing: {
      monthly: {
        price: 9.89,
        priceWithTax: 11.97,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.ERP_PRINCIPIANTE_MENSUAL,
      },
      annual: {
        price: 98.90,
        priceWithTax: 119.67,
        period: 'año',
        stripeLink: PAYMENT_LINKS.ERP_PRINCIPIANTE_ANUAL,
        savings: '2 meses gratis',
      },
    },
    features: [
      '1 usuario',
      'Facturación básica',
      'Informes estándar',
      'Portal personalizado (tuempresa.erpsolwed.es)',
      'Certificado SSL',
      'Backups automáticos diarios',
      'Actualizaciones del sistema',
      'Soporte técnico por email',
    ],
  },
  {
    id: 'erp-estandar',
    slug: 'erp-estandar',
    name: 'ERP Estándar',
    tagline: 'Para pequeñas empresas',
    description: 'Funcionalidades completas para gestión empresarial.',
    category: 'erp',
    badge: 'Popular',
    pricing: {
      monthly: {
        price: 19.89,
        priceWithTax: 24.07,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.ERP_ESTANDAR_MENSUAL,
      },
      annual: {
        price: 198.90,
        priceWithTax: 240.67,
        period: 'año',
        stripeLink: PAYMENT_LINKS.ERP_ESTANDAR_ANUAL,
        savings: '2 meses gratis',
      },
    },
    features: [
      '3 usuarios',
      'Inventario y almacén',
      'Contabilidad integrada',
      'TPV (Terminal Punto de Venta)',
      'Portal personalizado',
      'Certificado SSL',
      'Backups automáticos diarios',
      'Soporte técnico prioritario',
    ],
  },
  {
    id: 'erp-profesional',
    slug: 'erp-profesional',
    name: 'ERP Profesional',
    tagline: 'Para empresas exigentes',
    description: 'Sin límites, con todas las integraciones.',
    category: 'erp',
    pricing: {
      monthly: {
        price: 49.89,
        priceWithTax: 60.37,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.ERP_PROFESIONAL_MENSUAL,
      },
      annual: {
        price: 498.90,
        priceWithTax: 603.67,
        period: 'año',
        stripeLink: PAYMENT_LINKS.ERP_PROFESIONAL_ANUAL,
        savings: '2 meses gratis',
      },
    },
    features: [
      'Usuarios ilimitados',
      'Multi-empresa',
      'API completa',
      'Integraciones avanzadas',
      'Inventario y almacén',
      'Contabilidad integrada',
      'TPV avanzado',
      'Soporte técnico premium',
    ],
  },
]

// ============================================================================
// ADDITIONAL SERVICES
// ============================================================================

export const ADDON_SERVICES: Product[] = [
  {
    id: 'dominio',
    slug: 'dominio',
    name: 'Dominio .com/.es',
    tagline: 'Tu identidad online',
    description: 'Registro y renovación anual de dominios.',
    category: 'addon',
    pricing: {
      annual: {
        price: 19.89,
        priceWithTax: 24.07,
        period: 'año',
        stripeLink: PAYMENT_LINKS.DOMINIO,
      },
    },
    features: [
      'Dominios .com o .es',
      'Renovación automática',
      'Panel de gestión DNS',
      'Protección WHOIS',
      'Soporte técnico incluido',
    ],
  },
  {
    id: 'soporte-premium',
    slug: 'soporte-premium',
    name: 'Soporte Premium',
    tagline: 'Atención prioritaria',
    description: 'Soporte prioritario con formación y consultas ilimitadas.',
    category: 'addon',
    pricing: {
      monthly: {
        price: 49.89,
        priceWithTax: 60.37,
        period: 'mes',
        stripeLink: PAYMENT_LINKS.SOPORTE_PREMIUM,
      },
    },
    features: [
      'Soporte prioritario',
      'Formación personalizada',
      'Consultas ilimitadas',
      'Tiempo de respuesta < 4h',
      'Llamadas de seguimiento',
    ],
  },
]

// ============================================================================
// WEB DESIGN SERVICE (Custom Quotes)
// ============================================================================

export const WEB_DESIGN_SERVICE = {
  id: 'web-design',
  slug: 'diseno-web',
  name: 'Diseño Web y Apps a Medida',
  tagline: 'Tu web y app únicas y profesionales',
  description:
    'Desarrollo de páginas web, tiendas online y aplicaciones móviles personalizadas. Cada proyecto es único.',
  features: [
    'Diseño 100% personalizado',
    'Apps iOS y Android nativas',
    'Responsive (móvil, tablet, desktop)',
    'Optimización SEO incluida',
    'Panel de administración',
    'Formación de uso',
    'Soporte post-lanzamiento',
  ],
  cta: 'Solicitar presupuesto',
  ctaLink: '/contacto',
}

// ============================================================================
// COUPONS
// ============================================================================

export const COUPONS: Coupon[] = [
  {
    code: 'BNI',
    partner: 'Business Network International',
    description: 'Primer mes 100% GRATIS',
    discount: '100% primer mes',
  },
  {
    code: 'FEMEC',
    partner: 'Federación Empresarial Cacereña',
    description: 'Primer mes 100% GRATIS',
    discount: '100% primer mes',
  },
  {
    code: 'NEXO',
    partner: 'Nexo Emprendedores',
    description: 'Primer mes 100% GRATIS',
    discount: '100% primer mes',
  },
  {
    code: 'AJE',
    partner: 'Asociación Jóvenes Empresarios',
    description: 'Primer mes 100% GRATIS',
    discount: '100% primer mes',
  },
  {
    code: 'SOLWED',
    partner: 'Clientes referidos SOLWED',
    description: 'Primer mes 100% GRATIS',
    discount: '100% primer mes',
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getAllProducts = (): Product[] => [
  STAR_PRODUCT,
  ...HOSTING_PLANS,
  ...ERP_PLANS,
  ...ADDON_SERVICES,
]

export const getProductBySlug = (slug: string): Product | undefined =>
  getAllProducts().find(p => p.slug === slug)

export const getProductById = (id: string): Product | undefined =>
  getAllProducts().find(p => p.id === id)

export const getProductsByCategory = (category: Product['category']): Product[] =>
  getAllProducts().filter(p => p.category === category)

export const formatPrice = (price: number, period: 'mes' | 'año' = 'mes'): string =>
  `${price.toFixed(2).replace('.', ',')}€/${period}`

export const formatPriceWithTax = (priceWithTax: number, period: 'mes' | 'año' = 'mes'): string =>
  `${priceWithTax.toFixed(2).replace('.', ',')}€/${period} (IVA incl.)`

// ============================================================================
// COMPANY INFO
// ============================================================================

export const COMPANY_INFO = {
  name: 'SOLUTIONS WEBSITE DESIGN SLU',
  brand: 'SOLWED',
  cif: 'B55406862',
  address: 'Camino viejo de Mirandilla S/N',
  city: 'Mérida',
  postalCode: '06800',
  province: 'Badajoz',
  country: 'España',
  phone: '644 83 19 16',
  email: 'hola@solwed.es',
  salesEmail: 'ventas@solwed.es',
  website: 'https://solwed.es',
  social: {
    facebook: 'https://facebook.com/104035788867398',
    linkedin: 'https://linkedin.com/company/81428841',
    instagram: 'https://www.instagram.com/solwed.es/',
    twitter: 'https://twitter.com/@SolWed_es',
    threads: 'https://threads.net/@solwed.es',
    googleMaps: 'https://www.google.com/maps?cid=9604656484379762292',
  },
}

// ============================================================================
// TRUST SIGNALS
// ============================================================================

export const TRUST_SIGNALS = {
  googleRating: 5.0,
  reviewCount: 50,
  activeCompanies: 50,
  yearsExperience: 10,
  completedProjects: 50,
}
