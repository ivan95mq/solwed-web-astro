import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, MessageCircle, Mail } from 'lucide-react';
import { useCart } from '../lib/useCart';

function formatEur(n: number): string {
  return n.toFixed(2).replace('.', ',') + '\u202F\u20AC';
}

function buildMessage(cart: ReturnType<typeof useCart>['cart'], summary: ReturnType<typeof useCart>['summary']): string {
  let msg = 'Hola, me gustaria solicitar presupuesto para:\n\n';
  cart.forEach((item, i) => {
    const period = item.billingPeriod === 'monthly' ? 'Mensual' : 'Anual';
    msg += `${i + 1}. ${item.name} (${period}) - ${formatEur(item.selectedPrice)}\n`;
  });
  msg += '\n---\n';
  if (summary.totalMonthly > 0) {
    msg += `Gasto mensual: ${formatEur(summary.totalMonthly)}\n`;
  }
  if (summary.totalAnnual > 0) {
    msg += `Gasto anual: ${formatEur(summary.totalAnnual)}\n`;
  }
  msg += `Total estimado anual: ${formatEur(summary.totalEstimatedAnnual)}\n`;
  return msg;
}

export function FloatingCart() {
  const { cart, remove, clear, itemCount, summary } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  function handleWhatsApp() {
    const msg = buildMessage(cart, summary);
    const url = `https://wa.me/34644831916?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  function handleEmail() {
    const msg = buildMessage(cart, summary);
    const url = `mailto:hola@solwed.es?subject=${encodeURIComponent('Presupuesto SOLWED')}&body=${encodeURIComponent(msg)}`;
    window.location.href = url;
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {itemCount > 0 && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
              {itemCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex flex-col bg-card md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-full md:max-w-md md:rounded-l-3xl md:shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 p-4 sm:p-6">
                <h2 className="font-orbitron text-lg font-bold text-foreground">
                  Tu carrito ({itemCount})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground">Tu carrito esta vacio</p>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li
                        key={item.productId}
                        className="flex items-start justify-between rounded-xl border border-border/50 bg-background/50 p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{item.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.billingPeriod === 'monthly' ? 'Mensual' : 'Anual'} &mdash;{' '}
                            <span className="font-semibold text-primary">{formatEur(item.selectedPrice)}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => remove(item.productId)}
                          className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Summary + Actions */}
              {cart.length > 0 && (
                <div className="border-t border-border/50 p-4 sm:p-6 space-y-4 sm:space-y-5">
                  {/* Summary */}
                  <div className="rounded-xl bg-muted/30 p-4 space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                      Resumen de gastos
                    </p>
                    {summary.totalMonthly > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gasto mensual</span>
                        <span className="font-semibold text-foreground">{formatEur(summary.totalMonthly)}</span>
                      </div>
                    )}
                    {summary.totalAnnual > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gasto anual</span>
                        <span className="font-semibold text-foreground">{formatEur(summary.totalAnnual)}</span>
                      </div>
                    )}
                    <div className="border-t border-border/50 pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">Total estimado anual</span>
                        <span className="font-bold text-primary">{formatEur(summary.totalEstimatedAnnual)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleWhatsApp}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-[#20bd5a] hover:shadow-lg"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Solicitar por WhatsApp
                    </button>
                    <button
                      onClick={handleEmail}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5"
                    >
                      <Mail className="h-4 w-4" />
                      Solicitar por Email
                    </button>
                  </div>

                  {/* Clear */}
                  <button
                    onClick={() => { clear(); setIsOpen(false); }}
                    className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-destructive"
                  >
                    Vaciar carrito
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingCart;
