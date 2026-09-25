import React, { useState, useEffect } from 'react';
import {
  Compass,
  Briefcase,
  Vote,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Scale,
  Users,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { PoliticoHeader } from './components/PoliticoHeader';
import { EspectroVisualizer } from './components/EspectroVisualizer';
import { CargoCandidaturaCard } from './components/CargoCandidaturaCard';
import { ProjetosDeLeiList } from './components/ProjetosDeLeiList';
import { InvestigacoesAcusacoesCard } from './components/InvestigacoesAcusacoesCard';
import { VotacoesPosicionamentosCard } from './components/VotacoesPosicionamentosCard';
import { PessoaNaoPoliticaCard } from './components/PessoaNaoPoliticaCard';
import { FontesVerificadasCard } from './components/FontesVerificadasCard';
import { CandidatosBrasilExplorer } from './components/CandidatosBrasilExplorer';
import { ComparadorModal } from './components/ComparadorModal';
import { BookmarksModal } from './components/BookmarksModal';
import { ConsultarVotoModal } from './components/ConsultarVotoModal';
import { PoliticoData, PessoaNaoPolitica, WebSource } from './types';

export default function App() {
  const [currentPolitico, setCurrentPolitico] = useState<PoliticoData | null>(null);
  const [pessoaNaoPolitica, setPessoaNaoPolitica] = useState<PessoaNaoPolitica | null>(null);
  const [isPolitico, setIsPolitico] = useState<boolean>(true);
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Iniciando consulta...');
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isConsultarVotoOpen, setIsConsultarVotoOpen] = useState<boolean>(false);

  // Local storage: Bookmarks & Recent searches
  const [bookmarks, setBookmarks] = useState<PoliticoData[]>(() => {
    try {
      const saved = localStorage.getItem('radar_politico_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('radar_politico_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('radar_politico_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Erro ao salvar bookmarks:', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('radar_politico_recents', JSON.stringify(recentSearches));
    } catch (e) {
      console.warn('Erro ao salvar recents:', e);
    }
  }, [recentSearches]);

  const handleSearch = async (name: string) => {
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentPolitico(null);
    setPessoaNaoPolitica(null);

    // Dynamic loading messages to inform user of multi-source verification
    const steps = [
      'Identificando atuação pública e registros oficiais...',
      'Consultando APIs oficiais dos Dados Abertos...',
      'Apurando histórico de votações em plenário...',
      'Consultando registros ético-judiciais e inquéritos...',
      'Consolidando informações do perfil...',
    ];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 1600);

    try {
      const response = await fetch('/api/politico/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name.trim() }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.error || 'Não foi possível encontrar dados para a pessoa pesquisada.'
        );
      }

      if (json.isPoliticoBrasileiro === false && json.pessoaNaoPolitica) {
        setIsPolitico(false);
        setPessoaNaoPolitica(json.pessoaNaoPolitica);
        setCurrentPolitico(null);
        setWebSources(json.fontesVerificadas || []);
      } else {
        setIsPolitico(true);
        setCurrentPolitico(json.data);
        setPessoaNaoPolitica(null);
        setWebSources(json.fontesVerificadas || []);
      }

      // Update recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== name.trim().toLowerCase());
        return [name.trim(), ...filtered].slice(0, 8);
      });

      // Scroll smoothly to top of results
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro de conexão ou consulta aos dados legislativos.');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const toggleBookmark = (politico: PoliticoData) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.nomePolitico === politico.nomePolitico);
      if (exists) {
        return prev.filter((b) => b.nomePolitico !== politico.nomePolitico);
      }
      return [politico, ...prev];
    });
  };

  const removeBookmark = (nomePolitico: string) => {
    setBookmarks((prev) => prev.filter((b) => b.nomePolitico !== nomePolitico));
  };

  const isCurrentBookmarked = currentPolitico
    ? bookmarks.some((b) => b.nomePolitico === currentPolitico.nomePolitico)
    : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenConsultarVoto={() => setIsConsultarVotoOpen(true)}
        onOpenCandidatos={() => {
          setCurrentPolitico(null);
          setPessoaNaoPolitica(null);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        bookmarksCount={bookmarks.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero & Search Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditoria Cidadã &bull; Presidente, Senadores e Deputados &bull; Dados Abertos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Raio-X Completo do seu{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Representante Político
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Consulte e audite qualquer candidato(a) do Brasil em todos os papéis eletivos: <strong>Presidente</strong>,{' '}
            <strong>Senadores da República</strong> (81 vagas nos 26 estados + DF) e{' '}
            <strong>Deputados Federais</strong> (513 cadeiras). Apuração de <strong>últimas 10 votações nominais</strong>,{' '}
            <strong>inquéritos ético-judiciais</strong>, <strong>partido e número eleitoral</strong>.
          </p>

          {/* Search Bar with live autocomplete */}
          <div className="pt-2">
            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
              recentSearches={recentSearches}
              onSelectRecent={handleSearch}
              onClearRecent={() => setRecentSearches([])}
            />
          </div>
        </section>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="max-w-md mx-auto p-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-3 shadow-xl">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Consultando Inteligência Cidadã</h4>
              <p className="text-xs text-slate-400 animate-pulse">{loadingStep}</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-2/3 animate-[pulse_1.5s_infinite]" />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto p-4 bg-red-950/40 border border-red-500/40 rounded-2xl flex items-start gap-3 text-red-300 text-sm shadow-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="font-bold text-red-200">Não foi possível carregar os dados</div>
              <div>{error}</div>
              <p className="text-xs text-red-400/80 pt-1">
                Dica: Verifique a grafia do nome ou tente pesquisar o nome civil ou parlamentar.
              </p>
            </div>
          </div>
        )}

        {/* Case 1: Searched person is NOT a Brazilian politician */}
        {!isPolitico && pessoaNaoPolitica && !isLoading && (
          <PessoaNaoPoliticaCard
            pessoa={pessoaNaoPolitica}
            onSearchPolitico={handleSearch}
          />
        )}

        {/* Case 2: Politician Dossier View */}
        {isPolitico && currentPolitico && !isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. Politician Header */}
            <PoliticoHeader
              data={currentPolitico}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={() => toggleBookmark(currentPolitico)}
            />

            {/* 2. Key Answers: Cargo que Ocupa & Situação de Candidatura Atual */}
            <CargoCandidaturaCard
              cargo={currentPolitico.cargoAtual}
              candidatura={currentPolitico.candidaturaAtual}
              partido={currentPolitico.partido}
            />

            {/* 3. Key Answer: Posicionamentos, Votações & Consulta Direta por Projeto de Lei */}
            <VotacoesPosicionamentosCard
              atividade={currentPolitico.posicionamentosEVotacoes}
              nomePolitico={currentPolitico.nomePolitico}
              cargoPolitico={currentPolitico.cargoAtual.cargo}
            />

            {/* 4. Key Answer: Acusações & Investigações Abertas ou Concluídas */}
            <InvestigacoesAcusacoesCard
              auditoria={currentPolitico.investigacoesJudiciais}
              nomePolitico={currentPolitico.nomePolitico}
            />

            {/* 5. Key Answer: Espectro Político */}
            <EspectroVisualizer
              espectro={currentPolitico.espectroPolitico}
              nomePolitico={currentPolitico.nomePolitico}
            />

            {/* 6. Key Answer: Últimos Projetos de Lei Apresentados */}
            <ProjetosDeLeiList
              projetos={currentPolitico.ultimosProjetosDeLei}
              nomePolitico={currentPolitico.nomePolitico}
            />

            {/* 7. Verified Sources & Grounding */}
            <FontesVerificadasCard
              fontes={webSources}
              dadosAbertosId={currentPolitico.dadosAbertosId}
              cargo={currentPolitico.cargoAtual.cargo}
            />

            {/* Quick Link to Explore Other Candidates or Audit Bill Votes */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Auditar Outros Candidatos ou Consultar Votações de Leis
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                  Explore todos os candidatos a Presidente da República, Senadores nos 26 estados + DF e Deputados Federais em todo o Brasil.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPolitico(null);
                    setPessoaNaoPolitica(null);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Explorar Todos os Candidatos do Brasil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsConsultarVotoOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Vote className="w-4 h-4 text-emerald-400" />
                  <span>Auditar Voto por Projeto de Lei</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Welcome Guide when no search has been made yet */}
        {!currentPolitico && !pessoaNaoPolitica && !isLoading && !error && (
          <section className="pt-2 space-y-8">
            {/* Direct Official Candidate Explorer for all Roles & States */}
            <CandidatosBrasilExplorer
              onSelectCandidato={(nome) => handleSearch(nome)}
              isLoadingTarget={isLoading}
            />

            {/* 5 Pillars Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Cargo & Mandato</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cargo atual, base territorial, exercício de mandato e situação na Justiça Eleitoral.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Vote className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Últimas 10 Votações</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Histórico nominal de votos em plenário (Sim, Não, Abstenção) em matérias relevantes.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Investigações &amp; Ética</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Apurações abertas ou arquivadas no STF, TSE, MP, PF e Conselhos de Ética.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Espectro Político</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Posicionamento ideológico fundamentado em votos e histórico de filiações.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Projetos de Lei</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Últimos PLs apresentados, ementas, áreas temáticas e tramitação oficial.
                </p>
              </div>
            </div>

            {/* Informational Guidance Banner with Direct Bill Voting Auditor */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">
                  Transparência e Auditoria Política Independente
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Digite o nome de qualquer parlamentar, governador, ministro ou prefeito no campo acima
                  para auditar sua ficha pública em tempo real. Se o nome buscado não pertencer à vida política,
                  a plataforma identificará o perfil e informará que a pessoa não exerce mandato público.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsConsultarVotoOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <Vote className="w-4 h-4 text-emerald-400" />
                  <span>Auditar Voto por Número de Projeto de Lei</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Direct Bill / Voting Auditor Modal */}
      <ConsultarVotoModal
        isOpen={isConsultarVotoOpen}
        onClose={() => setIsConsultarVotoOpen(false)}
        defaultPoliticoNome={currentPolitico?.nomePolitico || ''}
        onOpenFullDossier={(nome) => handleSearch(nome)}
      />

      {/* Comparison Modal */}
      <ComparadorModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentPolitico={currentPolitico}
        onSelectPolitico={(nome) => handleSearch(nome)}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelect={(p) => {
          setCurrentPolitico(p);
          setIsPolitico(true);
        }}
        onRemove={removeBookmark}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Radar Político Brasil</span>
            <span>&bull;</span>
            <span>Plataforma Cidadã de Acompanhamento Parlamentar e Auditoria Cidadã</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Fontes: Dados Abertos da Câmara, Senado Federal, STF &amp; TSE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
