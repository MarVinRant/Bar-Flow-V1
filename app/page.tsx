"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAdminSnapshot, requestPasswordReset, signInWithGoogle, signInWithPassword, type AdminSnapshot } from "../src/lib/supabase";
import { archivePrivateItem, createBillingCheckout, createOnboarding, fetchPrivateItems, getCurrentEstablishment, getOrCreateMenu, publishMenu, saveEstablishment, savePrivateItem, type BarFlowEstablishment, type BarFlowItem } from "../src/lib/barflow";

type Section = "visao" | "biblioteca" | "acervo" | "cardapio" | "favoritos" | "plano" | "configuracoes";
type AppMode = "app" | "login" | "onboarding" | "admin";

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "visao", label: "Visão geral", icon: "⌂" },
  { id: "biblioteca", label: "Biblioteca", icon: "▱" },
  { id: "acervo", label: "Meu Acervo", icon: "◫" },
  { id: "cardapio", label: "Meu Cardápio", icon: "☷" },
  { id: "favoritos", label: "Favoritos", icon: "☆" },
  { id: "plano", label: "Plano e cobrança", icon: "◈" },
  { id: "configuracoes", label: "Configurações", icon: "⚙" },
];

const recipes = [
  { name: "Gin Tônica da Casa", category: "Clássicos", time: "5 min", type: "Receita", tone: "blue" },
  { name: "Negroni", category: "Clássicos", time: "4 min", type: "Receita", tone: "wine" },
  { name: "Xarope de hibisco", category: "Preparos", time: "25 min", type: "Preparo", tone: "gold" },
  { name: "Moscow Mule", category: "Contemporâneos", time: "7 min", type: "Receita", tone: "green" },
];

const products = [
  { name: "Gin Tanqueray London Dry", category: "Destilados", time: "750 ml", type: "Produto", tone: "dark" },
  { name: "Água tônica artesanal", category: "Sem álcool", time: "350 ml", type: "Produto", tone: "teal" },
  { name: "Vermute Rosso", category: "Licores", time: "900 ml", type: "Produto", tone: "wine" },
];

