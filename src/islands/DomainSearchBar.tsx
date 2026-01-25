import { useState } from 'react';
import { Search, Loader2, Globe } from 'lucide-react';
import { TypingPlaceholder } from './TypingPlaceholder';
import { NetworkGrid } from './NetworkGrid';

export function DomainSearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    window.location.href = `/dominios?q=${encodeURIComponent(query.trim())}`;
  };

  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-[#0a0a0f]">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a0f] to-background" />

      {/* Radial glow in center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,211,77,0.08)_0%,transparent_70%)]" />

      {/* Network grid background */}
      <NetworkGrid
        className="pointer-events-none"
        nodeCount={70}
        connectionDistance={150}
        nodeColor="#fcd34d"
        lineColor="#fcd34d"
        nodeSize={2}
        speed={0.3}
      />

      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        {/* Icon */}
        <div className="mb-4 sm:mb-6 inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-solwed-yellow/20 to-solwed-yellow/5 border border-solwed-yellow/20">
          <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-solwed-yellow" />
        </div>

        {/* Title */}
        <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
          Encuentra tu <span className="text-gradient">dominio</span>
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">
          Encuentra el nombre perfecto para tu proyecto
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 max-w-2xl mx-auto">
          <div className="form-group flex-1">
            <div className="relative group">
              {/* Glow effect on focus */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-solwed-yellow/50 to-amber-500/50 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
              <input
                type="text"
                className="form-input relative !bg-zinc-800 !border-zinc-600"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              <TypingPlaceholder visible={!query} />
            </div>
          </div>
          <button
            type="submit"
            className="form-button form-button-primary h-[50px] sm:h-[58px] px-4 sm:px-6 shadow-lg shadow-solwed-yellow/20 hover:shadow-solwed-yellow/40 transition-shadow"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>

        {/* Popular extensions */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['.es', '.com', '.net', '.org', '.eu'].map((ext) => (
            <span
              key={ext}
              className="px-3 py-1 text-sm rounded-full bg-muted/50 text-muted-foreground border border-border/50"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DomainSearchBar;
