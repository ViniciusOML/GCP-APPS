import React, { useState } from 'react';
import { Search, X, History, ArrowRight, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (name: string) => void;
  isLoading: boolean;
  recentSearches: string[];
  onSelectRecent: (name: string) => void;
  onClearRecent: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  recentSearches,
  onSelectRecent,
  onClearRecent,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-4.5 pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Digite o nome de uma pessoa ou político brasileiro..."
            className="w-full pl-12 pr-32 py-4 text-base sm:text-lg bg-slate-900/90 text-slate-100 placeholder-slate-400 rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/40 focus:outline-none focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/15 transition-all"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <span>Consultando...</span>
                </>
              ) : (
                <>
                  <span>Consultar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Recent Searches (history maintained by user searches only, no quick suggestions) */}
      {recentSearches.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <History className="w-3 h-3 text-slate-400" />
              Consultas recentes:
            </span>
            {recentSearches.slice(0, 5).map((recent) => (
              <button
                key={recent}
                onClick={() => {
                  setQuery(recent);
                  onSelectRecent(recent);
                }}
                className="text-slate-300 hover:text-emerald-300 bg-slate-900/40 hover:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[11px] transition-colors"
              >
                {recent}
              </button>
            ))}
          </div>
          <button
            onClick={onClearRecent}
            className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
          >
            Limpar histórico
          </button>
        </div>
      )}
    </div>
  );
};
