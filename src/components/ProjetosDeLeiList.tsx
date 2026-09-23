import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Search,
} from 'lucide-react';
import { ProjetoDeLei } from '../types';

interface ProjetosDeLeiListProps {
  projetos: ProjetoDeLei[];
  nomePolitico: string;
}

export const ProjetosDeLeiList: React.FC<ProjetosDeLeiListProps> = ({
  projetos,
  nomePolitico,
}) => {
  const [filterTheme, setFilterTheme] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First expanded by default

  // Extract unique themes
  const uniqueThemes = Array.from(
    new Set(
      (projetos || [])
        .map((p) => p.tema)
        .filter(Boolean)
    )
  );

  const filteredProjetos = (projetos || []).filter((p) => {
    const matchesTheme =
      filterTheme === 'todos' ||
      (p.tema && p.tema.toLowerCase() === filterTheme.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      p.tipoENumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ementa.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  const getStatusBadge = (situacao: string) => {
    const s = (situacao || '').toLowerCase();
    if (s.includes('sancionad') || s.includes('transformado em lei') || s.includes('aprovad')) {
      return {
        bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle2,
      };
    }
    if (s.includes('arquivad') || s.includes('rejeitad')) {
      return {
        bg: 'bg-red-500/15 text-red-400 border-red-500/30',
        icon: AlertCircle,
      };
    }
    return {
      bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      icon: Clock,
    };
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Últimos Projetos de Lei Apresentados
            </h3>
            <p className="text-xs text-slate-400">
              Proposições legislativas (PLs, PECs, PLPs) de autoria ou coautoria de {nomePolitico}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {projetos?.length || 0} Projetos Listados
          </span>
        </div>
      </div>

      {/* Filter and Internal Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search inside bills */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por número, assunto ou palavra..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/70 text-slate-200 placeholder-slate-400 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/70"
          />
        </div>

        {/* Theme pills */}
        {uniqueThemes.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Tema:
            </span>
            <button
              onClick={() => setFilterTheme('todos')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterTheme === 'todos'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              Todos
            </button>
            {uniqueThemes.map((tema) => (
              <button
                key={tema}
                onClick={() => setFilterTheme(tema)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  filterTheme.toLowerCase() === tema.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {tema}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects List */}
      {filteredProjetos.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-2">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400 font-medium">
            Nenhum projeto encontrado para o filtro selecionado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjetos.map((proj, idx) => {
            const isExpanded = expandedIndex === idx;
            const statusConfig = getStatusBadge(proj.situacao);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
              >
                {/* Clickable Header */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        {proj.tipoENumero}
                      </span>
                      {proj.ano && (
                        <span className="text-xs text-slate-400 font-mono">
                          Ano: {proj.ano}
                        </span>
                      )}
                      {proj.tema && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          <Tag className="w-2.5 h-2.5 text-emerald-400" />
                          {proj.tema}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
                      {proj.titulo || proj.tipoENumero}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${statusConfig.bg}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{proj.situacao || 'Em tramitação'}</span>
                    </span>

                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                      title={isExpanded ? 'Recolher' : 'Expandir'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3 text-xs">
                    {/* Ementa */}
                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">
                        Ementa Oficial:
                      </span>
                      <p className="text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        {proj.ementa}
                      </p>
                    </div>

                    {/* Impact / Relevance */}
                    {proj.relevancia && (
                      <div className="flex items-start gap-2 text-slate-300 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-emerald-300">Relevância / Impacto:</strong>{' '}
                          {proj.relevancia}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-end pt-1">
                      {proj.linkOficial ? (
                        <a
                          href={proj.linkOficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold transition-colors text-xs"
                        >
                          <span>Ver Tramitação Oficial na Câmara</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            `${nomePolitico} ${proj.tipoENumero} projeto de lei camara senado`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors text-xs"
                        >
                          <span>Pesquisar Proposição no Diário Oficial</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
