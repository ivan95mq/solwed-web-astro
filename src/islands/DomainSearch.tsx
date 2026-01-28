import { useState } from 'react';
import { Search, ShoppingCart, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
  currency: string;
  tld: string;
}

interface CartItem {
  domain: string;
  tld: string;
  price: number;
}

export function DomainSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState('');

  // Datos del formulario de checkout
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: query.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to check domain availability');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      setError('Error al buscar dominios. Por favor, inténtalo de nuevo.');
      console.error('[DomainSearch] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (domain: DomainResult) => {
    if (cart.some(item => item.domain === domain.domain)) {
      return; // Ya está en el carrito
    }

    setCart([...cart, {
      domain: domain.domain,
      tld: domain.tld,
      price: domain.price,
    }]);
    setShowCart(true);
  };

  const removeFromCart = (domain: string) => {
    setCart(cart.filter(item => item.domain !== domain));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/domains/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domains: cart,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit purchase request');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSubmitted(true);
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          setCart([]);
          setShowCheckout(false);
          setSubmitted(false);
          setCustomerName('');
          setCustomerEmail('');
          setCustomerPhone('');
          setResults([]);
          setQuery('');
        }, 3000);
      }
    } catch (err) {
      setError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
      console.error('[DomainSearch] Checkout error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca tu dominio ideal..."
            className="w-full px-6 py-4 pr-32 text-lg rounded-full border-2 border-border focus:border-primary focus:outline-none bg-background transition-all"
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "px-6 py-2 rounded-full bg-primary text-primary-foreground",
              "font-medium transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:bg-primary/90"
            )}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 inline mr-2" />
                Buscar
              </>
            )}
          </motion.button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-3"
          >
            {results.map((result, index) => (
              <motion.div
                key={result.domain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border-2 transition-all",
                  result.available
                    ? "border-green-200 bg-green-50/50 hover:border-green-300"
                    : "border-border bg-muted/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      result.available ? "bg-green-100" : "bg-muted"
                    )}
                  >
                    {result.available ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{result.domain}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.available ? 'Disponible' : 'No disponible'}
                    </div>
                  </div>
                </div>

                {result.available && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {result.price.toFixed(2)} €
                      </div>
                      <div className="text-xs text-muted-foreground">por año</div>
                    </div>
                    <motion.button
                      onClick={() => addToCart(result)}
                      disabled={cart.some(item => item.domain === result.domain)}
                      className={cn(
                        "px-4 py-2 rounded-full font-medium transition-all",
                        cart.some(item => item.domain === result.domain)
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      whileHover={{ scale: cart.some(item => item.domain === result.domain) ? 1 : 1.05 }}
                      whileTap={{ scale: cart.some(item => item.domain === result.domain) ? 1 : 0.95 }}
                    >
                      {cart.some(item => item.domain === result.domain) ? 'En carrito' : 'Añadir'}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante del carrito */}
      <AnimatePresence>
        {cart.length > 0 && !showCheckout && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setShowCart(!showCart)}
            className="fixed bottom-8 right-8 bg-primary text-primary-foreground rounded-full p-4 shadow-lg z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cart.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel del carrito */}
      <AnimatePresence>
        {showCart && !showCheckout && cart.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tu carrito</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-muted rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.map((item) => (
                  <div
                    key={item.domain}
                    className="flex justify-between items-center p-4 mb-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{item.domain}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)} € / año
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.domain)}
                      className="p-2 hover:bg-background rounded-full text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {getTotalPrice().toFixed(2)} € / año
                  </span>
                </div>
                <motion.button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-full font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Solicitar dominios
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Checkout */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setShowCheckout(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {!submitted ? (
                  <>
                    <div className="p-6 border-b border-border flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Completar solicitud</h2>
                      <button
                        onClick={() => setShowCheckout(false)}
                        disabled={submitting}
                        className="p-2 hover:bg-muted rounded-full disabled:opacity-50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCheckout} className="p-6">
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3">Dominios seleccionados:</h3>
                        {cart.map((item) => (
                          <div key={item.domain} className="flex justify-between p-3 bg-muted/30 rounded-lg mb-2">
                            <span className="font-medium">{item.domain}</span>
                            <span className="text-primary">{item.price.toFixed(2)} €</span>
                          </div>
                        ))}
                        <div className="flex justify-between p-3 bg-primary/10 rounded-lg mt-3">
                          <span className="font-bold">Total:</span>
                          <span className="font-bold text-primary">{getTotalPrice().toFixed(2)} € / año</span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
                            disabled={submitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
                            disabled={submitting}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Teléfono (opcional)
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary focus:outline-none"
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          Al enviar este formulario, recibirás un email de confirmación y nuestro equipo se pondrá en contacto contigo para completar el proceso de registro.
                        </p>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-full font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          'Enviar solicitud'
                        )}
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="h-10 w-10 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">¡Solicitud enviada!</h3>
                    <p className="text-muted-foreground mb-6">
                      Hemos recibido tu solicitud de dominios. Te contactaremos pronto para continuar con el proceso.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Esta ventana se cerrará automáticamente...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DomainSearch;
