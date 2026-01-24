import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, ShoppingCart, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../lib/useCart';
import type { CartItem } from '../lib/cart';

type ButtonState = 'idle' | 'expanded' | 'added';

function formatEur(n: number): string {
  return n.toFixed(2).replace('.', ',') + '€';
}

function AddToCartButton({
  productId,
  name,
  priceWithTaxMonthly,
  priceWithTaxAnnual,
}: {
  productId: string;
  name: string;
  priceWithTaxMonthly?: number;
  priceWithTaxAnnual?: number;
}) {
  const { add, isInCart } = useCart();
  const [state, setState] = useState<ButtonState>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInCart(productId)) {
      setState('added');
    }
  }, [productId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (state === 'expanded' && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setState('idle');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleExpand() {
    if (state === 'added') return;
    setState('expanded');
  }

  function handleSelect(period: 'monthly' | 'annual') {
    const selectedPrice = period === 'monthly' ? priceWithTaxMonthly! : priceWithTaxAnnual!;
    const item: CartItem = {
      productId,
      name,
      billingPeriod: period,
      priceMonthly: priceWithTaxMonthly || 0,
      priceAnnual: priceWithTaxAnnual || 0,
      selectedPrice,
    };
    add(item);
    setState('added');
    timeoutRef.current = setTimeout(() => {
      // Keep as "added" state
    }, 2000);
  }

  const hasMonthly = typeof priceWithTaxMonthly === 'number' && priceWithTaxMonthly > 0;
  const hasAnnual = typeof priceWithTaxAnnual === 'number' && priceWithTaxAnnual > 0;

  // If only one option, skip expand step
  function handleIdleClick() {
    if (hasMonthly && !hasAnnual) {
      handleSelect('monthly');
    } else if (!hasMonthly && hasAnnual) {
      handleSelect('annual');
    } else {
      handleExpand();
    }
  }

  return (
    <div ref={containerRef} className="mt-4">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={handleIdleClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
          >
            <ShoppingCart className="h-4 w-4" />
            Anadir al carrito
          </motion.button>
        )}

        {state === 'expanded' && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex w-full gap-2"
          >
            {hasMonthly && (
              <button
                onClick={() => handleSelect('monthly')}
                className="flex-1 rounded-xl border border-border/50 bg-background/50 px-3 py-3 text-xs font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
              >
                Mensual<br />{formatEur(priceWithTaxMonthly!)}
              </button>
            )}
            {hasAnnual && (
              <button
                onClick={() => handleSelect('annual')}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-3 py-3 text-xs font-medium text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                Anual<br />{formatEur(priceWithTaxAnnual!)}
              </button>
            )}
          </motion.div>
        )}

        {state === 'added' && (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
          >
            <Check className="h-4 w-4" />
            Anadido al carrito
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PricingCardProps {
  name: string;
  tagline: string;
  badge?: string;
  monthlyPrice?: number;
  annualPrice?: number;
  productId: string;
  priceWithTaxMonthly?: number;
  priceWithTaxAnnual?: number;
  features: string[];
  isStar?: boolean;
  delay?: number;
}

export function PricingCard({
  name,
  tagline,
  badge,
  monthlyPrice,
  annualPrice,
  productId,
  priceWithTaxMonthly,
  priceWithTaxAnnual,
  features,
  isStar = false,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={cn(
        'group relative rounded-3xl p-[1px] transition-all duration-500',
        isStar
          ? 'bg-gradient-to-br from-primary via-primary/50 to-primary/20'
          : 'bg-gradient-to-br from-border via-border/50 to-transparent hover:from-primary/50 hover:via-primary/30 hover:to-transparent'
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100',
          isStar ? 'bg-primary/30' : 'bg-primary/20'
        )}
      />

      {/* Card content */}
      <div
        className={cn(
          'relative h-full rounded-3xl p-6 backdrop-blur-xl',
          isStar
            ? 'bg-gradient-to-br from-card/95 via-card/90 to-card/80'
            : 'bg-card/90'
        )}
      >
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay * 0.1 + 0.3, type: 'spring' }}
            className="absolute -top-3 left-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25">
              {isStar && <Sparkles className="h-3 w-3" />}
              {badge}
            </span>
          </motion.div>
        )}

        {/* Header */}
        <div className={cn('mb-6', badge && 'mt-2')}>
          <h3 className="font-orbitron text-xl font-bold text-foreground">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6 space-y-4">
          {monthlyPrice && (
            <div className="group/price">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mensual
              </p>
              <div className="flex items-baseline gap-1">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-black text-transparent">
                  {monthlyPrice}€
                </span>
                <span className="text-muted-foreground">/mes</span>
              </div>
            </div>
          )}

          {annualPrice && (
            <div className="border-t border-border/50 pt-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Anual{' '}
                <span className="text-primary">(2 meses gratis)</span>
              </p>
              <div className="flex items-baseline gap-1">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-black text-transparent">
                  {annualPrice}€
                </span>
                <span className="text-muted-foreground">/año</span>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-3">
          {features.slice(0, 5).map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay * 0.1 + i * 0.05 + 0.2 }}
              className="flex items-start gap-3 text-sm"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </span>
              <span className="text-muted-foreground">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* Add to Cart */}
        <AddToCartButton
          productId={productId}
          name={name}
          priceWithTaxMonthly={priceWithTaxMonthly}
          priceWithTaxAnnual={priceWithTaxAnnual}
        />
      </div>
    </motion.div>
  );
}

export function StarProductCard({
  name,
  tagline,
  monthlyPrice,
  annualPrice,
  annualSavings,
  features,
  includedServices,
  productId,
  priceWithTaxMonthly,
  priceWithTaxAnnual,
}: {
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: string;
  features: string[];
  includedServices: { name: string; description: string }[];
  productId: string;
  priceWithTaxMonthly: number;
  priceWithTaxAnnual: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group relative"
    >
      {/* Animated background glow */}
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

      {/* Gradient border */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-primary via-primary/50 to-primary/20 p-[2px]">
        <div className="rounded-[2rem] bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl">
          {/* Header */}
          <div className="relative overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8">
            {/* Decorative elements */}
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
              >
                <Crown className="h-4 w-4" />
                Servicio Estrella
              </motion.div>

              <h2 className="font-orbitron text-3xl font-bold text-foreground md:text-4xl">
                {name}
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">{tagline}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Pricing side */}
              <div className="space-y-6">
                {/* Monthly */}
                <div className="rounded-2xl border border-border/50 bg-background/30 p-6 backdrop-blur-sm">
                  <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Pago mensual
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-5xl font-black text-transparent">
                      {monthlyPrice}€
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                {/* Annual */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
                  <div className="absolute right-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-xl" />

                  <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Pago anual <span className="text-primary">(2 meses gratis)</span>
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-5xl font-black text-transparent">
                      {annualPrice}€
                    </span>
                    <span className="text-muted-foreground">/año</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {annualSavings}
                  </p>
                </div>

                {/* Add to Cart */}
                <AddToCartButton
                  productId={productId}
                  name={name}
                  priceWithTaxMonthly={priceWithTaxMonthly}
                  priceWithTaxAnnual={priceWithTaxAnnual}
                />
              </div>

              {/* Features side */}
              <div>
                <h3 className="mb-4 font-orbitron font-semibold text-foreground">
                  Todo incluido:
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + 0.2 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </span>
                      <span className="text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PricingCard;
