import React from 'react';
import { Compass, Info, CheckCircle2, Sliders } from 'lucide-react';
import { EspectroInfo } from '../types';
import { getEspectroColor } from '../utils/politica';

interface EspectroVisualizerProps {
  espectro: EspectroInfo;
  nomePolitico: string;
}

export const EspectroVisualizer: React.FC<EspectroVisualizerProps> = ({
  espectro,
  nomePolitico,
}) => {
  const { posicao, pontuacao, descricao, principaisPautas } = espectro;
  const colors = getEspectroColor(posicao);

  // Normalize score from -100..+100 to 0%..100%
  // e.g. -100 -> 0%, 0 -> 50%, +100 -> 100%
  const clampedScore = Math.max(-100, Math.min(100, pontuacao || 0));
  const pointerPercent = ((clampedScore + 100) / 200) * 100;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div
        className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${colors.gradient} pointer-events-none`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800/90 text-emerald-400 border border-slate-700/60">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Espectro Político & Orientação Ideológica
            </h3>
            <p className="text-xs text-slate-400">
              Posicionamento baseado na atuação parlamentar, votações e doutrina partidária
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border} tracking-wide uppercase shadow-sm`}
          >
            {posicao}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            {clampedScore > 0 ? `+${clampedScore}` : clampedScore} / 100
          </span>
        </div>
      </div>

      {/* Spectrum Bar Visualizer */}
      <div className="space-y-2 mb-6">
        <div className="relative pt-6 pb-2">
          {/* Pointer Badge */}
          <div
            className="absolute top-0 transition-all duration-700 transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
            style={{ left: `${pointerPercent}%` }}
          >
            <div
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold shadow-lg border ${colors.bg} ${colors.text} ${colors.border} whitespace-nowrap`}
            >
              {nomePolitico} ({posicao})
            </div>
            <div className={`w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-current ${colors.text}`} />
          </div>

          {/* Continuous Spectrum Track */}
          <div className="h-4 w-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 via-amber-500 via-emerald-500 via-sky-500 to-blue-600 p-[2px] shadow-inner relative">
            <div className="w-full h-full rounded-full bg-slate-950/40 relative">
              {/* Center benchmark tick (0) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70 transform -translate-x-1/2 z-0" />
            </div>

            {/* Pin head on bar */}
            <div
              className="absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 border-slate-950 shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
              style={{ left: `${pointerPercent}%` }}
            />
          </div>
        </div>

        {/* Labels under spectrum */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-medium text-slate-400 px-1 pt-1">
          <span className="text-red-400/90 font-semibold">Esquerda</span>
          <span className="text-rose-400/80 hidden sm:inline">Centro-Esquerda</span>
          <span className="text-emerald-400/90 font-semibold">Centro (0)</span>
          <span className="text-sky-400/80 hidden sm:inline">Centro-Direita</span>
          <span className="text-blue-400/90 font-semibold">Direita</span>
        </div>
      </div>

      {/* Description & Main Agendas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>Fundamentação da Posição Ideológica:</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            {descricao || 'Posicionamento apurado com base em votações plenárias, declarações públicas e orientação das bancadas partidárias federais.'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bandeiras & Pautas Prioritárias:</span>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-2">
            {principaisPautas && principaisPautas.length > 0 ? (
              principaisPautas.map((pauta, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{pauta}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Pautas em atualização.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
