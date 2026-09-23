import React from 'react';
import {
  ShieldAlert,
  UserX,
  MapPin,
  Calendar,
  Briefcase,
  FileQuestion,
  Search,
} from 'lucide-react';
import { PessoaNaoPolitica } from '../types';

interface PessoaNaoPoliticaCardProps {
  pessoa: PessoaNaoPolitica;
  onSearchPolitico?: (nome: string) => void;
}

export const PessoaNaoPoliticaCard: React.FC<PessoaNaoPoliticaCardProps> = ({
  pessoa,
  onSearchPolitico,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* 1. Prominent Warning Banner */}
      <div className="bg-amber-950/40 border-2 border-amber-500/50 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
              <UserX className="w-3.5 h-3.5" />
              Não Exerce Atividade Política no Brasil
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Esta pessoa não é um político brasileiro
            </h3>

            <p className="text-sm text-amber-200/90 leading-relaxed font-medium">
              A pesquisa realizada nas bases de dados da Câmara dos Deputados, Senado Federal e
              Tribunal Superior Eleitoral (TSE) constatou que <strong>{pessoa.nome}</strong> não
              ocupa nem disputou mandatos eletivos nem exerce atividade político-partidária oficial
              no Brasil.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Basic Person Information Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Photo */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/80 shrink-0 flex items-center justify-center shadow-lg">
            {pessoa.fotoUrl ? (
              <img
                src={pessoa.fotoUrl}
                alt={pessoa.nome}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <UserX className="w-12 h-12 text-slate-500" />
            )}
          </div>

          {/* Core metadata */}
          <div className="space-y-3 flex-1">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Perfil de Pessoa Pública / Cidadão
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">{pessoa.nome}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {pessoa.profissao && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  {pessoa.profissao}
                </span>
              )}

              {pessoa.cidadeOrigem && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {pessoa.cidadeOrigem}
                </span>
              )}

              {typeof pessoa.idade === 'number' && pessoa.idade > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {pessoa.idade} anos
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Biography & Justification */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileQuestion className="w-4 h-4 text-sky-400" />
              Biografia &amp; Atividade
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {pessoa.biografiaResumida ||
                `${pessoa.nome} é uma personalidade com notoriedade pública em sua área de atuação profissional, sem vínculos institucionais com mandatos políticos.`}
            </p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-xs text-slate-300 space-y-1">
            <strong className="text-amber-400 font-semibold">Esclarecimento de Auditoria:</strong>{' '}
            <span>{pessoa.motivoNaoPolitico}</span>
          </div>
        </div>
      </div>

      {/* Helpful Search Suggestion */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
        <h4 className="text-sm font-bold text-slate-200">
          Procurando por um representante político brasileiro?
        </h4>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Digite no campo de busca o nome de deputados federais, estaduais, senadores, governadores,
          ministros ou prefeitos para auditar cargos, votações, projetos e espectro político.
        </p>
      </div>
    </div>
  );
};
