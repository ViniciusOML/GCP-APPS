import React, { useState } from 'react';
import {
  User,
  Share2,
  Bookmark,
  Check,
  Mail,
  GraduationCap,
  MapPin,
  Calendar,
  Building,
  Sparkles,
} from 'lucide-react';
import { PoliticoData } from '../types';
import { getPartidoBadge, getEspectroColor } from '../utils/politica';

interface PoliticoHeaderProps {
  data: PoliticoData;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const PoliticoHeader: React.FC<PoliticoHeaderProps> = ({
  data,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    nomeCompleto,
    nomePolitico,
    partido,
    espectroPolitico,
    cargoAtual,
    fotoUrl,
    cidadeNatal,
    idade,
    profissao,
    biografiaResumida,
    emailOficial,
  } = data;

  const partidoBadge = getPartidoBadge(partido.sigla);
  const espectroColors = getEspectroColor(espectroPolitico.posicao);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Consulte o perfil de ${nomePolitico} (${partido.sigla}): cargo de ${cargoAtual.cargo}, espectro ${espectroPolitico.posicao} e últimos projetos de lei no Radar Político Brasil!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Identity Row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        {/* Photo Avatar */}
        <div className="relative shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/80 shadow-xl flex items-center justify-center relative group">
            {fotoUrl && !imgError ? (
              <img
                src={fotoUrl}
                alt={nomePolitico}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 space-y-1">
                <User className="w-12 h-12 text-slate-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {partido.sigla}
                </span>
              </div>
            )}
          </div>

          {/* Party badge overlapping avatar */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md border ${partidoBadge.bg} ${partidoBadge.text} ${partidoBadge.border}`}
            >
              {partido.sigla}
            </span>
          </div>
        </div>

        {/* Text Info & Badges */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-medium text-slate-400">Perfil Parlamentar / Público</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs font-mono text-emerald-400">
                {cargoAtual.uf ? `UF: ${cargoAtual.uf}` : 'Brasil'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {nomePolitico}
            </h1>

            {nomeCompleto && nomeCompleto !== nomePolitico && (
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Nome de registro: <span className="text-slate-300">{nomeCompleto}</span>
              </p>
            )}
          </div>

          {/* Key tags row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {/* Cargo badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 text-xs font-bold shadow-sm">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              {cargoAtual.cargo}
            </span>

            {/* Espectro badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${espectroColors.bg} ${espectroColors.text} ${espectroColors.border} shadow-sm`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {espectroPolitico.posicao}
            </span>

            {/* Extra metadata chips */}
            {idade ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/60 text-slate-400 border border-slate-800 text-xs">
                <Calendar className="w-3 h-3 text-slate-500" />
                {idade} anos
              </span>
            ) : null}

            {cidadeNatal ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/60 text-slate-400 border border-slate-800 text-xs">
                <MapPin className="w-3 h-3 text-slate-500" />
                {cidadeNatal}
              </span>
            ) : null}

            {profissao ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/60 text-slate-400 border border-slate-800 text-xs">
                <GraduationCap className="w-3 h-3 text-slate-500" />
                {profissao}
              </span>
            ) : null}
          </div>

          {emailOficial && (
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Gabinete:</span>
              <a
                href={`mailto:${emailOficial}`}
                className="text-emerald-400 hover:underline font-mono"
              >
                {emailOficial}
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons: Bookmark & Share */}
        <div className="flex sm:flex-col items-center gap-2 shrink-0">
          <button
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
            title={isBookmarked ? 'Remover dos favoritos' : 'Salvar político'}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`}
            />
            <span>{isBookmarked ? 'Salvo' : 'Salvar'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-all"
            title="Copiar resumo do político"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trajetória e Biografia Resumida */}
      {biografiaResumida && (
        <div className="pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Trajetória & Síntese Biográfica:
          </h4>
          <p className="whitespace-pre-line">{biografiaResumida}</p>
        </div>
      )}
    </div>
  );
};
