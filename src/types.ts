export interface ProjetoDeLei {
  tipoENumero: string;
  ano: number;
  titulo: string;
  ementa: string;
  tema: string;
  situacao: string;
  relevancia?: string;
  linkOficial?: string;
}

export interface PartidoInfo {
  sigla: string;
  nome: string;
  numeroEleitoral?: number;
  federacaoOuColigacao?: string;
  historicoPartidario?: string;
}

export interface EspectroInfo {
  posicao:
    | 'Extrema-Esquerda'
    | 'Esquerda'
    | 'Centro-Esquerda'
    | 'Centro'
    | 'Centro-Direita'
    | 'Direita'
    | 'Extrema-Direita'
    | string;
  pontuacao: number; // -100 to +100
  descricao: string;
  principaisPautas: string[];
}

export interface CargoInfo {
  cargo: string;
  uf: string;
  emExercicio: boolean;
  periodoMandato: string;
  detalhes?: string;
}

export interface CandidaturaInfo {
  isCandidato: boolean;
  status: string;
  cargoDisputado: string;
  detalhes: string;
}

export interface InvestigacaoItem {
  titulo: string;
  orgaoApurador: string; // Ex: STF, TSE, Conselho de Ética, Polícia Federal, Ministério Público
  status: 'Em Andamento' | 'Arquivado' | 'Absolvido' | 'Condenado' | 'Suspenso' | string;
  anoInicio?: number;
  anoConclusao?: number;
  descricao: string;
  desfechoOuSituacao: string;
  linkReferencia?: string;
}

export interface AuditoriaJudicialInfo {
  resumoGeral: string;
  possuiInvestigacoesAtivas: boolean;
  casos: InvestigacaoItem[];
  observacaoConstitucional?: string;
}

export interface VotacaoItem {
  id?: string;
  data: string; // Ex: "03/09/2026"
  proposicao: string; // Ex: "PLP 251/2026"
  tema: string; // Ex: "Economia & Tributos"
  ementa: string;
  voto: 'Sim' | 'Não' | 'Abstenção' | 'Obstrução' | 'Artigo 17' | string;
  resultadoGeral: string; // Ex: "Aprovado no Plenário"
  impacto?: string;
  linkOficial?: string;
}

export interface AtividadeLegislativaVotacoes {
  ativoEmCasaLegislativa: boolean;
  casaLegislativa?: string; // Ex: "Câmara dos Deputados", "Senado Federal"
  justificativaNaoAtivo?: string; // Caso ocupe cargo no Executivo (Governador, Prefeito, Ministro)
  ultimasVotacoes: VotacaoItem[];
}

export interface PoliticoData {
  nomeCompleto: string;
  nomePolitico: string;
  partido: PartidoInfo;
  espectroPolitico: EspectroInfo;
  cargoAtual: CargoInfo;
  candidaturaAtual: CandidaturaInfo;
  ultimosProjetosDeLei: ProjetoDeLei[];
  biografiaResumida: string;
  fotoUrl: string | null;
  cidadeNatal?: string;
  idade?: number;
  profissao?: string;
  fontesOficiais?: Array<{ nome: string; descricao: string }>;
  dadosAbertosId?: number;
  emailOficial?: string | null;
  investigacoesJudiciais: AuditoriaJudicialInfo;
  posicionamentosEVotacoes: AtividadeLegislativaVotacoes;
}

export interface PessoaNaoPolitica {
  nome: string;
  fotoUrl?: string | null;
  idade?: number;
  cidadeOrigem?: string;
  profissao?: string;
  biografiaResumida: string;
  motivoNaoPolitico: string;
}

export interface WebSource {
  title: string;
  url: string;
}

export interface SearchResult {
  success: boolean;
  isPoliticoBrasileiro: boolean;
  data?: PoliticoData;
  pessoaNaoPolitica?: PessoaNaoPolitica;
  fontesVerificadas?: WebSource[];
  error?: string;
}

export interface ConsultaVotoResponse {
  success: boolean;
  votoEncontrado: boolean;
  politicoConsultado: string;
  materiaIdentificada: string;
  dataVotacao?: string;
  voto: string; // "SIM", "NÃO", "ABSTENÇÃO", "OBSTRUÇÃO", "AUSENTE", "NÃO PARTICIPOU", "NÃO APLICÁVEL (PODER EXECUTIVO)"
  ementa?: string;
  explicacao: string;
  resultadoGeral?: string;
  linkOficial?: string;
  fonte?: string;
}
