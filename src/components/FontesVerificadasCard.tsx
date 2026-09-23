import React from 'react';
import { ShieldCheck, ExternalLink, Database, Globe } from 'lucide-react';
import { WebSource } from '../types';

interface FontesVerificadasCardProps {
  fontes: WebSource[];
  dadosAbertosId?: number;
  cargo: string;
}

export const FontesVerificadasCard: React.FC<FontesVerificadasCardProps> = ({
  fontes,
  dadosAbertosId,
  cargo,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <h4 className="text-sm font-bold text-slate-200">
            Fontes & Auditoria de Dados Públicos
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Transparência 100% Pública</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        As informações foram consolidadas através de APIs oficiais dos Poderes Legislativo e
        Executivo (Dados Abertos da Câmara dos Deputados, Portal da Transparência, TSE e
        noticiários de checagem apurados via Google Search Grounding).
      </p>

      {/* Official Portals Direct Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {dadosAbertosId && (
          <a
            href={`https://www.camara.leg.br/deputados/${dadosAbertosId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Página Oficial na Câmara (ID #{dadosAbertosId})</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        )}

        <a
          href="https://divulgacandcontas.tse.jus.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span>TSE DivulgaCandContas</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>

        {cargo.toLowerCase().includes('senad') && (
          <a
            href="https://www25.senado.leg.br/web/senadores"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Portal do Senado Federal</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        )}
      </div>

      {/* Search Grounding Web Sources */}
      {fontes && fontes.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            Fontes verificadas em tempo real:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {fontes.map((f, i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-sky-300 bg-slate-950/60 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1 transition-colors max-w-xs truncate"
                title={f.title}
              >
                <span className="truncate">{f.title || f.url}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
