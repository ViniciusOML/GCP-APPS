export function getEspectroColor(posicao: string): {
  bg: string;
  text: string;
  border: string;
  gradient: string;
} {
  const p = (posicao || '').toLowerCase();
  if (p.includes('extrema-esquerda') || p.includes('extrema esquerda')) {
    return {
      bg: 'bg-red-950/80',
      text: 'text-red-400',
      border: 'border-red-600/40',
      gradient: 'from-red-600 to-rose-700',
    };
  }
  if (p.includes('esquerda')) {
    return {
      bg: 'bg-rose-950/70',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      gradient: 'from-rose-500 to-red-600',
    };
  }
  if (p.includes('centro-esquerda') || p.includes('centro esquerda')) {
    return {
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      gradient: 'from-amber-500 to-rose-500',
    };
  }
  if (p.includes('centro-direita') || p.includes('centro direita')) {
    return {
      bg: 'bg-cyan-950/60',
      text: 'text-cyan-400',
      border: 'border-cyan-500/40',
      gradient: 'from-cyan-500 to-blue-600',
    };
  }
  if (p.includes('extrema-direita') || p.includes('extrema direita')) {
    return {
      bg: 'bg-indigo-950/80',
      text: 'text-indigo-300',
      border: 'border-indigo-600/50',
      gradient: 'from-indigo-600 to-blue-900',
    };
  }
  if (p.includes('direita')) {
    return {
      bg: 'bg-blue-950/70',
      text: 'text-blue-400',
      border: 'border-blue-500/40',
      gradient: 'from-blue-600 to-indigo-600',
    };
  }
  // Centro
  return {
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    gradient: 'from-emerald-500 to-teal-600',
  };
}

export function getPartidoBadge(sigla: string) {
  const s = (sigla || '').toUpperCase().trim();
  const map: Record<string, { bg: string; text: string; border: string }> = {
    PT: { bg: 'bg-red-900/60', text: 'text-red-300', border: 'border-red-500/30' },
    PL: { bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-500/30' },
    PSOL: { bg: 'bg-amber-900/60', text: 'text-amber-300', border: 'border-amber-500/30' },
    UNIÃO: { bg: 'bg-indigo-900/60', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    UNIAO: { bg: 'bg-indigo-900/60', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    PSD: { bg: 'bg-sky-900/60', text: 'text-sky-300', border: 'border-sky-500/30' },
    MDB: { bg: 'bg-emerald-900/60', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    PSB: { bg: 'bg-rose-900/60', text: 'text-rose-300', border: 'border-rose-500/30' },
    PDT: { bg: 'bg-red-950/80', text: 'text-rose-300', border: 'border-rose-600/30' },
    REPUBLICANOS: { bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-500/30' },
    PSDB: { bg: 'bg-blue-950/70', text: 'text-blue-300', border: 'border-blue-500/30' },
    PP: { bg: 'bg-sky-950/70', text: 'text-sky-300', border: 'border-sky-500/30' },
    NOVO: { bg: 'bg-orange-900/60', text: 'text-orange-300', border: 'border-orange-500/30' },
    PODE: { bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-500/30' },
    PODEMOS: { bg: 'bg-blue-900/60', text: 'text-blue-300', border: 'border-blue-500/30' },
    REDE: { bg: 'bg-teal-900/60', text: 'text-teal-300', border: 'border-teal-500/30' },
    PCDOB: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-600/30' },
    SOLIDARIEDADE: { bg: 'bg-orange-950/70', text: 'text-orange-300', border: 'border-orange-500/30' },
    AVANTE: { bg: 'bg-sky-900/60', text: 'text-sky-300', border: 'border-sky-500/30' },
    CIDADANIA: { bg: 'bg-purple-900/60', text: 'text-purple-300', border: 'border-purple-500/30' },
    PRD: { bg: 'bg-emerald-900/60', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  };

  return (
    map[s] || {
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
    }
  );
}

export function getCandidaturaStatusBadge(status: string, isCandidato: boolean) {
  const s = (status || '').toLowerCase();
  if (isCandidato || s.includes('confirmad') || s.includes('oficial')) {
    return {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      label: 'Candidatura Confirmada',
      icon: 'check',
    };
  }
  if (s.includes('pré-candidat') || s.includes('pre-candidat') || s.includes('reeleição') || s.includes('pretendid')) {
    return {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      label: 'Pré-candidato / Movimentação',
      icon: 'clock',
    };
  }
  if (s.includes('ineleg')) {
    return {
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      border: 'border-red-500/30',
      label: 'Inelegível / Impedimento',
      icon: 'x',
    };
  }
  return {
    bg: 'bg-slate-800/80',
    text: 'text-slate-400',
    border: 'border-slate-700',
    label: 'Sem Candidatura Declarada',
    icon: 'minus',
  };
}
