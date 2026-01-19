/**
 * Testimonials data for SOLWED
 * Real reviews from Google Business (fallback if Trustindex fetch fails)
 */

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  source: 'google' | 'direct';
  featured?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sergio Soriano',
    content:
      'Para hacer desarrollo web lo mejor, además personalizan la web con el ERP y mejoran un montón los procesos de las empresas.',
    rating: 5,
    source: 'google',
    featured: true,
  },
  {
    id: '2',
    name: 'Alberto Vera',
    content:
      'Excelente trato, muy profesionales, te ayudan desde el inicio para ayudarte a crear tu página web y están contigo en todo el proceso. 100% os recomiendo que si queréis digitalizar vuestro negocio contactéis con ellos.',
    rating: 5,
    source: 'google',
    featured: true,
  },
  {
    id: '3',
    name: 'Ruben Carrasco Galan',
    content:
      'Una experiencia muy buena con buen compañerismo y buenas vibras.',
    rating: 5,
    source: 'google',
  },
  {
    id: '4',
    name: 'María José González',
    content:
      'Muy profesional, ideal para hacer tu página web, conseguir un sistema de facturación y digitalizar tu negocio.',
    rating: 5,
    source: 'google',
  },
  {
    id: '5',
    name: 'Ismael Ajana',
    content:
      'Tuve el placer de trabajar con Solwed para el desarrollo de mi sitio web y la consultoría digital de mi negocio, y no podría estar más satisfecho con los resultados. Desde el primer contacto, su equipo se mostró altamente profesional, atento y dispuesto a entender nuestras necesidades y objetivos.',
    rating: 5,
    source: 'google',
    featured: true,
  },
  {
    id: '6',
    name: 'Jorge Martínez',
    company: 'nutriZiona',
    content:
      'Trabajar con Solwed ha sido una experiencia excepcional. Su equipo demostró un profundo conocimiento en desarrollo web y consultoría digital, y nos guiaron de manera experta a través de todo el proceso.',
    rating: 5,
    source: 'google',
    featured: true,
  },
  {
    id: '7',
    name: 'Activa Tours',
    content:
      'Grandes profesionales!!!',
    rating: 5,
    source: 'google',
  },
  {
    id: '8',
    name: 'Carlos Gomara',
    content:
      'Servicio rápido y personal muy cercano. Un 10.',
    rating: 5,
    source: 'google',
  },
];

export const getFeaturedTestimonials = (): Testimonial[] =>
  TESTIMONIALS.filter((t) => t.featured);

export const getGoogleReviews = (): Testimonial[] =>
  TESTIMONIALS.filter((t) => t.source === 'google');
