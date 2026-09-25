import React from 'react';
import { Landmark, GitCompare, Bookmark, ExternalLink, ShieldCheck, Vote, Users } from 'lucide-react';

interface NavbarProps {
  onOpenCompare: () => void;
  onOpenBookmarks: () => void;
  onOpenConsultarVoto?: () => void;
  onOpenCandidatos?: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCompare,
  onOpenBookmarks,
  onOpenConsultarVoto,
  onOpenCandidatos,
  bookmarksCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onOpenCandidatos}
          className="flex items-center gap-3 cursor-pointer group"
          title="Início / Explorador de Candidatos"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-600 p-[1px] shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </div>
            {/* Small Brazilian accent dots */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                Radar Político
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wide uppercase">
                Brasil
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Transparência Cidadã &bull; Espectro &bull; Mandato &bull; Projetos de Lei
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenCandidatos && (
            <button
              onClick={onOpenCandidatos}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400 rounded-lg transition-all cursor-pointer"
              title="Explorador de Candidatos: Senadores, Deputados Federais e Presidente"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Candidatos do Brasil</span>
            </button>
          )}

          {onOpenConsultarVoto && (
            <button
              onClick={onOpenConsultarVoto}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 rounded-lg transition-all"
              title="Auditar voto de um candidato em um projeto específico"
            >
              <Vote className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consultar Voto</span>
            </button>
          )}

          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-all"
            title="Políticos Salvos"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Salvos</span>
            {bookmarksCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {bookmarksCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg transition-all"
            title="Comparar dois políticos"
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Comparar</span>
          </button>

          <a
            href="https://dadosabertos.camara.leg.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors"
            title="Dados Abertos Oficiais"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Fontes Oficiais</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
};
