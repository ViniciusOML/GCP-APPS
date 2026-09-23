import React, { useState, useEffect } from 'react';
import {
  X,
  Vote,
  Search,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Loader2,
  Sparkles,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';
import { ConsultaVotoResponse } from '../types';

interface ConsultarVotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPoliticoNome?: string;
  onOpenFullDossier?: (nomePolitico: string) => void;
}

export const ConsultarVotoModal: React.FC<ConsultarVotoModalProps> = ({
  isOpen,
  onClose,
  defaultPoliticoNome = '',
  onOpenFullDossier,
}) => {
  const [politicoNome, setPoliticoNome] = useState(defaultPoliticoNome);
  const [materiaInput, setMateriaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<ConsultaVotoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultPoliticoNome) {
      setPoliticoNome(defaultPoliticoNome);
    }
  }, [defaultPoliticoNome, isOpen]);

  if (!isOpen) return null;

  const handleConsultar = async (materiaParam?: string) => {
    const pNome = politicoNome.trim();
    const mat = (materiaParam || materiaInput).trim();

    if (!pNome || !mat) {
      setError('Por favor, informe o nome do político e o número do projeto ou tema.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await fetch('/api/politico/consultar-voto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomePolitico: pNome,
          materia: mat,
        }),
      });

      const data: ConsultaVotoResponse = await res.json();
      if (!res.ok) {
        throw new Error((data as any).error || 'Falha ao consultar o voto.');
      }

      setResultado(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao realizar auditoria do voto.');
    } finally {
      setIsLoading(false);
    }
  };

  const getVoteBadge = (voto: string) => {
    const v = voto.toLowerCase();
    if (v === 'sim' || v.includes('favor')) {
      return {
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        text: 'Votou SIM (A Favor)',
      };
    }
    if (v === 'não' || v === 'nao' || v.includes('contra')) {
      return {
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: <XCircle className="w-5 h-5 text-rose-400" />,
        text: 'Votou NÃO (Contrário)',
      };
    }
    if (v.includes('absten')) {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: <MinusCircle className="w-5 h-5 text-amber-400" />,
        text: 'Abstenção',
      };
    }
    if (v.includes('obstru')) {
      return {
        bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        icon: <AlertCircle className="w-5 h-5 text-orange-400" />,
        text: 'Obstrução Parlamentar',
      };
    }
    if (v.includes('executivo') || v.includes('aplicável') || v.includes('aplicavel')) {
      return {
        bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        icon: <Building2 className="w-5 h-5 text-blue-400" />,
        text: 'Não aplicável (Poder Executivo)',
      };
    }
    return {
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: <AlertCircle className="w-5 h-5 text-purple-400" />,
      text: voto,
    };
  };

  const sugestoesRapidas = [
    'PL 2253/2022 (Fim das Saidinhas)',
    'Reforma Tributária (PEC 45)',
    'Programa Pé-de-Meia',
    'Marco Temporal (PL 2903)',
    'Regulamentação das Bets',
    'PEC da Escala 6x1',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Auditar Voto por Projeto de Lei</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Descubra como qualquer candidato ou parlamentar votou em uma matéria específica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConsultar();
          }}
          className="space-y-4"
        >
          {/* Politician Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Nome do Político ou Candidato:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={politicoNome}
                onChange={(e) => setPoliticoNome(e.target.value)}
                placeholder="Ex: Nikolas Ferreira, Tabata Amaral, Arthur Lira, Sergio Moro..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Bill / Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Número do Projeto de Lei ou Tema da Votação:
            </label>
            <div className="relative">
              <FileCheck2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={materiaInput}
                onChange={(e) => setMateriaInput(e.target.value)}
                placeholder="Ex: PL 2253/2022, Reforma Tributária, PEC 45, Marco Temporal, Bets, Pé-de-Meia..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Quick topics */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-400">Sugestões rápidas de temas:</div>
            <div className="flex flex-wrap gap-1.5">
              {sugestoesRapidas.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMateriaInput(sug);
                    handleConsultar(sug);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 transition-all text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Error notification */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading || !politicoNome.trim() || !materiaInput.trim()}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Consultando Anais e Painel do Congresso...</span>
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                <span>Auditar Voto do Político</span>
              </>
            )}
          </button>
        </form>

        {/* Query Result Card */}
        {resultado && (
          <div className="p-5 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    {resultado.politicoConsultado}
                  </span>
                  {resultado.dataVotacao && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {resultado.dataVotacao}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  {resultado.materiaIdentificada}
                </h4>
              </div>

              {/* Vote badge */}
              <div className="self-start sm:self-center shrink-0">
                {(() => {
                  const badge = getVoteBadge(resultado.voto);
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
            {resultado.ementa && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400">Do que trata a matéria:</div>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                  {resultado.ementa}
                </p>
              </div>
            )}

            {/* Explicacao */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400">
                Posicionamento de {resultado.politicoConsultado}:
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {resultado.explicacao}
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900 text-xs text-slate-400">
              {resultado.resultadoGeral && (
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Resultado:{' '}
                    <strong className="text-slate-200">{resultado.resultadoGeral}</strong>
                  </span>
                </div>
              )}

              {onOpenFullDossier && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullDossier(resultado.politicoConsultado);
                  }}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors ml-auto"
                >
                  <span>Ver Dossiê Completo de {resultado.politicoConsultado}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
