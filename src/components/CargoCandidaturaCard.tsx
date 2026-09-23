import React from 'react';
import {
  Briefcase,
  Vote,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Flag,
  Award,
} from 'lucide-react';
import { CargoInfo, CandidaturaInfo, PartidoInfo } from '../types';
import { getPartidoBadge, getCandidaturaStatusBadge } from '../utils/politica';

interface CargoCandidaturaCardProps {
  cargo: CargoInfo;
  candidatura: CandidaturaInfo;
  partido: PartidoInfo;
}

export const CargoCandidaturaCard: React.FC<CargoCandidaturaCardProps> = ({
  cargo,
  candidatura,
  partido,
}) => {
  const partidoBadge = getPartidoBadge(partido.sigla);
  const candBadge = getCandidaturaStatusBadge(candidatura.status, candidatura.isCandidato);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. CARGO QUE OCUPA ATUALMENTE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Mandato Oficial
                </span>
                <h4 className="text-base font-bold text-slate-100">Cargo Atual Ocupado</h4>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                cargo.emExercicio
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  cargo.emExercicio ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {cargo.emExercicio ? 'Em Exercício' : 'Licenciado / Afastado'}
            </span>
          </div>

          {/* Main Cargo Title */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xl font-extrabold text-white mb-1.5">{cargo.cargo}</div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {cargo.uf && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-medium">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Estado/Base: {cargo.uf}
                </span>
              )}
              {cargo.periodoMandato && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-medium">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  Mandato: {cargo.periodoMandato}
                </span>
              )}
            </div>
            {cargo.detalhes && (
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pt-2 border-t border-slate-800/60">
                {cargo.detalhes}
              </p>
            )}
          </div>
        </div>

        {/* Partido Afiliado */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Partido de Filiação:</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${partidoBadge.bg} ${partidoBadge.text} ${partidoBadge.border}`}
            >
              {partido.sigla}
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              {partido.nome}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SITUAÇÃO ELEITORAL / CANDIDATURA ATUAL */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Cenário Eleitoral
                </span>
                <h4 className="text-base font-bold text-slate-100">Situação de Candidatura</h4>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${candBadge.bg} ${candBadge.text} ${candBadge.border}`}
            >
              {candBadge.icon === 'check' && <CheckCircle className="w-3.5 h-3.5" />}
              {candBadge.icon === 'clock' && <Clock className="w-3.5 h-3.5" />}
              {candBadge.icon === 'x' && <XCircle className="w-3.5 h-3.5" />}
              {candBadge.label}
            </span>
          </div>

          {/* Candidacy details */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Cargo Pleiteado / Disputado:</span>
              <span className="text-sm font-bold text-emerald-300">
                {candidatura.cargoDisputado || (candidatura.isCandidato ? 'A definir em convenção' : 'Nenhum no momento')}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed pt-1">
              {candidatura.detalhes ||
                'Informações apuradas nas movimentações de bastidores partidários e registros eleitorais.'}
            </div>

            {partido.federacaoOuColigacao && partido.federacaoOuColigacao !== 'Sem federação' && (
              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>
                  Federação / Coligação:{' '}
                  <strong className="text-slate-200">{partido.federacaoOuColigacao}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status resumo no rodapé */}
        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Situação TSE:
          </span>
          <span className="font-semibold text-slate-200">
            {candidatura.status || (candidatura.isCandidato ? 'Em andamento' : 'Sem registro atual')}
          </span>
        </div>
      </div>
    </div>
  );
};
