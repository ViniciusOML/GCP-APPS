import React, { useState } from 'react';
import {
  X,
  GitCompare,
  ArrowRight,
  Sparkles,
  Briefcase,
  Vote,
  Compass,
  FileText,
  Loader2,
} from 'lucide-react';
import { PoliticoData } from '../types';
import { getPartidoBadge, getEspectroColor } from '../utils/politica';

interface ComparadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPolitico: PoliticoData | null;
  onSelectPolitico: (nome: string) => void;
}

export const ComparadorModal: React.FC<ComparadorModalProps> = ({
  isOpen,
  onClose,
  currentPolitico,
}) => {
  const [targetName, setTargetName] = useState('');
  const [secondPolitico, setSecondPolitico] = useState<PoliticoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchSecond = async (name: string) => {
    if (!name.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/politico/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao buscar político para comparação.');
      }
      setSecondPolitico(data.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao consultar segundo político.');
    } finally {
      setLoading(false);
    }
  };

  const renderPoliticoColumn = (p: PoliticoData | null) => {
    if (!p) {
      return (
        <div className="flex-1 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[360px]">
          <GitCompare className="w-10 h-10 text-slate-600" />
          <p className="text-sm text-slate-400">
            Digite o nome de outro político acima para comparar lado a lado.
          </p>
        </div>
      );
    }

    const pBadge = getPartidoBadge(p.partido.sigla);
    const espColors = getEspectroColor(p.espectroPolitico.posicao);

    return (
      <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        {/* Header with Photo and Party */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
            {p.fotoUrl ? (
              <img
                src={p.fotoUrl}
                alt={p.nomePolitico}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="text-xs font-bold text-slate-400">{p.partido.sigla}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-black border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}
              >
                {p.partido.sigla}
              </span>
              <span className="text-xs text-slate-400">{p.cargoAtual.uf}</span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">{p.nomePolitico}</h4>
          </div>
        </div>

        {/* 1. Espectro */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Espectro Político:
          </span>
          <div className="flex items-center justify-between">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${espColors.bg} ${espColors.text} ${espColors.border}`}
            >
              {p.espectroPolitico.posicao}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Pontuação: {p.espectroPolitico.pontuacao > 0 ? `+${p.espectroPolitico.pontuacao}` : p.espectroPolitico.pontuacao}
            </span>
          </div>
        </div>

        {/* 2. Cargo Atual */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            Cargo Atual:
          </span>
          <div className="text-sm font-bold text-slate-100">{p.cargoAtual.cargo}</div>
          <div className="text-xs text-slate-400">Mandato: {p.cargoAtual.periodoMandato}</div>
        </div>

        {/* 3. Candidatura */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Vote className="w-3.5 h-3.5 text-purple-400" />
            Situação Eleitoral:
          </span>
          <div className="text-xs font-bold text-emerald-400">
            {p.candidaturaAtual.cargoDisputado || p.candidaturaAtual.status}
          </div>
          <div className="text-[11px] text-slate-400 line-clamp-2">
            {p.candidaturaAtual.detalhes}
          </div>
        </div>

        {/* 4. Projetos de Lei */}
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Principais Projetos ({p.ultimosProjetosDeLei?.length || 0}):
          </span>
          <div className="space-y-1 text-xs text-slate-300">
            {p.ultimosProjetosDeLei?.slice(0, 3).map((proj, i) => (
              <div key={i} className="truncate bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">
                <strong className="text-emerald-400 font-mono">{proj.tipoENumero}:</strong>{' '}
                {proj.titulo}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Comparador de Políticos</h3>
              <p className="text-xs text-slate-400">
                Compare lado a lado partido, espectro, cargo e atuação legislativa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input to search second politician */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchSecond(targetName)}
            placeholder="Digite o nome do segundo político (ex: Nikolas Ferreira, Tabata Amaral...)"
            className="flex-1 px-4 py-2.5 text-sm bg-slate-950 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleFetchSecond(targetName)}
            disabled={loading || !targetName.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Comparar</span>
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-500/30 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Comparison columns */}
        <div className="flex flex-col md:flex-row gap-4 pt-2">
          {renderPoliticoColumn(currentPolitico)}
          {renderPoliticoColumn(secondPolitico)}
        </div>
      </div>
    </div>
  );
};
