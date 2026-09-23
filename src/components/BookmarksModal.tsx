import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, User } from 'lucide-react';
import { PoliticoData } from '../types';
import { getPartidoBadge, getEspectroColor } from '../utils/politica';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: PoliticoData[];
  onSelect: (politico: PoliticoData) => void;
  onRemove: (nomePolitico: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelect,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Políticos Salvos</h3>
              <p className="text-xs text-slate-400">
                Seus parlamentares e líderes políticos favoritados
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

        {bookmarks.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-2">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">Nenhum político salvo ainda.</p>
            <p className="text-xs text-slate-500">
              Ao consultar um político, clique no botão &quot;Salvar&quot; para acessá-lo facilmente a qualquer momento.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {bookmarks.map((p) => {
              const pBadge = getPartidoBadge(p.partido.sigla);
              const espColors = getEspectroColor(p.espectroPolitico.posicao);

              return (
                <div
                  key={p.nomePolitico}
                  className="flex items-center justify-between gap-3 p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all"
                >
                  <div
                    onClick={() => {
                      onSelect(p);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
                      {p.fotoUrl ? (
                        <img
                          src={p.fotoUrl}
                          alt={p.nomePolitico}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <User className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm truncate">
                          {p.nomePolitico}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-black border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}
                        >
                          {p.partido.sigla}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${espColors.bg} ${espColors.text} ${espColors.border}`}
                        >
                          {p.espectroPolitico.posicao}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{p.cargoAtual.cargo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelect(p);
                        onClose();
                      }}
                      className="p-2 text-emerald-400 hover:bg-emerald-950/40 rounded-lg border border-emerald-500/20 transition-colors"
                      title="Ver perfil completo"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(p.nomePolitico)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Remover dos salvos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
