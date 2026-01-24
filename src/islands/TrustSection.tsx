import { useEffect, useRef, useState } from 'react';
import { Shield, Award, Users, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const stats = [
  { icon: Users, value: 150, suffix: '+', label: 'Clientes activos' },
  { icon: Star, value: 100, suffix: '%', label: 'Satisfaccion' },
  { icon: Award, value: 8, suffix: '', label: 'Anos de experiencia' },
  { icon: Shield, value: 99.9, suffix: '%', label: 'Uptime garantizado' },
];

const partners = [
  { name: 'BNI', code: 'BNI', logo: '/images/partners/bni.png' },
  { name: 'FEMEC', code: 'FEMEC', logo: '/images/partners/femec.png' },
  { name: 'NEXO', code: 'NEXO', logo: '/images/partners/nexo.png' },
  { name: 'AJE', code: 'AJE', logo: '/images/partners/aje.png' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const hasDecimal = value % 1 !== 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.round(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const displayValue = hasDecimal && count === value ? value.toFixed(1) : Math.round(count);

  return (
    <span ref={ref} className="counter">
      {displayValue}
      {suffix}
    </span>
  );
}

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-section-dark">
      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  'relative p-6 rounded-2xl text-center',
                  'bg-card border border-border/50',
                  'bento-item'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Partner Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Colaboramos con las principales asociaciones empresariales
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className={cn(
                  'px-6 py-3 rounded-xl bg-muted/50 border border-border/50',
                  'bento-item'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
