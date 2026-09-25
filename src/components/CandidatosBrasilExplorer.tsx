import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  MapPin,
  ChevronRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  Building2,
  Scale,
  Award,
} from 'lucide-react';
import { CandidatoResumo } from '../types';

interface CandidatosBrasilExplorerProps {
  onSelectCandidato: (nome: string) => void;
  isLoadingTarget?: boolean;
}

const UFS_BRASIL = [
  'Todas',
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export const CandidatosBrasilExplorer: React.FC<CandidatosBrasilExplorerProps> = ({
  onSelectCandidato,
  isLoadingTarget = false,
}) => {
  const [papel, setPapel] = useState<string>('todos');
  const [selectedUf, setSelectedUf] = useState<string>('Todas');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [candidatos, setCandidatos] = useState<CandidatoResumo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayLimit, setDisplayLimit] = useState<number>(12);

  // Fetch candidates from official backend directory
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (papel !== 'todos') params.append('papel', papel);
    if (selectedUf !== 'Todas') params.append('uf', selectedUf);
    if (searchFilter.trim()) params.append('busca', searchFilter.trim());

    fetch(`/api/eleicoes/candidatos?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && Array.isArray(data.candidatos)) {
            setCandidatos(data.candidatos);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar candidatos:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [papel, selectedUf, searchFilter]);

  // Reset pagination limit on filter changes
  useEffect(() => {
    setDisplayLimit(12);
  }, [papel, selectedUf, searchFilter]);

  const visibleCandidatos = candidatos.slice(0, displayLimit);

  const getPapelBadgeStyle = (p: string) => {
    switch (p) {
      case 'Presidente':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Senador':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'Deputado Federal':
      default:
        return 'bg-sky-500/15 text-sky-300 border-sky-500/40';
    }
  };

  const getPapelIcon = (p: string) => {
    switch (p) {
      case 'Presidente':
        return '👑';
      case 'Senador':
        return '🏛️';
      case 'Deputado Federal':
      default:
        return '👥';
    }
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guia Eleitoral Federal &bull; Brasil Completo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Candidatos e Representantes por Papel &amp; Estado
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Navegue pelos <strong>Senadores</strong> (81 vagas), <strong>Deputados Federais</strong> (513 cadeiras) e <strong>Presidente</strong> em todas as 27 UFs do Brasil.
          </p>
        </div>

        {/* Total Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isLoading ? 'Atualizando...' : `${candidatos.length} Candidatos Encontrados`}</span>
          </div>
        </div>
      </div>

      {/* Role Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPapel('todos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            papel === 'todos'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 border border-emerald-400'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Todos os Papéis</span>
        </button>

        <button
          type="button"
          onClick={() => setPapel('presidente')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            papel === 'presidente'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25 border border-amber-300'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <span>👑</span>
          <span>Presidente da República</span>
        </button>

        <button
          type="button"
          onClick={() => setPapel('senador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            papel === 'senador'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25 border border-purple-400'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <span>🏛️</span>
          <span>Senadores da República (81)</span>
        </button>

        <button
          type="button"
          onClick={() => setPapel('deputado')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            papel === 'deputado'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25 border border-sky-400'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <span>👥</span>
          <span>Deputados Federais (513)</span>
        </button>
      </div>

      {/* Filter Row: UF Selector & Live Text Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Quick Text Filter */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar por nome do candidato ou sigla do partido..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* State/UF Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-400">Estado / UF:</span>
            <select
              value={selectedUf}
              onChange={(e) => setSelectedUf(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              {UFS_BRASIL.map((uf) => (
                <option key={uf} value={uf} className="bg-slate-900 text-white">
                  {uf === 'Todas' ? 'Todas as 27 UFs' : uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick State Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin text-[11px]">
        <span className="text-slate-500 font-medium shrink-0 pr-1">UFs:</span>
        {UFS_BRASIL.slice(0, 16).map((uf) => (
          <button
            key={uf}
            type="button"
            onClick={() => setSelectedUf(uf)}
            className={`px-2 py-0.5 rounded-md font-bold transition-colors shrink-0 cursor-pointer ${
              selectedUf === uf
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {uf}
          </button>
        ))}
      </div>

      {/* Candidates Grid */}
      {isLoading ? (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Consultando candidatos e parlamentares oficiais...</p>
        </div>
      ) : candidatos.length === 0 ? (
        <div className="py-12 text-center space-y-2 border border-dashed border-slate-800 rounded-2xl p-6">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">Nenhum candidato encontrado com estes filtros</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente selecionar "Todas as UFs", limpar a busca de texto ou alternar entre Presidente, Senadores e Deputados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {visibleCandidatos.map((c) => (
              <div
                key={`${c.papel}-${c.id}`}
                className="bg-slate-950/70 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all group hover:shadow-lg hover:shadow-black/40"
              >
                {/* Top Info with Avatar & Badges */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {c.fotoUrl ? (
                      <img
                        src={c.fotoUrl}
                        alt={c.nome}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">{c.partido}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getPapelBadgeStyle(
                          c.papel
                        )}`}
                      >
                        {getPapelIcon(c.papel)} {c.papel}
                      </span>
                      {c.uf && c.uf !== 'BR' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {c.uf}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {c.nome}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{c.partido}</span>
                      {c.numeroEleitoral ? (
                        <>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-mono text-[11px]">Nº {c.numeroEleitoral}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Subtitle / Details */}
                {c.cargoAtual && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 border-t border-slate-900 pt-2">
                    {c.cargoAtual}
                  </p>
                )}

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectCandidato(c.nome)}
                  disabled={isLoadingTarget}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-800 hover:border-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Ver Dossiê Completo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination / Expand Control */}
          {candidatos.length > displayLimit && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 16)}
                className="px-6 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all shadow-md cursor-pointer"
              >
                Carregar Mais Candidatos ({candidatos.length - displayLimit} restantes)
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
