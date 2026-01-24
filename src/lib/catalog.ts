/**
 * SOLWED Service Catalog
 * Updated: January 2025
 *
 * Central data source for all products and pricing
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PriceOption {
  price: number
  priceWithTax: number
  period: 'mes' | 'año'
  savings?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  category: 'star' | 'hosting' | 'erp' | 'email' | 'addon'
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
      savings: 'Solo mantenimiento web',
    },
    annual: {
      price: 1500,
      priceWithTax: 1815,
      period: 'año',
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
    slug: 'web-wordpress-starter',
    name: 'Web WordPress Starter',
    tagline: 'Perfecto para empezar',
    description: 'Hosting WordPress gestionado con soporte técnico incluido.',
    category: 'hosting',
    pricing: {
      monthly: {
        price: 9.89,
        priceWithTax: 11.97,
        period: 'mes',
      },
      annual: {
        price: 98.90,
        priceWithTax: 119.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Potencia estándar',
      '5GB de almacenamiento',
      'Certificado SSL gratuito',
      'Backups diarios',
      'Actualizaciones automáticas',
      'Soporte por email/tickets',
      'Migración gratuita',
    ],
  },
  {
    id: 'hosting-pro',
    slug: 'web-wordpress-pro',
    name: 'Web WordPress Pro',
    tagline: 'Para negocios en crecimiento',
    description: 'Más recursos y funcionalidades avanzadas.',
    category: 'hosting',
    badge: 'Popular',
    pricing: {
      monthly: {
        price: 19.89,
        priceWithTax: 24.07,
        period: 'mes',
      },
      annual: {
        price: 198.90,
        priceWithTax: 240.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Potencia avanzada',
      '15GB de almacenamiento',
      'Certificado SSL gratuito',
      'Backups diarios',
      'Entorno staging (pruebas)',
      'Actualizaciones automáticas',
      'Soporte por email/tickets',
      'Migración gratuita',
    ],
  },
  {
    id: 'hosting-vps',
    slug: 'web-wordpress-vps',
    name: 'Web WordPress VPS',
    tagline: 'Máximo rendimiento',
    description: 'Recursos dedicados para proyectos exigentes.',
    category: 'hosting',
    pricing: {
      monthly: {
        price: 49.89,
        priceWithTax: 60.37,
        period: 'mes',
      },
      annual: {
        price: 498.90,
        priceWithTax: 603.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Potencia dedicada',
      '50GB SSD dedicado',
      'Certificado SSL gratuito',
      'Backups diarios',
      'Entorno staging (pruebas)',
      'CDN incluido',
      'Recursos dedicados',
      'Soporte por email/tickets',
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
      },
      annual: {
        price: 98.90,
        priceWithTax: 119.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Facturación electrónica + Verifactu',
      'Presupuestos',
      'Inventario básico',
      'Contabilidad básica',
      'Informes básicos',
      'Portal personalizado (tuempresa.erpsolwed.es)',
      'Backups diarios',
      'Soporte por email/tickets',
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
      },
      annual: {
        price: 198.90,
        priceWithTax: 240.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Todo de Principiante +',
      'Inventario y almacén completo',
      'Contabilidad avanzada',
      'Informes avanzados',
      'TPV (Punto de Venta)',
      'Recursos Humanos',
      'Edición de plantillas de facturas',
      'Remesas bancarias',
      'Soporte por email/tickets',
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
      },
      annual: {
        price: 498.90,
        priceWithTax: 603.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Todo de Estándar +',
      'Conciliación bancaria',
      'Firmas digitales',
      'Portal del cliente',
      'Multi-empresa',
      'API / Integraciones',
      'Recursos dedicados',
      'Soporte por email/tickets',
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
// EMAIL PLANS
// ============================================================================

export const EMAIL_PLANS: Product[] = [
  {
    id: 'email-starter',
    slug: 'email-starter',
    name: 'Email Starter',
    tagline: 'Para empezar',
    description: 'Correo electrónico profesional con tu dominio. Servidor dedicado en Europa.',
    category: 'email',
    pricing: {
      monthly: {
        price: 4.89,
        priceWithTax: 5.92,
        period: 'mes',
      },
      annual: {
        price: 48.90,
        priceWithTax: 59.17,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      '5 buzones de correo',
      '10GB por buzón',
      'IMAP/POP3/SMTP',
      'SSL/TLS seguro',
      'Webmail incluido',
      'Antispam/Antivirus',
      'Alias ilimitados',
      'Autoresponders',
      'Soporte por email',
    ],
  },
  {
    id: 'email-business',
    slug: 'email-business',
    name: 'Email Business',
    tagline: 'Para equipos',
    description: 'Más buzones y almacenamiento para empresas en crecimiento.',
    category: 'email',
    badge: 'Popular',
    pricing: {
      monthly: {
        price: 14.89,
        priceWithTax: 18.02,
        period: 'mes',
      },
      annual: {
        price: 148.90,
        priceWithTax: 180.17,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      '15 buzones de correo',
      '20GB por buzón',
      'IMAP/POP3/SMTP',
      'SSL/TLS seguro',
      'Webmail incluido',
      'Antispam/Antivirus',
      'Alias ilimitados',
      'Autoresponders',
      'Soporte por email + chat',
    ],
  },
  {
    id: 'email-unlimited',
    slug: 'email-unlimited',
    name: 'Email Unlimited',
    tagline: 'Sin límites',
    description: 'Buzones ilimitados con máximo almacenamiento.',
    category: 'email',
    pricing: {
      monthly: {
        price: 29.89,
        priceWithTax: 36.17,
        period: 'mes',
      },
      annual: {
        price: 298.90,
        priceWithTax: 361.67,
        period: 'año',
        savings: '2 meses gratis',
      },
    },
    features: [
      'Buzones ilimitados',
      '50GB por buzón',
      'IMAP/POP3/SMTP',
      'SSL/TLS seguro',
      'Webmail incluido',
      'Antispam/Antivirus',
      'Alias ilimitados',
      'Autoresponders',
      'Soporte prioritario',
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
  ...EMAIL_PLANS,
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
