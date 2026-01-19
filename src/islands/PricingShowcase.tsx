import { useState } from 'react';
import { ArrowRight, Check, Sparkles, Gift } from 'lucide-react';
import { STAR_PRODUCT } from '../lib/catalog';
import { cn } from '../lib/utils';

export function PricingShowcase() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  const pricing = STAR_PRODUCT.pricing[billingPeriod];
  const isAnnual = billingPeriod === 'annual';

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              Precios Transparentes
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Una inversion que{' '}
              <span className="text-gradient">se paga sola</span>
            </h2>
            <p className="text-muted-foreground">
              Menos de lo que cuesta un empleado a media jornada.
            </p>
          </div>

          {/* Pricing Card */}
          <div
            className={cn(
              'relative rounded-3xl overflow-hidden',
              'bg-card border-2 border-primary/30',
              'star-glow'
            )}
          >
            {/* Header with Toggle */}
            <div className="relative p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{STAR_PRODUCT.name}</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Mas popular
                  </span>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      billingPeriod === 'monthly'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                      billingPeriod === 'annual'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Anual
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      2 meses gratis
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Price */}
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-5xl md:text-6xl font-black animate-price-morph"
                      key={billingPeriod}
                    >
                      {pricing?.price}€
                    </span>
                    <span className="text-xl text-muted-foreground">/{pricing?.period}</span>
                  </div>
                  {isAnnual && pricing?.savings && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                      <Gift className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">{pricing.savings}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                      href={pricing?.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-12 px-6 font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition-all shine-effect animate-subtle-pulse"
                    >
                      Contratar ahora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                    <a
                      href="/precios"
                      className="inline-flex items-center justify-center h-12 px-6 font-medium rounded-md border border-border bg-background hover:bg-muted transition-all"
                    >
                      Ver detalles
                    </a>
                  </div>
                </div>

                {/* Right: Features */}
                <div className="space-y-3">
                  {STAR_PRODUCT.features.slice(0, 5).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bento-item"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <a
                    href="/precios"
                    className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                  >
                    Ver todo lo incluido
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Services Link */}
          <p className="text-center text-muted-foreground mt-8">
            Solo necesitas un servicio especifico?{' '}
            <a href="/precios" className="text-primary hover:underline font-medium">
              Ver servicios individuales
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
