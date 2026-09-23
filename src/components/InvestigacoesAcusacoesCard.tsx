import React from 'react';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  FileCheck2,
  XCircle,
} from 'lucide-react';
import { AuditoriaJudicialInfo, InvestigacaoItem } from '../types';

interface InvestigacoesAcusacoesCardProps {
  auditoria: AuditoriaJudicialInfo;
  nomePolitico: string;
}

export const InvestigacoesAcusacoesCard: React.FC<InvestigacoesAcusacoesCardProps> = ({
  auditoria,
  nomePolitico,
}) => {
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('andamento') || s.includes('abert') || s.includes('investiga')) {
      return {
        bg: 'bg-amber-950/40 text-amber-300 border-amber-500/40',
        icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
        label: 'Em Andamento',
      };
    }
    if (s.includes('arquiv') || s.includes('extinto')) {
      return {
        bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        label: 'Arquivado',
      };
    }
    if (s.includes('absolv') || s.includes('rejeit')) {
      return {
        bg: 'bg-sky-950/40 text-sky-300 border-sky-500/40',
        icon: <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />,
        label: 'Absolvido / Rejeitado',
      };
    }
    if (s.includes('conden') || s.includes('ineleg')) {
      return {
        bg: 'bg-red-950/40 text-red-300 border-red-500/40',
        icon: <XCircle className="w-3.5 h-3.5 text-red-400" />,
        label: 'Condenado / Inelegível',
      };
    }
    return {
      bg: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: <Info className="w-3.5 h-3.5 text-slate-400" />,
      label: status,
    };
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Auditoria Ético-Judicial &amp; Investigações</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inquéritos, denúncias e procedimentos abertos ou concluídos nos órgãos de controle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {auditoria.possuiInvestigacoesAtivas ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/50 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="w-3.5 h-3.5" />
              Apurações Ativas Registradas
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ficha Regular / Sem Condenações Ativas
            </span>
          )}
        </div>
      </div>

      {/* Constitutional Notice */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Garantia Constitucional (Art. 5º, LVII da CF/88):</strong>{' '}
          Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória.
          As informações abaixo baseiam-se em registros públicos de apuração dos tribunais e órgãos
          oficiais (STF, STJ, TSE, Conselhos de Ética parlamentares e Polícia Federal).
        </div>
      </div>

      {/* Cases List */}
      {auditoria.casos && auditoria.casos.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
            Procedimentos &amp; Registros Oficiais ({auditoria.casos.length}):
          </div>

          <div className="grid grid-cols-1 gap-4">
            {auditoria.casos.map((caso: InvestigacaoItem, idx: number) => {
              const badge = getStatusBadge(caso.status);

              return (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 space-y-3.5 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20">
                          {caso.orgaoApurador}
                        </span>
                        {caso.anoInicio && (
                          <span className="text-[11px] text-slate-400">
                            Início: {caso.anoInicio}
                          </span>
                        )}
                        {caso.anoConclusao && (
                          <span className="text-[11px] text-slate-400">
                            &bull; Desfecho: {caso.anoConclusao}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white">{caso.titulo}</h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center shrink-0 ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {caso.descricao}
                  </p>

                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-start gap-2 text-xs">
                    <strong className="text-slate-300 shrink-0">Situação Atual:</strong>
                    <span className="text-slate-400">{caso.desfechoOuSituacao}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Clean Sheet Card */
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-lg mx-auto">
            <h4 className="text-base font-bold text-emerald-300">
              Nenhuma condenação ou investigação ativa de grande repercussão
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Não constam nos registros públicos dos tribunais superiores (STF, TSE) ou conselhos
              de ética parlamentares condenações ativas de perda de mandato, inelegibilidade ou
              sanções de improbidade contra {nomePolitico}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
