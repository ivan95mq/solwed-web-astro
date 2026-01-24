import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always required
  preferences: false,
  analytics: false,
  marketing: false,
};

const COOKIE_CONSENT_KEY = 'solwed_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'solwed_cookie_preferences';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid layout shift on page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);

    // Dispatch custom event for analytics/marketing scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }));
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptNecessary = () => {
    saveConsent(DEFAULT_PREFERENCES);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  // Function to open settings from external trigger (e.g., footer link)
  useEffect(() => {
    const handleOpenSettings = () => {
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
      setShowSettings(true);
      setIsVisible(true);
    };

    window.addEventListener('openCookieSettings', handleOpenSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !showSettings && setIsVisible(false)}
      />

      {/* Banner */}
      <div className={cn(
        "relative w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-2xl",
        "animate-in slide-in-from-bottom-4 duration-500"
      )}>
        {!showSettings ? (
          // Main Banner
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-orbitron text-lg font-bold text-foreground">
                  Utilizamos cookies
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usamos cookies para mejorar tu experiencia, analizar el trafico y personalizar el contenido.
                  Puedes aceptar todas, solo las necesarias, o personalizar tus preferencias.{' '}
                  <a href="/legal/cookies" className="text-primary hover:underline">
                    Mas informacion
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowSettings(true)}
                className="order-3 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:order-1"
              >
                Personalizar
              </button>
              <button
                onClick={acceptNecessary}
                className="order-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Solo necesarias
              </button>
              <button
                onClick={acceptAll}
                className="order-1 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:order-3"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          // Settings Panel
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-orbitron text-lg font-bold text-foreground">
                Configurar cookies
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Cookies necesarias</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Esenciales para el funcionamiento del sitio. No se pueden desactivar.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-6 w-11 rounded-full bg-primary/50 p-0.5">
                    <div className="h-5 w-5 translate-x-5 rounded-full bg-primary shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Preferences Cookies */}
              <CookieToggle
                title="Cookies de preferencias"
                description="Recuerdan tus preferencias como el tema o idioma."
                checked={preferences.preferences}
                onChange={(checked) => setPreferences({ ...preferences, preferences: checked })}
              />

              {/* Analytics Cookies */}
              <CookieToggle
                title="Cookies analiticas"
                description="Nos ayudan a entender como usas el sitio para mejorarlo."
                checked={preferences.analytics}
                onChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
              />

              {/* Marketing Cookies */}
              <CookieToggle
                title="Cookies de marketing"
                description="Permiten mostrarte publicidad relevante en otras plataformas."
                checked={preferences.marketing}
                onChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <button
                onClick={acceptNecessary}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Rechazar opcionales
              </button>
              <button
                onClick={saveCustomPreferences}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CookieToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex-shrink-0 h-6 w-11 rounded-full p-0.5 transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <div
          className={cn(
            "h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export default CookieConsent;
