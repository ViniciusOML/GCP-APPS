import React, { useState } from 'react';
import {
  Vote,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertCircle,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  Search,
  Loader2,
  Sparkles,
  RotateCcw,
  Check,
  FileCheck2,
} from 'lucide-react';
import { AtividadeLegislativaVotacoes, VotacaoItem, ConsultaVotoResponse } from '../types';

interface VotacoesPosicionamentosCardProps {
  atividade: AtividadeLegislativaVotacoes;
  nomePolitico: string;
  cargoPolitico?: string;
}

export const VotacoesPosicionamentosCard: React.FC<VotacoesPosicionamentosCardProps> = ({
  atividade,
  nomePolitico,
  cargoPolitico,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingVote, setIsSearchingVote] = useState(false);
  const [searchedVoteResult, setSearchedVoteResult] = useState<ConsultaVotoResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const getVoteBadge = (voto: string) => {
    const v = voto.toLowerCase();
    if (v === 'sim' || v.includes('favor')) {
      return {
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        badgeColor: 'bg-emerald-500 text-slate-950',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        text: 'Votou SIM (A Favor)',
      };
    }
    if (v === 'não' || v === 'nao' || v.includes('contra')) {
      return {
        bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        badgeColor: 'bg-rose-500 text-white',
        icon: <XCircle className="w-4 h-4 text-rose-400" />,
        text: 'Votou NÃO (Contrário)',
      };
    }
    if (v.includes('absten')) {
      return {
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        badgeColor: 'bg-amber-500 text-slate-950',
        icon: <MinusCircle className="w-4 h-4 text-amber-400" />,
        text: 'Abstenção',
      };
    }
    if (v.includes('obstru')) {
      return {
        bg: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
        badgeColor: 'bg-orange-500 text-white',
        icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
        text: 'Obstrução Parlamentar',
      };
    }
    if (v.includes('executivo') || v.includes('aplicável') || v.includes('aplicavel')) {
      return {
        bg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
        badgeColor: 'bg-blue-500 text-white',
        icon: <Building2 className="w-4 h-4 text-blue-400" />,
        text: 'Não aplicável (Poder Executivo)',
      };
    }
    return {
      bg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      badgeColor: 'bg-purple-500 text-white',
      icon: <AlertCircle className="w-4 h-4 text-purple-400" />,
      text: voto,
    };
  };

  const handleQueryVote = async (materiaQuery?: string) => {
    const query = (materiaQuery || searchTerm).trim();
    if (!query) return;

    setIsSearchingVote(true);
    setSearchError(null);
    setSearchedVoteResult(null);

    try {
      const res = await fetch('/api/politico/consultar-voto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomePolitico,
          cargo: cargoPolitico,
          materia: query,
        }),
      });

      const data: ConsultaVotoResponse = await res.json();
      if (!res.ok) {
        throw new Error((data as any).error || 'Erro ao consultar o voto na matéria.');
      }

      setSearchedVoteResult(data);
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || 'Falha de comunicação com o servidor legislativo.');
    } finally {
      setIsSearchingVote(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchedVoteResult(null);
    setSearchError(null);
  };

  // Popular vote queries to test with 1-click
  const sugestoesProjetos = [
    'PL 2253/2022 (Fim das Saidinhas)',
    'Reforma Tributária',
    'Programa Pé-de-Meia (PL 54/2021)',
    'Marco Temporal (PL 2903)',
    'Arcabouço Fiscal (PLP 93/2023)',
    'Regulamentação das Bets',
    'PEC da Escala 6x1',
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Posicionamentos &amp; Votações em Plenário</span>
              {atividade.ativoEmCasaLegislativa && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  10 Votações Nominais Auditadas
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Histórico nominal de votos no plenário e consulta direta de votos por número de projeto de lei
            </p>
          </div>
        </div>

        {atividade.ativoEmCasaLegislativa && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 self-start sm:self-auto">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{atividade.casaLegislativa || 'Congresso Nacional'}</span>
          </div>
        )}
      </div>

      {/* FEATURE: Direct Bill / Vote Query Input */}
      <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Consultar como {nomePolitico} votou em um Projeto de Lei ou Matéria:</span>
          </label>
          <span className="text-[11px] text-emerald-400/90 font-medium">
            Busca oficial por número do PL, PEC ou tema
          </span>
        </div>

        {/* Input & Action Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQueryVote();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o número (ex: PL 2253/2022, PLP 68, PEC 45) ou tema (ex: Saidinhas, Tributária, Pé-de-Meia)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSearchingVote || !searchTerm.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-md"
            >
              {isSearchingVote ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditando Voto...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Verificar Voto</span>
                </>
              )}
            </button>

            {(searchedVoteResult || searchTerm) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
                title="Limpar consulta"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
          </div>
        </form>

        {/* Quick query chips */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-slate-400">
            Exemplos de matérias e leis com votação expressiva:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sugestoesProjetos.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSearchTerm(sug);
                  handleQueryVote(sug);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-300 hover:text-emerald-300 transition-all text-left flex items-center gap-1"
              >
                <span>{sug}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {searchError && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Result of the Specific Bill Query */}
        {searchedVoteResult && (
          <div className="mt-4 p-5 bg-slate-900/90 border border-emerald-500/40 rounded-2xl space-y-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Resultado da Consulta
                  </span>
                  {searchedVoteResult.dataVotacao && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {searchedVoteResult.dataVotacao}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white">
                  {searchedVoteResult.materiaIdentificada}
                </h4>
              </div>

              {/* Huge Vote Stamp Badge */}
              <div className="self-start sm:self-center shrink-0">
                {(() => {
                  const badge = getVoteBadge(searchedVoteResult.voto);
                  return (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border tracking-wide uppercase shadow-lg ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{badge.text}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Ementa */}
            {searchedVoteResult.ementa && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400">Do que se trata a matéria:</div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  {searchedVoteResult.ementa}
                </p>
              </div>
            )}

            {/* Context & Explanation */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400">
                Posicionamento e Justificativa de {nomePolitico}:
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {searchedVoteResult.explicacao}
              </p>
            </div>

            {/* Plenary result and Source */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              {searchedVoteResult.resultadoGeral && (
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Resultado da Votação:{' '}
                    <strong className="text-slate-200">{searchedVoteResult.resultadoGeral}</strong>
                  </span>
                </div>
              )}

              {searchedVoteResult.fonte && (
                <div className="text-[11px] text-slate-400">
                  Fonte: <em>{searchedVoteResult.fonte}</em>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Case 1: Politician is active in a legislative house - 10 recent votes */}
      {atividade.ativoEmCasaLegislativa &&
      atividade.ultimasVotacoes &&
      atividade.ultimasVotacoes.length > 0 ? (
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
            <span>Últimas 10 Matérias Deliberadas em Plenário</span>
            <span className="text-slate-400 lowercase font-normal">
              registros da 57ª legislatura
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {atividade.ultimasVotacoes.slice(0, 10).map((v: VotacaoItem, idx: number) => {
              const voteBadge = getVoteBadge(v.voto);

              return (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                          {v.proposicao}
                        </span>
                        <span className="text-xs text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                          {v.tema}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {v.data}
                        </span>
                      </div>
                    </div>

                    {/* Voto Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border self-start sm:self-center shrink-0 ${voteBadge.bg}`}
                    >
                      {voteBadge.icon}
                      <span>{voteBadge.text}</span>
                    </div>
                  </div>

                  {/* Ementa */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{v.ementa}</p>

                  {/* Impact / Stance note if present */}
                  {v.impacto && (
                    <div className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/70">
                      <span className="text-slate-300 font-semibold">Posicionamento: </span>
                      {v.impacto}
                    </div>
                  )}

                  {/* Footer with Plenary Result */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Resultado Geral na Casa:{' '}
                        <strong className="text-slate-200">{v.resultadoGeral}</strong>
                      </span>
                    </div>

                    {v.linkOficial && (
                      <a
                        href={v.linkOficial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
                      >
                        <span>Ficha da Votação</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Case 2: Politician is NOT active in a legislative house (e.g. Executive Governor, Mayor, Minister) */
        <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h4 className="text-sm font-bold text-white">
              Votações Legislativas Não Aplicáveis a Cargos do Poder Executivo
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {atividade.justificativaNaoAtivo ||
                `${nomePolitico} exerce cargo no Poder Executivo (como Governador, Prefeito ou Ministro) e, pela Constituição Federal, não possui voto nas deliberações parlamentares em plenário.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