export default function Home() {
  const [section, setSection] = useState<Section>("visao");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [published, setPublished] = useState(false);
  const [mode, setMode] = useState<AppMode>("app");
  const [establishment, setEstablishment] = useState<BarFlowEstablishment | null>(null);
  const [realItems, setRealItems] = useState<BarFlowItem[]>([]);

  useEffect(() => {
    getCurrentEstablishment().then(async ({ data }) => {
      if (!data) return;
      setEstablishment(data);
      const result = await fetchPrivateItems(data.id);
      if (result.data) setRealItems(result.data);
    });
  }, []);

  const allItems = useMemo(() => [...recipes, ...products], []);
  const results = useMemo(
    () => allItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [allItems, search],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  if (mode === "login") return <AuthScreen onLogin={() => setMode("onboarding")} onBack={() => setMode("app")} />;
  if (mode === "onboarding") return <OnboardingScreen onComplete={async (input) => { const result = await createOnboarding(input); if (result.error || !result.data) return notify(result.error?.message ?? "Não foi possível criar o estabelecimento."); setEstablishment(result.data); setMode("app"); notify("Estabelecimento criado com sucesso."); }} />;
  if (mode === "admin") return <RealAdminPanel onBack={() => setMode("app")} onAction={notify} />;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">B</div>
          <div><strong>bar flow</strong><span>operação de bebidas</span></div>
        </div>
        <div className="workspace-switcher">
          <div className="avatar">C</div>
          <div><small>Estabelecimento</small><strong>Casa Caju</strong></div>
          <button aria-label="Alternar estabelecimento">⌄</button>
        </div>
        <nav className="side-nav" aria-label="Navegação principal">
          <span className="nav-caption">MENU PRINCIPAL</span>
          {navItems.map((item) => (
            <button key={item.id} className={section === item.id ? "nav-item active" : "nav-item"} onClick={() => { setSection(item.id); setMenuOpen(false); }}>
              <i>{item.icon}</i><span>{item.label}</span>{item.id === "biblioteca" && <em>12</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="trial-card"><div className="trial-top"><span>Plano Silver</span><span>5 dias</span></div><div className="progress"><span /></div><small>Seu teste termina em 5 dias</small><button onClick={() => notify("A área de planos estará disponível em breve.")}>Ver planos <b>→</b></button></div>
          <button className="help-link" onClick={() => notify("Central de ajuda em breve.")}><i>?</i> Central de ajuda</button>
          <div className="user-row"><div className="avatar avatar-small">MR</div><div><strong>Marcos R.</strong><small>Proprietário</small></div><button aria-label="Mais opções">•••</button></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">☰</button>
          <div className="breadcrumb"><span>Casa Caju</span><b>/</b><strong>{navItems.find((item) => item.id === section)?.label}</strong></div>
          <div className="top-actions">
            <div className="global-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no Bar Flow..." /><kbd>⌘ K</kbd></div>
            <button className="icon-button" aria-label="Notificações" onClick={() => notify("Você não tem novas notificações.")}>♧<i className="notification-dot" /></button>
            <button className="profile-chip" onClick={() => setMode("login")}><span className="avatar avatar-small">MR</span><span>Marcos</span><span>⌄</span></button>
          </div>
        </header>

        {search && <div className="search-results"><div><strong>Resultados para “{search}”</strong><button onClick={() => setSearch("")}>Fechar</button></div>{results.length ? results.map((item) => <button key={item.name} onClick={() => { setSearch(""); setSection(item.type === "Produto" ? "acervo" : "biblioteca"); }}><span className={`result-dot ${item.tone}`} /><span><strong>{item.name}</strong><small>{item.type} · {item.category}</small></span><b>→</b></button>) : <p>Nenhum resultado encontrado. Tente outro termo.</p>}</div>}

        <div className="content">
          {section === "visao" && <Dashboard onAction={notify} published={published} />}
          {section === "biblioteca" && <Library onAction={notify} />}
          {section === "acervo" && <RealCollection establishment={establishment} realItems={realItems} onItemsChange={setRealItems} onAction={notify} />}
          {section === "cardapio" && <RealMenuPage establishment={establishment} published={published} onPublished={() => { setPublished(true); notify("Cardápio publicado com sucesso."); }} onAction={notify} />}
          {section === "favoritos" && <EmptyState title="Seus favoritos" copy="Salve receitas, produtos e páginas importantes para encontrar tudo mais rápido." action="Explorar Biblioteca" onAction={() => setSection("biblioteca")} />}
          {section === "plano" && <RealBillingPage onAction={notify} />}
          {section === "configuracoes" && <RealSettings establishment={establishment} onEstablishmentChange={setEstablishment} onAction={notify} onAdmin={() => setMode("admin")} />}
        </div>
      </section>
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}

function Dashboard({ onAction, published }: { onAction: (message: string) => void; published: boolean }) {
  return <div className="dashboard">
    <div className="page-heading"><div><p className="eyebrow">TERÇA-FEIRA, 04 DE AGOSTO DE 2026</p><h1>Bom dia, Marcos <span>✦</span></h1><p className="lead">Tudo pronto para deixar a operação da Casa Caju mais fluida.</p></div><button className="primary-button" onClick={() => onAction("Escolha o tipo de item que deseja criar.")}>＋ Novo item <span>⌄</span></button></div>
    <div className="hero-banner"><div className="hero-copy"><span className="pill pill-gold">NOVIDADE NA BIBLIOTECA</span><h2>12 novas receitas para<br /><em>inspirar seu próximo menu.</em></h2><p>Descubra combinações selecionadas para a temporada e adicione ao seu acervo.</p><button className="text-button" onClick={() => onAction("Abrindo as novidades da Biblioteca Mestre.")}>Explorar novidades <span>→</span></button></div><div className="hero-orb"><div className="glass glass-one">✧</div><div className="glass glass-two">◌</div><div className="leaf">◢</div></div></div>
    <div className="section-title"><div><h2>Visão da operação</h2><p>Um resumo do que está acontecendo no seu estabelecimento.</p></div><button className="ghost-button" onClick={() => onAction("Período alterado para este mês.")}>Este mês <span>⌄</span></button></div>
    <div className="metric-grid"><Metric label="Receitas no acervo" value="28" change="+4 este mês" icon="◒" tone="blue" /><Metric label="Produtos cadastrados" value="74" change="+8 este mês" icon="▣" tone="gold" /><Metric label="Itens publicados" value={published ? "12" : "0"} change={published ? "Cardápio ativo" : "Pronto para publicar"} icon="◉" tone="green" /><Metric label="Uso do plano" value="38%" change="74 de 200 itens" icon="◌" tone="purple" /></div>
    <div className="lower-grid"><div className="panel"><div className="panel-heading"><div><h3>Atividade recente</h3><p>As últimas movimentações no seu acervo.</p></div><button className="icon-link" onClick={() => onAction("Histórico completo em breve.")}>Ver tudo →</button></div><Activity icon="◒" title="Gin Tônica da Casa" desc="Receita criada por você" time="Hoje, 09:42" tone="blue" /><Activity icon="▣" title="Gin Tanqueray London Dry" desc="Adicionado ao acervo" time="Ontem, 17:18" tone="gold" /><Activity icon="☷" title="Menu de Inverno" desc="Cardápio atualizado" time="Ontem, 14:05" tone="green" /></div><div className="panel quick-panel"><div className="panel-heading"><div><h3>Ações rápidas</h3><p>Comece por onde precisar.</p></div></div><QuickAction icon="＋" label="Criar receita" onClick={() => onAction("Abrindo o formulário de nova receita.")} /><QuickAction icon="▣" label="Adicionar produto" onClick={() => onAction("Abrindo o formulário de novo produto.")} /><QuickAction icon="▱" label="Explorar Biblioteca" onClick={() => onAction("Use o menu Biblioteca para explorar.")} /><QuickAction icon="☷" label="Publicar cardápio" onClick={() => onAction("Use o menu Meu Cardápio para publicar.")} /></div></div>
  </div>;
}

function Library({ onAction }: { onAction: (message: string) => void }) {
  const [tab, setTab] = useState("Tudo");
  const items = tab === "Tudo" ? [...recipes, ...products] : [...recipes, ...products].filter((item) => item.type === tab.slice(0, -1) || item.category === tab);
  return <div><div className="page-heading"><div><p className="eyebrow">BIBLIOTECA MESTRE</p><h1>Encontre seu próximo <em>favorito.</em></h1><p className="lead">Conteúdo curado pelo Bar Flow para você começar com uma base melhor.</p></div><button className="outline-button" onClick={() => onAction("Sugira uma receita ou produto para nossa curadoria.")}>＋ Sugerir item</button></div><div className="library-toolbar"><div className="tabs">{["Tudo", "Receitas", "Produtos", "Preparos"].map((name) => <button key={name} onClick={() => setTab(name)} className={tab === name ? "tab active" : "tab"}>{name}<span>{name === "Tudo" ? "7" : name === "Receitas" ? "4" : name === "Produtos" ? "3" : "1"}</span></button>)}</div><button className="filter-button">☷ Filtros</button></div><div className="library-grid">{items.map((item) => <LibraryCard key={item.name} item={item} onAction={onAction} />)}</div></div>;
}

function RealCollection({ establishment, realItems, onItemsChange, onAction }: { establishment: BarFlowEstablishment | null; realItems: BarFlowItem[]; onItemsChange: (items: BarFlowItem[]) => void; onAction: (message: string) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Receitas");
  const [type, setType] = useState<BarFlowItem["item_type"]>("recipe");
  const [busy, setBusy] = useState(false);
  async function addItem() {
    if (!establishment || !name.trim()) return onAction("Informe o nome do item antes de salvar.");
    setBusy(true);
    const result = await savePrivateItem({ establishment_id: establishment.id, item_type: type, name: name.trim(), category });
    setBusy(false);
    if (result.error || !result.data) return onAction(result.error?.message ?? "Não foi possível salvar o item.");
    onItemsChange([result.data as BarFlowItem, ...realItems]);
    setName("");
    onAction("Item salvo no seu acervo.");
  }
  async function archive(id: string) {
    const result = await archivePrivateItem(id);
    if (result.error) return onAction(result.error.message);
    onItemsChange(realItems.filter((item) => item.id !== id));
    onAction("Item movido para a lixeira.");
  }
  return <div><div className="page-heading"><div><p className="eyebrow">MEU ACERVO</p><h1>O que está no seu <em>bar.</em></h1><p className="lead">Itens privados salvos no Supabase do seu estabelecimento.</p></div></div><div className="panel" style={{ padding: 20, marginBottom: 18 }}><div className="panel-heading"><div><h3>Novo item</h3><p>Cadastre uma receita, produto ou preparo.</p></div></div><div className="form-row"><label>Nome<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Gin Tônica da Casa" /></label><label>Categoria<input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Ex.: Clássicos" /></label><label>Tipo<select value={type} onChange={(event) => setType(event.target.value as BarFlowItem["item_type"])}><option value="recipe">Receita</option><option value="product">Produto</option><option value="preparation">Preparo</option></select></label></div><button className="primary-button" disabled={busy} onClick={addItem}>{busy ? "Salvando..." : "Salvar item"}</button></div><div className="collection-summary"><div><span className="summary-icon blue">◒</span><div><strong>{realItems.filter((item) => item.item_type !== "product").length}</strong><small>Receitas e preparos</small></div></div><div><span className="summary-icon gold">▣</span><div><strong>{realItems.filter((item) => item.item_type === "product").length}</strong><small>Produtos cadastrados</small></div></div><div><span className="summary-icon green">☷</span><div><strong>{realItems.length}</strong><small>Itens privados</small></div></div></div><div className="panel collection-panel"><div className="panel-heading"><div><h3>Itens salvos</h3><p>Registros reais do seu estabelecimento.</p></div></div>{realItems.length ? realItems.map((item) => <div className="activity" key={item.id}><span className="activity-icon blue">{item.item_type === "product" ? "▣" : "◒"}</span><div><strong>{item.name}</strong><small>{item.item_type} · {item.category}</small></div><button className="icon-link" onClick={() => archive(item.id)}>Arquivar</button></div>) : <div className="empty-state"><span>☆</span><h2>Seu acervo começa aqui</h2><p>Cadastre o primeiro item usando o formulário acima.</p></div>}</div></div>;
}

function Collection({ onAction }: { onAction: (message: string) => void }) {
  return <div><div className="page-heading"><div><p className="eyebrow">MEU ACERVO</p><h1>O que está no seu <em>bar.</em></h1><p className="lead">Sua biblioteca privada, feita para a rotina da Casa Caju.</p></div><button className="primary-button" onClick={() => onAction("Escolha entre criar uma receita ou adicionar um produto.")}>＋ Novo item <span>⌄</span></button></div><div className="collection-summary"><div><span className="summary-icon blue">◒</span><div><strong>28</strong><small>Receitas e preparos</small></div></div><div><span className="summary-icon gold">▣</span><div><strong>74</strong><small>Produtos cadastrados</small></div></div><div><span className="summary-icon green">☷</span><div><strong>12</strong><small>Itens no cardápio</small></div></div></div><div className="panel collection-panel"><div className="panel-heading"><div><h3>Itens adicionados recentemente</h3><p>Você pode editar ou adicionar qualquer item ao cardápio.</p></div><button className="icon-link" onClick={() => onAction("Filtros do acervo em breve.")}>Filtrar →</button></div>{[...recipes.slice(0, 3), ...products.slice(0, 1)].map((item) => <Activity key={item.name} icon={item.type === "Produto" ? "▣" : "◒"} title={item.name} desc={item.type + " · " + item.category} time="Editar item  →" tone={item.tone} />)}</div></div>;
}

function RealMenuPage({ establishment, published, onPublished, onAction }: { establishment: BarFlowEstablishment | null; published: boolean; onPublished: () => void; onAction: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function publish() {
    if (!establishment) return onAction("O estabelecimento ainda não está vinculado a uma sessão real.");
    setBusy(true);
    const menu = await getOrCreateMenu(establishment.id);
    if (menu.error || !menu.data) { setBusy(false); return onAction(menu.error?.message ?? "Não foi possível preparar o cardápio."); }
    const result = await publishMenu(menu.data.id);
    setBusy(false);
    if (result.error) return onAction(result.error.message);
    onPublished();
  }
  const url = establishment ? `${window.location.origin}/${establishment.slug}` : "";
  return <div><div className="page-heading"><div><p className="eyebrow">MEU CARDÁPIO</p><h1>Apresente o estabelecimento <em>ao mundo.</em></h1><p className="lead">Publique o cardápio real do seu tenant e compartilhe o link.</p></div><button className="primary-button" disabled={busy} onClick={publish}>{busy ? "Publicando..." : published ? "✓ Publicado" : "Publicar cardápio"} <span>→</span></button></div><div className="menu-editor"><div className="menu-preview"><div className="preview-top"><span>bar flow</span><span>•••</span></div><div className="preview-hero"><p>{establishment?.name ?? "SEU ESTABELECIMENTO"}</p><h2>Drinks que<br /><em>contam histórias.</em></h2><small>{establishment?.public_description ?? "Uma seleção autoral para noites leves e encontros longos."}</small></div></div><div className="menu-settings"><div className="panel-heading"><div><h3>{published ? "Cardápio publicado" : "Seu primeiro cardápio"}</h3><p>{published ? "O menu está ativo no Supabase." : "Publique quando estiver pronto."}</p></div><span className={published ? "status-dot live" : "status-dot"}>{published ? "Ativo" : "Rascunho"}</span></div><div className="share-box"><span>◉</span><div><strong>Link público</strong><small>{url || "Faça login para gerar o link."}</small></div><button disabled={!url} onClick={() => { navigator.clipboard?.writeText(url); onAction("Link copiado."); }}>Copiar link</button></div></div></div></div>;
}

function MenuPage({ published, onPublish, onAction }: { published: boolean; onPublish: () => void; onAction: (message: string) => void }) {
  return <div><div className="page-heading"><div><p className="eyebrow">MEU CARDÁPIO</p><h1>Apresente a Casa Caju <em>ao mundo.</em></h1><p className="lead">Monte, publique e compartilhe sua seleção em poucos passos.</p></div><button className="primary-button" onClick={onPublish}>{published ? "✓ Publicado" : "Publicar cardápio"} <span>→</span></button></div><div className="menu-editor"><div className="menu-preview"><div className="preview-top"><span>bar flow</span><span>•••</span></div><div className="preview-hero"><p>CASA CAJU</p><h2>Drinks que<br /><em>contam histórias.</em></h2><small>Uma seleção autoral para noites leves e encontros longos.</small></div><div className="preview-list"><span>DESTAQUES</span><strong>Gin Tônica da Casa <b>R$ 32</b></strong><strong>Negroni <b>R$ 35</b></strong><strong>Moscow Mule <b>R$ 34</b></strong></div></div><div className="menu-settings"><div className="panel-heading"><div><h3>{published ? "Cardápio publicado" : "Seu primeiro cardápio"}</h3><p>{published ? "Casa Caju já está disponível para seus clientes." : "Ajuste os detalhes antes de publicar."}</p></div><span className={published ? "status-dot live" : "status-dot"}>{published ? "Ativo" : "Rascunho"}</span></div><SettingRow label="Nome público" value="Casa Caju" /><SettingRow label="Endereço" value="barflow.app/casa-caju" /><SettingRow label="Aparência" value="Tema claro · Editar" /><div className="share-box"><span>◉</span><div><strong>Compartilhe com seus clientes</strong><small>Copie o link ou gere um QR Code para sua mesa.</small></div><button onClick={() => onAction("Link copiado para a área de transferência.")}>Copiar link</button></div></div></div></div>;
}

/* eslint-disable react-hooks/static-components */
function RealBillingPage({ onAction }: { onAction: (message: string) => void }) {
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [busy, setBusy] = useState("");
  async function checkout(plan: "bronze" | "silver" | "gold") {
    setBusy(plan);
    const result = await createBillingCheckout(plan, cycle);
    setBusy("");
    if (result.error || !result.data) return onAction(result.error?.message ?? "Não foi possível iniciar o checkout.");
    window.location.assign(result.data.checkout_url);
  }
  const prices = cycle === "monthly" ? { bronze: "R$ 59,90", silver: "R$ 129,90", gold: "R$ 249,90" } : { bronze: "R$ 610,98", silver: "R$ 1.324,98", gold: "R$ 2.548,98" };
  const Plan = ({ name, slug, description, features }: { name: string; slug: "bronze" | "silver" | "gold"; description: string; features: string[] }) => <article className={`plan-card ${slug === "silver" ? "recommended" : ""}`}><div className="plan-card-top"><span className={`plan-dot ${slug}`} /><h3>{name}</h3></div><p>{description}</p><div className="plan-price"><strong>{prices[slug]}</strong><small>/{cycle === "monthly" ? "mês" : "ano"}</small></div><button className={slug === "silver" ? "primary-button" : "outline-button"} disabled={busy !== ""} onClick={() => checkout(slug)}>{busy === slug ? "Abrindo..." : `Assinar ${name}`} <span>→</span></button><ul>{features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul></article>;
  return <div><div className="page-heading"><div><p className="eyebrow">PLANO E COBRANÇA</p><h1>Escolha o ritmo do seu <em>crescimento.</em></h1><p className="lead">Assinatura segura pelo Mercado Pago. O acesso é atualizado após a confirmação do webhook.</p></div><div className="billing-cycle"><button className={cycle === "monthly" ? "active" : ""} onClick={() => setCycle("monthly")}>Mensal</button><button className={cycle === "annual" ? "active" : ""} onClick={() => setCycle("annual")}>Anual <span>-15%</span></button></div></div><div className="trial-banner"><div><span className="pill pill-gold">MERCADO PAGO</span><h2>Cartão e pagamento seguro no checkout.</h2><p>Você será redirecionado ao ambiente do Mercado Pago para concluir a assinatura.</p></div></div><div className="plan-grid"><Plan name="Bronze" slug="bronze" description="Para começar a organizar a operação." features={["100 receitas próprias", "200 produtos", "1 usuário proprietário", "1 cardápio publicado", "Biblioteca Mestre"]} /><Plan name="Silver" slug="silver" description="Para operações em crescimento." features={["Até 5 usuários", "Receitas e produtos ampliados", "Perfis de equipe fixos", "Cardápios publicados", "Exportação CSV e JSON"]} /><Plan name="Gold" slug="gold" description="Para negócios que querem mais controle." features={["Até 30 usuários", "Permissões personalizadas", "Logo e cores próprias", "Estrutura multiunidade", "Suporte prioritário"]} /></div><div className="panel billing-history"><div className="panel-heading"><div><h3>Histórico de cobrança</h3><p>O status da assinatura aparecerá aqui após o retorno do Mercado Pago.</p></div><span className="status-dot">Aguardando assinatura</span></div></div></div>;
}
/* eslint-enable react-hooks/static-components */

function FrozenCommercialPage({ onAction }: { onAction: (message: string) => void }) {
  return <div><div className="page-heading"><div><p className="eyebrow">PLANO E COBRANÇA</p><h1>Área comercial <em>em preparação.</em></h1><p className="lead">A V1 está liberada para uso sem cobrança ativa. Os valores exibidos em materiais anteriores são apenas placeholders.</p></div></div><div className="panel admin-notice"><h3>Cobrança desativada na V1</h3><p>Mercado Pago, assinaturas, teste gratuito, inadimplência, cancelamento e reativação continuam congelados até a aprovação comercial final.</p><p>Referências futuras: Bronze R$ 59,90/mês, Silver R$ 129,90/mês e Gold R$ 249,90/mês, ainda sem validade comercial.</p><button className="outline-button" onClick={() => onAction("A cobrança permanece congelada na V1.")}>Entendi</button></div></div>;
}

function PlanPage({ onAction }: { onAction: (message: string) => void }) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const planStyles = `.billing-cycle{display:flex;background:#e9f0f3;padding:3px;border-radius:8px}.billing-cycle button{background:none;color:#80909e;font-size:10px;padding:8px 11px;border-radius:6px}.billing-cycle button.active{background:#fff;color:var(--blue);font-weight:700;box-shadow:0 2px 6px #17365012}.billing-cycle button span{color:#2f9e7a;margin-left:3px}.trial-banner{display:flex;align-items:center;justify-content:space-between;gap:20px;background:linear-gradient(110deg,#123650,#1c5770);border-radius:12px;padding:23px 27px;color:#fff;margin-bottom:22px}.trial-banner h2{font-size:19px;margin:10px 0 5px}.trial-banner h2 em{font-family:Georgia,serif;color:#9bddec;font-weight:400}.trial-banner p{font-size:10px;color:#bed2db;margin:0}.plan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}.plan-card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px;position:relative}.plan-card.recommended{border:2px solid var(--blue);padding:21px;box-shadow:0 9px 25px #148fc712}.recommended-tag{position:absolute;right:14px;top:14px;background:#e1f4fa;color:#1584b2;padding:5px 7px;border-radius:10px;font-size:7px;font-weight:800;letter-spacing:.5px}.plan-card-top{display:flex;align-items:center;gap:8px}.plan-card-top h3{margin:0;font-size:15px}.plan-dot{width:10px;height:10px;border-radius:50%;display:block}.plan-dot.bronze{background:#bd9250}.plan-dot.silver{background:#6daac1}.plan-dot.gold{background:#c49742}.plan-card>p{font-size:10px;color:#8998a3;min-height:25px}.plan-price{display:flex;align-items:baseline;margin:19px 0}.plan-price strong{font-size:25px;letter-spacing:-1px}.plan-price small{color:#98a5ad;font-size:9px;margin-left:4px}.plan-card>button{width:100%}.plan-card ul{padding:0;list-style:none;margin:22px 0 0;border-top:1px solid #eef2f4}.plan-card li{font-size:10px;color:#718390;padding:9px 0;border-bottom:1px solid #eef2f4}.plan-card li::first-letter{color:#50a98d}.billing-history{min-height:170px}.empty-billing{text-align:center;padding:16px;color:#8b99a3}.empty-billing span{font-size:22px;color:#a8b7bf}.empty-billing p{font-size:10px}.plan-card .primary-button span,.plan-card .outline-button span{margin-left:8px}@media(max-width:720px){.billing-cycle{align-self:stretch}.trial-banner{align-items:flex-start;flex-direction:column}.trial-banner .outline-button{width:100%}.plan-grid{grid-template-columns:1fr}}`;
  return <div><style>{planStyles}</style><div className="page-heading"><div><p className="eyebrow">PLANO E COBRANÇA</p><h1>Escolha o ritmo do seu <em>crescimento.</em></h1><p className="lead">Você está no teste Silver. Aproveite os próximos 5 dias para conhecer o Bar Flow.</p></div><div className="billing-cycle"><button className={cycle === "monthly" ? "active" : ""} onClick={() => setCycle("monthly")}>Mensal</button><button className={cycle === "yearly" ? "active" : ""} onClick={() => setCycle("yearly")}>Anual <span>-15%</span></button></div></div><div className="trial-banner"><div><span className="pill pill-gold">TESTE GRATUITO</span><h2>Seu acesso Silver termina em <em>5 dias.</em></h2><p>Depois disso, você terá 3 dias de acesso somente leitura para escolher o melhor plano.</p></div><button className="outline-button" onClick={() => onAction("Você continuará com o Silver durante o período de teste.")}>Ver detalhes do teste</button></div><div className="plan-grid"><PlanCard name="Bronze" description="Para começar a organizar a operação." price={cycle === "monthly" ? "R$ 49" : "R$ 499"} features={["100 receitas próprias", "200 produtos", "1 usuário proprietário", "1 cardápio publicado", "Biblioteca Mestre"]} onSelect={() => onAction("Bronze selecionado. A cobrança será conectada ao Mercado Pago.")} /><PlanCard name="Silver" description="Para operações em crescimento." price={cycle === "monthly" ? "R$ 99" : "R$ 1.009"} recommended features={["Até 5 usuários", "Receitas e produtos ampliados", "Perfis de equipe fixos", "Cardápios publicados", "Exportação CSV e JSON"]} onSelect={() => onAction("Silver selecionado. Você já está no período de teste.")} /><PlanCard name="Gold" description="Para negócios que querem mais controle." price={cycle === "monthly" ? "R$ 199" : "R$ 2.030"} features={["Até 30 usuários", "Permissões personalizadas", "Logo e cores próprias", "Estrutura multiunidade", "Suporte prioritário"]} onSelect={() => onAction("Gold selecionado. A ativação será conectada ao Mercado Pago.")} /></div><div className="panel billing-history"><div className="panel-heading"><div><h3>Histórico de cobrança</h3><p>Seus pagamentos e documentos fiscais.</p></div><span className="status-dot">Nenhuma cobrança</span></div><div className="empty-billing"><span>◷</span><p>Você ainda não possui cobranças. O primeiro pagamento aparecerá aqui após a contratação.</p></div></div></div>;
}

function PlanCard({ name, description, price, features, recommended, onSelect }: { name: string; description: string; price: string; features: string[]; recommended?: boolean; onSelect: () => void }) {
  return <article className={recommended ? "plan-card recommended" : "plan-card"}>{recommended && <span className="recommended-tag">MAIS ESCOLHIDO</span>}<div className="plan-card-top"><span className={`plan-dot ${name.toLowerCase()}`} /><h3>{name}</h3></div><p>{description}</p><div className="plan-price"><strong>{price}</strong><small>/mês</small></div><button className={recommended ? "primary-button" : "outline-button"} onClick={onSelect}>{name === "Silver" ? "Continuar no Silver" : "Escolher " + name} <span>→</span></button><ul>{features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul></article>;
}

function RealSettings({ establishment, onEstablishmentChange, onAction, onAdmin }: { establishment: BarFlowEstablishment | null; onEstablishmentChange: (value: BarFlowEstablishment) => void; onAction: (message: string) => void; onAdmin: () => void }) {
  const [name, setName] = useState(establishment?.name ?? "");
  const [phone, setPhone] = useState(establishment?.phone ?? "");
  const [description, setDescription] = useState(establishment?.public_description ?? "");
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!establishment) return onAction("Nenhum estabelecimento real foi encontrado.");
    setBusy(true);
    const result = await saveEstablishment(establishment.id, { name, phone, public_description: description });
    setBusy(false);
    if (result.error || !result.data) return onAction(result.error?.message ?? "Não foi possível salvar as configurações.");
    onEstablishmentChange(result.data as BarFlowEstablishment);
    onAction("Configurações salvas no Supabase.");
  }
  return <div><div className="page-heading"><div><p className="eyebrow">CONFIGURAÇÕES</p><h1>Deixe tudo do seu <em>jeito.</em></h1><p className="lead">Dados persistidos no estabelecimento atual.</p></div></div><div className="settings-grid"><div className="panel settings-nav"><button className="selected">Estabelecimento</button><button>Perfil e acesso</button><button>Preferências</button><button onClick={onAdmin}>Painel Bar Flow ↗</button></div><div className="panel settings-form"><div className="panel-heading"><div><h3>Dados do estabelecimento</h3><p>Estas informações aparecem no cardápio público.</p></div></div><label>Nome do estabelecimento<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Descrição<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label><label>Telefone<input value={phone} onChange={(event) => setPhone(event.target.value)} /></label><button className="primary-button save-button" disabled={busy} onClick={save}>{busy ? "Salvando..." : "Salvar alterações"}</button></div></div></div>;
}

function Settings({ onAction, onAdmin }: { onAction: (message: string) => void; onAdmin: () => void }) {
  return <div><div className="page-heading"><div><p className="eyebrow">CONFIGURAÇÕES</p><h1>Deixe tudo do seu <em>jeito.</em></h1><p className="lead">Gerencie sua conta, estabelecimento e preferências.</p></div></div><div className="settings-grid"><div className="panel settings-nav"><button className="selected">Estabelecimento</button><button>Perfil e acesso</button><button>Plano e cobrança</button><button>Preferências</button><button onClick={onAdmin}>Painel Bar Flow ↗</button></div><div className="panel settings-form"><div className="panel-heading"><div><h3>Dados do estabelecimento</h3><p>Estas informações aparecem no seu cardápio público.</p></div></div><label>Nome do estabelecimento<input defaultValue="Casa Caju" /></label><label>Descrição<textarea defaultValue="Uma seleção autoral para noites leves e encontros longos." /></label><div className="form-row"><label>Telefone<input defaultValue="+55 11 98729-1623" /></label><label>Instagram<input defaultValue="@casacaju" /></label></div><button className="primary-button save-button" onClick={() => onAction("Configurações salvas.")}>Salvar alterações</button></div></div></div>;
}

function Metric({ label, value, change, icon, tone }: { label: string; value: string; change: string; icon: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small><b>↗</b> {change}</small></div>; }
function Activity({ icon, title, desc, time, tone }: { icon: string; title: string; desc: string; time: string; tone: string }) { return <div className="activity"><span className={`activity-icon ${tone}`}>{icon}</span><div><strong>{title}</strong><small>{desc}</small></div><time>{time}</time></div>; }
function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) { return <button className="quick-action" onClick={onClick}><span>{icon}</span><strong>{label}</strong><b>→</b></button>; }
function LibraryCard({ item, onAction }: { item: { name: string; category: string; time: string; type: string; tone: string }; onAction: (message: string) => void }) { return <article className="library-card"><div className={`card-art ${item.tone}`}><span>{item.type === "Produto" ? "▣" : item.type === "Preparo" ? "✦" : "◒"}</span><button aria-label="Favoritar" onClick={() => onAction(item.name + " foi salvo nos favoritos.")}>☆</button></div><div className="card-body"><small>{item.type} · {item.category}</small><h3>{item.name}</h3><div><span>◷ {item.time}</span><button onClick={() => onAction(item.name + " foi adicionado ao seu acervo.")}>Adicionar <b>＋</b></button></div></div></article>; }
function EmptyState({ title, copy, action, onAction }: { title: string; copy: string; action: string; onAction: () => void }) { return <div className="empty-state"><span>☆</span><h2>{title}</h2><p>{copy}</p><button className="primary-button" onClick={onAction}>{action} →</button></div>; }
function SettingRow({ label, value }: { label: string; value: string }) { return <div className="setting-row"><span>{label}</span><strong>{value}</strong><button>Editar</button></div>; }

function AuthScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [recovery, setRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function submitLogin() {
    const result = await signInWithPassword(email, password);
    if (result.error && !result.error.message.includes("modo demonstração")) { setMessage(result.error.message); return; }
    onLogin();
  }
  async function submitRecovery() {
    const result = await requestPasswordReset(email);
    if (result.error && !result.error.message.includes("modo demonstração")) { setMessage(result.error.message); return; }
    setMessage("Se o e-mail existir, você receberá um link de recuperação.");
  }
  async function submitGoogle() {
    const result = await signInWithGoogle();
    if (result.error && !result.error.message.includes("modo demonstração")) { setMessage(result.error.message); return; }
    onLogin();
  }
  return <main className="auth-shell"><div className="auth-brand" onClick={onBack}><div className="brand-mark">B</div><strong>bar flow</strong></div><div className="auth-card"><div className="auth-intro"><span className="eyebrow">BEM-VINDO DE VOLTA</span><h1>{recovery ? "Recupere seu acesso." : "Sua operação, mais fluida."}</h1><p>{recovery ? "Informe seu e-mail e enviaremos um link seguro para redefinir sua senha." : "Entre para continuar organizando o bar que você constrói todos os dias."}</p></div>{recovery ? <><label>E-mail profissional<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@seunegocio.com.br" /></label><button className="primary-button auth-submit" onClick={submitRecovery}>Enviar link de recuperação <span>→</span></button><button className="auth-link" onClick={() => setRecovery(false)}>Voltar para o login</button></> : <><button className="google-button" onClick={submitGoogle}><b>G</b> Continuar com Google</button><div className="auth-divider"><span>ou entre com e-mail</span></div><label>E-mail profissional<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@seunegocio.com.br" /></label><label>Senha<div className="password-field"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" /><span>◉</span></div></label><button className="primary-button auth-submit" onClick={submitLogin}>Entrar <span>→</span></button><button className="auth-link" onClick={() => setRecovery(true)}>Esqueci minha senha</button><p className="auth-footer">Ainda não tem uma conta? <button onClick={onLogin}>Comece seu teste grátis</button></p></>}{message && <p className="auth-message">{message}</p>}</div><p className="auth-legal">Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.</p></main>;
}

function OnboardingScreen({ onComplete }: { onComplete: (input: { name: string; city: string; phone: string; segment: string }) => void | Promise<void> }) {
  const [step, setStep] = useState(1);
  const [segment, setSegment] = useState("Bar");
  const [name, setName] = useState("Casa Caju");
  const [city, setCity] = useState("São Paulo");
  const [phone, setPhone] = useState("");
  const segments = ["Bar", "Casa noturna", "Adega", "Restaurante", "Bartender autônomo", "Eventos"];
  return <main className="onboarding-shell"><div className="onboarding-top"><div className="brand"><div className="brand-mark">B</div><div><strong>bar flow</strong><span>operação de bebidas</span></div></div><span>Etapa {step} de 3</span></div><div className="onboarding-progress"><span style={{ width: `${step * 33.33}%` }} /></div><div className="onboarding-card">{step === 1 && <><span className="step-number">01</span><h1>Vamos começar pelo seu espaço.</h1><p>Conte um pouco sobre o estabelecimento para personalizarmos sua experiência.</p><label>Nome do estabelecimento<input value={name} onChange={(event) => setName(event.target.value)} /></label><div className="form-row"><label>Cidade<input value={city} onChange={(event) => setCity(event.target.value)} /></label><label>WhatsApp<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+55 (11) 00000-0000" /></label></div></>}{step === 2 && <><span className="step-number">02</span><h1>Qual é o seu ritmo?</h1><p>Isso nos ajuda a recomendar receitas e produtos mais relevantes.</p><div className="segment-grid">{segments.map((item) => <button key={item} className={segment === item ? "segment-card selected" : "segment-card"} onClick={() => setSegment(item)}><span>◒</span><strong>{item}</strong></button>)}</div></>}{step === 3 && <><span className="step-number">03</span><h1>Uma boa base para começar.</h1><p>Selecionamos alguns itens da Biblioteca Mestre para você revisar e adicionar ao seu acervo.</p><div className="starter-list">{["Gin Tônica da Casa", "Negroni", "Moscow Mule", "Xarope de hibisco"].map((item, index) => <label key={item} className="starter-item"><input type="checkbox" defaultChecked={index < 2} /><span className={`result-dot ${index % 2 ? "wine" : "blue"}`} /><strong>{item}</strong><small>{index === 3 ? "Preparo" : "Receita"} · sugerido para {segment}</small></label>)}</div></>}<div className="onboarding-actions"><button className="ghost-button" onClick={() => step > 1 ? setStep(step - 1) : undefined}>{step > 1 ? "Voltar" : "Sair"}</button><button className="primary-button" onClick={() => step < 3 ? setStep(step + 1) : onComplete({ name, city, phone, segment })}>{step < 3 ? "Continuar" : "Entrar no Bar Flow"} <span>→</span></button></div></div></main>;
}

function RealAdminPanel({ onBack, onAction }: { onBack: () => void; onAction: (message: string) => void }) {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetchAdminSnapshot().then((result) => { setSnapshot(result.data); if (result.error) setError(result.error.message); }); }, []);
  const value = (number: number | undefined) => number === undefined ? "—" : String(number);
  return <main className="admin-shell"><header className="admin-topbar"><button className="brand" onClick={onBack}><div className="brand-mark">B</div><div><strong>bar flow</strong><span>painel administrativo</span></div></button><div className="admin-user"><span className="status-dot live">Equipe Bar Flow</span><button onClick={onBack}>← Voltar ao produto</button></div></header><div className="admin-content"><div className="admin-heading"><div><span className="eyebrow">OPERAÇÃO DA PLATAFORMA</span><h1>Administração <em>Bar Flow.</em></h1><p className="lead">Dados operacionais carregados do Supabase.</p></div><button className="outline-button" onClick={() => onAction("O relatório será exportado quando a sessão administrativa estiver validada.")}>Exportar relatório ↓</button></div>{error && <div className="panel admin-notice"><strong>Painel aguardando configuração</strong><p>{error}</p><small>O painel não exibe métricas comerciais fictícias.</small></div>}<div className="admin-metrics"><Metric label="Grupos empresariais" value={value(snapshot?.activeCustomers)} change="Dados reais" icon="◉" tone="blue" /><Metric label="Estabelecimentos" value={value(snapshot?.establishments)} change="Ativos" icon="⌂" tone="green" /><Metric label="Usuários ativos" value={value(snapshot?.users)} change="Membros" icon="◷" tone="gold" /><Metric label="Itens na Biblioteca" value={value(snapshot?.masterItems)} change="Publicados" icon="▱" tone="purple" /></div><div className="admin-grid"><div className="panel"><div className="panel-heading"><div><h3>Estabelecimentos recentes</h3><p>Registros reais do ambiente Supabase.</p></div></div>{snapshot?.recentEstablishments.length ? snapshot.recentEstablishments.map((item) => <div className="admin-row" key={item.id}><div className="avatar avatar-small">{item.name.slice(0, 1)}</div><div><strong>{item.name}</strong><small>{item.segment}</small></div><span>●</span></div>) : <p className="admin-empty">Nenhum registro disponível para esta sessão.</p>}</div><div className="panel health-panel"><div className="panel-heading"><div><h3>Auditoria recente</h3><p>Ações registradas sem dados sensíveis.</p></div></div>{snapshot?.auditLogs.length ? snapshot.auditLogs.map((item) => <div className="health-row" key={item.id}><span className="result-dot blue" /><strong>{item.action}</strong><b>{item.entity_type}</b></div>) : <p className="admin-empty">Nenhum evento disponível.</p>}</div></div></div></main>;
}

function AdminPanel({ onBack, onAction }: { onBack: () => void; onAction: (message: string) => void }) {
  const [tab, setTab] = useState("Visão geral");
  const tabs = ["Visão geral", "Clientes", "Biblioteca", "Financeiro", "Auditoria"];
  return <main className="admin-shell"><header className="admin-topbar"><button className="brand" onClick={onBack}><div className="brand-mark">B</div><div><strong>bar flow</strong><span>painel administrativo</span></div></button><div className="admin-user"><span className="status-dot live">Equipe Bar Flow</span><button onClick={onBack}>← Voltar ao produto</button></div></header><div className="admin-content"><div className="admin-heading"><div><span className="eyebrow">OPERAÇÃO DA PLATAFORMA</span><h1>Administração <em>Bar Flow.</em></h1><p className="lead">Uma visão segura da saúde do produto e dos clientes.</p></div><button className="outline-button" onClick={() => onAction("Relatório exportado em CSV.")}>Exportar relatório ↓</button></div><div className="admin-tabs">{tabs.map((item) => <button key={item} className={tab === item ? "admin-tab active" : "admin-tab"} onClick={() => setTab(item)}>{item}</button>)}</div>{tab === "Visão geral" && <><div className="admin-metrics"><Metric label="Clientes ativos" value="248" change="+18 este mês" icon="◉" tone="blue" /><Metric label="Receita recorrente" value="R$ 18,4k" change="+12,8% no mês" icon="↗" tone="green" /><Metric label="Em período de teste" value="36" change="14 iniciaram hoje" icon="◷" tone="gold" /><Metric label="Itens na Biblioteca" value="400" change="100 receitas · 300 produtos" icon="▱" tone="purple" /></div><div className="admin-grid"><div className="panel"><div className="panel-heading"><div><h3>Clientes recentes</h3><p>Novas contas e movimentações importantes.</p></div><button className="icon-link" onClick={() => setTab("Clientes")}>Ver clientes →</button></div>{[["Casa Caju","Silver","Ativo"],["Bar do Zé","Bronze","Em teste"],["Vinho & Prosa","Gold","Ativo"],["Dois Irmãos Eventos","Silver","Inadimplente"]].map(([name, plan, status]) => <div className="admin-row" key={name}><div className="avatar avatar-small">{name.slice(0, 1)}</div><div><strong>{name}</strong><small>{plan} · {status}</small></div><span>{status === "Ativo" ? "●" : "○"}</span></div>)}</div><div className="panel health-panel"><div className="panel-heading"><div><h3>Saúde da plataforma</h3><p>Últimas 24 horas.</p></div></div><HealthRow label="Disponibilidade" value="99,98%" tone="green" /><HealthRow label="Novos cadastros" value="+24" tone="blue" /><HealthRow label="Pagamentos aprovados" value="94,2%" tone="gold" /><HealthRow label="Chamados abertos" value="8" tone="purple" /></div></div></>}{tab !== "Visão geral" && <div className="admin-placeholder panel"><span className="summary-icon blue">◌</span><h2>{tab}</h2><p>Esta área está estruturada e pronta para receber dados do Supabase e Mercado Pago.</p><button className="primary-button" onClick={() => onAction("A integração será conectada quando as credenciais estiverem disponíveis.")}>Ver configuração</button></div>}</div></main>;
}

function HealthRow({ label, value, tone }: { label: string; value: string; tone: string }) { return <div className="health-row"><span className={`result-dot ${tone}`} /><strong>{label}</strong><b>{value}</b></div>; }
