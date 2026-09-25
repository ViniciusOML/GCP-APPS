import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, ArrowRight, Loader2, User } from 'lucide-react';
import { CandidatoResumo } from '../types';

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
  const [suggestions, setSuggestions] = useState<CandidatoResumo[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live autocomplete debounced search across all Brazilian candidates
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/eleicoes/candidatos?busca=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.candidatos)) {
            setSuggestions(data.candidatos.slice(0, 6));
            setShowDropdown(true);
          }
        })
        .catch(() => {
          setSuggestions([]);
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      setShowDropdown(false);
      onSearch(query.trim());
    }
  };

  const handleSelectSuggestion = (nome: string) => {
    setQuery(nome);
    setShowDropdown(false);
    onSearch(nome);
  };

  const getPapelBadge = (papel: string) => {
    switch (papel) {
      case 'Presidente':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Senador':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'Deputado Federal':
      default:
        return 'bg-sky-500/15 text-sky-300 border-sky-500/40';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 relative" ref={dropdownRef}>
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
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            disabled={isLoading}
            placeholder="Pesquise qualquer candidato(a) do Brasil (Presidente, Senadores, Deputados)..."
            className="w-full pl-12 pr-32 py-4 text-base sm:text-lg bg-slate-900/90 text-slate-100 placeholder-slate-400 rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/40 focus:outline-none focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/15 transition-all"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowDropdown(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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

      {/* Autocomplete Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && !isLoading && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 bg-slate-950/60 text-[11px] font-bold text-slate-400 flex items-center justify-between">
            <span>Candidatos e Parlamentares Oficiais Encontrados</span>
            <span className="text-emerald-400 font-normal">Pressione Enter ou clique para auditar</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={`${s.papel}-${s.id}`}
                type="button"
                onClick={() => handleSelectSuggestion(s.nome)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-800/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {s.fotoUrl ? (
                      <img
                        src={s.fotoUrl}
                        alt={s.nome}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300 truncate transition-colors">
                      {s.nome}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-300">{s.partido}</span>
                      {s.numeroEleitoral ? (
                        <>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-mono">Nº {s.numeroEleitoral}</span>
                        </>
                      ) : null}
                      {s.uf && s.uf !== 'BR' && (
                        <>
                          <span>&bull;</span>
                          <span className="font-mono text-slate-400">{s.uf}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0 ${getPapelBadge(
                    s.papel
                  )}`}
                >
                  {s.papel}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && !showDropdown && (
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
                className="text-slate-300 hover:text-emerald-300 bg-slate-900/40 hover:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[11px] transition-colors cursor-pointer"
              >
                {recent}
              </button>
            ))}
          </div>
          <button
            onClick={onClearRecent}
            className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Limpar histórico
          </button>
        </div>
      )}
    </div>
  );
};
