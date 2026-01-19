/**
 * FAQ data for SOLWED
 * Frequently asked questions about services
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'pricing' | 'technical' | 'support';
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: '¿Qué incluye exactamente el plan Todo en Uno?',
    answer:
      'El plan Todo en Uno incluye: web o tienda online con mantenimiento, ERP completo con Verifactu, CRM con Brevo (mailing + calendario), chatbot con IA entrenado con tus datos, control de fichajes, hosting premium, dominio, hasta 50GB de correos corporativos, Canva corporativo y formación mensual grupal. Todo por 150€/mes sin IVA.',
    category: 'general',
  },
  {
    id: '2',
    question: '¿Hay algún coste de alta o permanencia?',
    answer:
      'No, no hay coste de alta ni permanencia. Puedes cancelar en cualquier momento. Solo pagas la cuota mensual o anual que elijas. Si contratas el plan anual, además recibes la web o tienda de regalo y 2 meses gratis.',
    category: 'pricing',
  },
  {
    id: '3',
    question: '¿Cómo funciona el chatbot con IA?',
    answer:
      'Nuestro chatbot está desarrollado por SOLWED y utiliza ChatGPT. Lo entrenamos con los datos de tu negocio (productos, servicios, preguntas frecuentes) para que responda de forma personalizada a tus clientes 24/7. Puede gestionar citas, resolver dudas y derivar al soporte humano cuando sea necesario.',
    category: 'technical',
  },
  {
    id: '4',
    question: '¿Qué es Verifactu y por qué lo necesito?',
    answer:
      'Verifactu es el nuevo sistema de facturación electrónica obligatorio en España. Nuestro ERP está totalmente integrado con Verifactu, garantizando que todas tus facturas cumplen con la normativa actual y futura sin que tengas que preocuparte de nada.',
    category: 'technical',
  },
  {
    id: '5',
    question: '¿Puedo migrar mis datos desde otro sistema?',
    answer:
      'Sí, realizamos la migración de tus datos desde tu sistema anterior de forma gratuita. Nos encargamos de importar clientes, productos, histórico de facturas y toda la información relevante para que la transición sea transparente.',
    category: 'technical',
  },
  {
    id: '6',
    question: '¿Cómo es el soporte técnico?',
    answer:
      'Ofrecemos soporte por email, sistema de tickets y WhatsApp. El tiempo medio de respuesta es inferior a 4 horas en horario laboral. Además, todos los meses organizamos una sesión de formación grupal online donde puedes resolver dudas en directo.',
    category: 'support',
  },
  {
    id: '7',
    question: '¿Puedo probar el servicio antes de contratar?',
    answer:
      'Si tienes un código de socio de nuestros partners (BNI, FEMEC, NEXO, AJE), el primer mes es completamente gratis. También puedes solicitar una demostración personalizada sin compromiso contactando con nosotros.',
    category: 'pricing',
  },
  {
    id: '8',
    question: '¿El precio incluye el diseño de la web?',
    answer:
      'En el plan mensual incluimos el mantenimiento de una web existente o plantilla básica. Si necesitas un diseño personalizado, lo desarrollamos por un coste adicional según el proyecto. Con el plan anual, el diseño web o tienda online está incluido de regalo.',
    category: 'pricing',
  },
];

export const getFAQByCategory = (category: FAQItem['category']): FAQItem[] =>
  FAQ_ITEMS.filter((item) => item.category === category);
