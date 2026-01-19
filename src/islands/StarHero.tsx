import { useState, useEffect } from 'react';
import { Star, Sparkles, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { STAR_PRODUCT } from '../lib/catalog';

const rotatingBenefits = [
  'Web profesional incluida',
  'ERP + Verifactu integrado',
  'CRM con email marketing',
  'Chatbot IA 24/7',
  'Fichajes y control horario',
  'Formacion continua',
  'Hosting + 50GB correos',
  'Sin permanencia',
];

export function StarHero() {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentBenefit((prev) => (prev + 1) % rotatingBenefits.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const annualPricing = STAR_PRODUCT.pricing.annual;

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/laptop-dark.webp"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
      </div>

      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-40 -translate-y-1/3 translate-x-1/3 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-left">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border mb-8 float-label">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">Servicio Estrella</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>

          {/* Main Headline */}
          <h1 className="hero-headline mb-6">
            Tu departamento digital
            <br />
            <span className="text-gradient">completo por 150€/mes</span>
          </h1>

          {/* Rotating Benefits */}
          <div className="h-8 mb-8 flex items-center">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span
                className={cn(
                  'text-xl font-medium transition-all duration-300',
                  isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                )}
              >
                {rotatingBenefits[currentBenefit]}
              </span>
            </div>
          </div>

          {/* Value Proposition */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Web, ERP, CRM, IA, email marketing, fichajes, formacion y hosting.
            <br />
            <span className="text-foreground font-medium">
              Todo lo que necesitas para digitalizar tu negocio.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
            <a
              href={annualPricing?.stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition-all shine-effect animate-subtle-pulse"
            >
              Empezar ahora
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href="/precios"
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium rounded-md border border-border bg-background hover:bg-muted transition-all"
            >
              Ver todos los precios
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Sin permanencia</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Pago seguro con Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Soporte en espanol</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Activo en 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
