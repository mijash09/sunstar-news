'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Users,
  Globe,
  LogOut,
  Eye,
  Trash2,
  Edit,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Bold,
  Italic,
  Heading2,
  Quote,
  Code,
  List,
  Link2,
  CheckCircle2,
  AlertCircle,
  Menu,
  ExternalLink,
  Tag,
  Zap,
} from 'lucide-react';

import { logoutAction } from '@/app/actions/auth';
import { createArticleAction, deleteArticleAction, createStaffUserAction, createBannerAction, deleteBannerAction } from '@/app/actions/dashboard';
import SUNSTAR_DATA, { getAllArticles, BannerAd, RashifalItem } from '@/lib/data';
import AdBanner from '@/components/molecules/AdBanner';
import EasyMarkdownEditor from '@/components/organisms/EasyMarkdownEditor';

type TabType = 'overview' | 'articles' | 'create' | 'banners' | 'users' | 'rashifal' | 'bhakharai';

const TAB_NAMES_MAP: Record<TabType, string> = {
  overview: 'मुख्य ड्यासबोर्ड',
  articles: 'समाचार सूची',
  create: 'नयाँ समाचार',
  banners: 'विज्ञापन तथा ब्यानर',
  users: 'कर्मचारी व्यवस्थापन',
  rashifal: 'दैनिक राशिफल',
  bhakharai: 'भर्खरै समाचार',
};

const BANNER_POSITIONS_INFO = [
  {
    keyword: 'header-top',
    name: 'मुख्य माथिल्लो ब्यानर',
    size: '७२८ x ९० px',
    page: 'गृहपृष्ठ / सबै पाना',
    desc: 'मुख्य नेभिगेसन बार र ताजा समाचार टिकरको ठीक मुनि देखिने मुख्य ब्यानर स्थान।',
  },
  {
    keyword: 'hero-side',
    name: 'मुख्य समाचार दायाँ ब्यानर',
    size: '३०० x २५० px',
    page: 'गृहपृष्ठ',
    desc: 'गृहपृष्ठको प्रमुख समाचार खण्डको दायाँ छेउमा रहने आयताकार ब्यानर।',
  },
  {
    keyword: 'mid-content-1',
    name: 'मुख्य सामग्री बीचको ब्यानर',
    size: '७२८ x ९० px',
    page: 'गृहपृष्ठ',
    desc: 'गृहपृष्ठको मुख्य समाचार खण्ड समाप्त भएपछि बीचमा देखिने सम्पादकीय ब्यानर।',
  },
  {
    keyword: 'mid-content-2',
    name: 'प्रदेश समाचार बीचको ब्यानर',
    size: '७२८ x ९० px',
    page: 'गृहपृष्ठ',
    desc: 'गृहपृष्ठको प्रदेश समाचार खण्ड पछि देखिने तेस्रो तेर्सो ब्यानर स्थान।',
  },
  {
    keyword: 'sidebar-widget',
    name: 'दायाँ स्टिकी ब्यानर',
    size: '३०० x २५० px',
    page: 'गृहपृष्ठ साइडबार',
    desc: 'गृहपृष्ठको दायाँ खण्डमा स्क्रोल गर्दा अड्किने विज्ञापन ब्यानर।',
  },
  {
    keyword: 'single-news-sidebar',
    name: 'समाचार पाना दायाँ ब्यानर',
    size: '३०० x २५० px',
    page: 'समाचार पाना',
    desc: 'कुनै पनि समाचार खोल्दा दायाँ तर्फको स्टिकी साइडबारमा देखिने विज्ञापन स्थान।',
  },
  {
    keyword: 'rashifal-top',
    name: 'राशिफल माथिल्लो ब्यानर',
    size: '७२८ x ९० px',
    page: 'राशिफल पाना',
    desc: 'दैनिक राशिफल पानाको १२ राशी सूचीको माथि देखिने प्रमुख ब्यानर।',
  },
  {
    keyword: 'footer-top',
    name: 'फुटर माथिल्लो ब्यानर',
    size: '७२८ x ९० px',
    page: 'सबै पाना',
    desc: 'वेबसाइटको डार्क फुटर भन्दा ठीक माथि सम्पूर्ण चौडाइमा देखिने विज्ञापन स्थान।',
  },
];

const CATEGORY_OPTIONS = [
  'मुख्य समाचार',
  'विशेष',
  'राजनीति',
  'अर्थशास्त्र',
  'प्रदेश',
  'विचार',
  'मनोरञ्जन',
  'खेलकुद',
  'प्रविधि',
  'विश्व',
];

// Custom Markdown Text Editor Component with Live Preview & Lucide Toolbar Icons
function MarkdownTextEditor({
  value,
  onChange,
  name = 'content',
  placeholder = 'यहाँ समाचारको विस्तृत विवरण लेख्नुहोस्...',
}: {
  value: string;
  onChange: (val: string) => void;
  name?: string;
  placeholder?: string;
}) {
  const [activeMode, setActiveMode] = useState<'write' | 'preview'>('write');

  function insertFormat(prefix: string, suffix: string = '') {
    const textarea = document.getElementById(`md-editor-${name}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'नमूना पाठ';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  }

  function renderMarkdownHtml(mdText: string) {
    if (!mdText) return '<p class="text-muted">केही विवरण लेखिएको छैन...</p>';

    let html = mdText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');

    return `<p>${html}</p>`;
  }

  return (
    <div className="shadcn-md-editor">
      <div className="shadcn-md-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button type="button" onClick={() => insertFormat('**', '**')} className="shadcn-md-btn" title="गाढा">
          <Bold size={15} />
        </button>
        <button type="button" onClick={() => insertFormat('*', '*')} className="shadcn-md-btn" title="छड्के">
          <Italic size={15} />
        </button>
        <button type="button" onClick={() => insertFormat('## ')} className="shadcn-md-btn" title="शीर्षक">
          <Heading2 size={15} />
        </button>
        <button type="button" onClick={() => insertFormat('> ')} className="shadcn-md-btn" title="उद्धरण">
          <Quote size={15} />
        </button>
        <button type="button" onClick={() => insertFormat('`', '`')} className="shadcn-md-btn" title="कोड">
          <Code size={15} />
        </button>
        <button type="button" onClick={() => insertFormat('- ')} className="shadcn-md-btn" title="सूची">
          <List size={15} />
        </button>
        <button type="button" onClick={() => insertFormat('[', '](https://example.com)')} className="shadcn-md-btn" title="लिङ्क">
          <Link2 size={15} />
        </button>

        <div className="shadcn-md-preview-toggle" style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setActiveMode('write')}
            className={`shadcn-btn ${activeMode === 'write' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Edit size={13} /> सम्पादन
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preview')}
            className={`shadcn-btn ${activeMode === 'preview' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Eye size={13} /> अवलोकन
          </button>
        </div>
      </div>

      {activeMode === 'write' ? (
        <textarea
          id={`md-editor-${name}`}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="shadcn-md-textarea"
          required
        />
      ) : (
        <div
          className="shadcn-md-preview"
          dangerouslySetInnerHTML={{ __html: renderMarkdownHtml(value) }}
        />
      )}
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get('tab') as TabType) || 'overview';
  const [activeTab, setActiveTab] = useState<TabType>(tabParam);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contentAccordionOpen, setContentAccordionOpen] = useState(true);
  const [systemAccordionOpen, setSystemAccordionOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedCreateCategories, setSelectedCreateCategories] = useState<string[]>(['मुख्य समाचार']);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination State for Articles
  const [articlePage, setArticlePage] = useState(1);
  const articlesPerPage = 6;

  // Banners State & Live Preview Tab
  const [bannersList, setBannersList] = useState<BannerAd[]>(SUNSTAR_DATA.banners || []);
  const [bannerPreviewTab, setBannerPreviewTab] = useState<'home' | 'post' | 'rashifal'>('home');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('all');
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);

  // Rashifal Management State
  const [rashifalList, setRashifalList] = useState<RashifalItem[]>(SUNSTAR_DATA.rashifal || []);
  const [editingRashifal, setEditingRashifal] = useState<RashifalItem | null>(null);

  // Breaking News (Bhakharai) State
  const [breakingNewsText, setBreakingNewsText] = useState<string>(
    (SUNSTAR_DATA.breakingNews || []).join('\n')
  );

  // Modals
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [articleMarkdownContent, setArticleMarkdownContent] = useState('');

  // Sync tab with URL search parameter
  useEffect(() => {
    const currentTab = searchParams.get('tab') as TabType;
    if (currentTab && ['overview', 'articles', 'create', 'banners', 'users', 'rashifal', 'bhakharai'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  function handleUpdateBreakingNews(e: React.FormEvent) {
    e.preventDefault();
    const items = breakingNewsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    SUNSTAR_DATA.breakingNews = items;
    setMsg({ type: 'success', text: `भर्खरै समाचार टिकर अद्यावधिक भयो (${items.length} वटा मुख्य समाचार सक्रिय)!` });
  }

  function switchTab(tab: TabType) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  }

  function toggleCreateCategory(cat: string) {
    if (selectedCreateCategories.includes(cat)) {
      if (selectedCreateCategories.length > 1) {
        setSelectedCreateCategories(selectedCreateCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCreateCategories([...selectedCreateCategories, cat]);
    }
  }

  const allArticles = getAllArticles();
  const filteredArticles = allArticles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchTerm.toLowerCase());
    const articleCats = art.categories && art.categories.length > 0 ? art.categories : [art.category];
    const matchesCat = selectedCategoryFilter === 'all' ? true : articleCats.includes(selectedCategoryFilter);
    return matchesSearch && matchesCat;
  });

  const totalArticlePages = Math.ceil(filteredArticles.length / articlesPerPage) || 1;
  const paginatedArticles = filteredArticles.slice(
    (articlePage - 1) * articlesPerPage,
    articlePage * articlesPerPage
  );

  async function handleCreateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('content', articleMarkdownContent);
    formData.set('category', selectedCreateCategories[0] || 'मुख्य समाचार');
    formData.set('categories', JSON.stringify(selectedCreateCategories));

    const res = await createArticleAction(formData);

    setLoading(false);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else if (res && res.success) {
      setMsg({ type: 'success', text: res.success });
      (e.target as HTMLFormElement).reset();
      setArticleMarkdownContent('');
      setSelectedCreateCategories(['मुख्य समाचार']);
      setIsAddArticleModalOpen(false);
    }
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm('के तपाईं यो समाचार हटाउन निश्चित हुनुहुन्छ?')) {
      return;
    }

    const res = await deleteArticleAction(id);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else if (res && res.success) {
      setMsg({ type: 'success', text: res.success });
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createStaffUserAction(formData);

    setLoading(false);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else if (res && res.success) {
      setMsg({ type: 'success', text: 'नयाँ कर्मचारी प्रयोगकर्ता सिर्जना गरियो!' });
      (e.target as HTMLFormElement).reset();
      setIsAddUserModalOpen(false);
    }
  }

  async function handleCreateBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const targetUrl = (formData.get('targetUrl') as string) || '#';
    const position = formData.get('position') as any;

    const res = await createBannerAction(formData);
    setLoading(false);

    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      const newBanner: BannerAd = {
        id: `banner-${Date.now()}`,
        title,
        imageUrl,
        targetUrl,
        position,
        isActive: true,
        clicksCount: 0,
      };
      setBannersList([newBanner, ...bannersList]);
      setMsg({ type: 'success', text: 'नयाँ विज्ञापन ब्यानर सफलताका साथ प्रकाशित भयो!' });
      (e.target as HTMLFormElement).reset();
      setIsAddBannerModalOpen(false);
    }
  }

  async function handleDeleteBanner(id: string) {
    if (!confirm('के तपाईं यो विज्ञापन ब्यानर हटाउन निश्चित हुनुहुन्छ?')) return;
    const res = await deleteBannerAction(id);
    if (res && res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setBannersList(bannersList.filter((b) => b.id !== id));
      setMsg({ type: 'success', text: 'विज्ञापन ब्यानर हटाइयो!' });
    }
  }

  function handleSaveRashifalPrediction(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRashifal) return;

    setRashifalList(
      rashifalList.map((r) => (r.id === editingRashifal.id ? editingRashifal : r))
    );
    setMsg({ type: 'success', text: `${editingRashifal.sign} राशिको भविष्यफल अद्यावधिक भयो!` });
    setEditingRashifal(null);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="shadcn-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`shadcn-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} style={{ color: 'var(--brand-orange)' }} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
                सनस्टार CMS
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                प्रणाली व्यवस्थापन
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: mobileMenuOpen ? 'block' : 'none', background: 'none', border: 'none', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Accordion Groups */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {/* Group 1: Content Management */}
          <div className="shadcn-sidebar-group">
            <button
              onClick={() => setContentAccordionOpen(!contentAccordionOpen)}
              className="shadcn-accordion-header"
            >
              <span>सामग्री व्यवस्थापन</span>
              {contentAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {contentAccordionOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <button
                  onClick={() => switchTab('overview')}
                  className={`shadcn-sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={18} /> मुख्य ड्यासबोर्ड
                </button>
                <button
                  onClick={() => switchTab('articles')}
                  className={`shadcn-sidebar-item ${activeTab === 'articles' ? 'active' : ''}`}
                >
                  <FileText size={18} /> समाचार सूची ({allArticles.length})
                </button>
                <button
                  onClick={() => switchTab('create')}
                  className={`shadcn-sidebar-item ${activeTab === 'create' ? 'active' : ''}`}
                >
                  <Plus size={18} /> नयाँ समाचार
                </button>
                <button
                  onClick={() => switchTab('banners')}
                  className={`shadcn-sidebar-item ${activeTab === 'banners' ? 'active' : ''}`}
                >
                  <ImageIcon size={18} /> विज्ञापन र ब्यानर ({bannersList.length})
                </button>
                <button
                  onClick={() => switchTab('rashifal')}
                  className={`shadcn-sidebar-item ${activeTab === 'rashifal' ? 'active' : ''}`}
                >
                  <Sparkles size={18} /> दैनिक राशिफल ({rashifalList.length} राशी)
                </button>
                <button
                  onClick={() => switchTab('bhakharai')}
                  className={`shadcn-sidebar-item ${activeTab === 'bhakharai' ? 'active' : ''}`}
                >
                  <Zap size={18} /> भर्खरै समाचार ({breakingNewsText.split('\n').filter(Boolean).length})
                </button>
              </div>
            )}
          </div>

          {/* Group 2: System Management */}
          <div className="shadcn-sidebar-group" style={{ marginTop: '16px' }}>
            <button
              onClick={() => setSystemAccordionOpen(!systemAccordionOpen)}
              className="shadcn-accordion-header"
            >
              <span>प्रणाली र प्रयोगकर्ता</span>
              {systemAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {systemAccordionOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <button
                  onClick={() => switchTab('users')}
                  className={`shadcn-sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
                >
                  <Users size={18} /> कर्मचारी व्यवस्थापन
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="shadcn-sidebar-item"
                  style={{ textDecoration: 'none' }}
                >
                  <Globe size={18} /> वेबसाइट हेर्नुहोस् <ExternalLink size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-alt)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>👨‍💼</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  प्रमुख सम्पादक
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>admin@sunstar.com</div>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="shadcn-btn shadcn-btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center' }}
                title="बाहिरिनुहोस्"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header
          className="dashboard-header"
          style={{
            height: '64px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="shadcn-btn shadcn-btn-secondary"
              style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center' }}
              id="sidebar-toggle-btn"
              title="मेनु खोल्नुहोस्"
            >
              <Menu size={18} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              गृहपृष्ठ &nbsp;›&nbsp; <strong style={{ color: 'var(--text-primary)' }}>{TAB_NAMES_MAP[activeTab] || activeTab}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="shadcn-badge shadcn-badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> अनलाइन
            </span>
            <Link href="/" className="shadcn-btn shadcn-btn-outline" style={{ textDecoration: 'none', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} /> <span className="hidden-mobile">वेबसाइटमा फर्कनुहोस्</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="dashboard-main-content" style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
          {/* System Notification Banner */}
          {msg && (
            <div
              className="shadcn-card"
              style={{
                padding: '12px 18px',
                marginBottom: '20px',
                backgroundColor: msg.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${msg.type === 'success' ? '#22c55e' : '#ef4444'}`,
                color: msg.type === 'success' ? '#15803d' : '#b91c1c',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {msg.text}
              </span>
              <button
                onClick={() => setMsg(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW ANALYTICS */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 className="shadcn-card-title" style={{ fontSize: '1.6rem' }}>📊 व्यवस्थापक ड्यासबोर्ड झलक</h1>
                <p className="shadcn-card-description">सनस्टार न्युज पोर्टलको सामग्री, पाठक र विज्ञापन सम्बन्धी संक्षिप्त तथ्याङ्क।</p>
              </div>

              {/* Analytics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div className="shadcn-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>कुल प्रकाशित समाचार</span>
                    <FileText size={22} style={{ color: 'var(--brand-blue)' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{allArticles.length}</div>
                  <span className="shadcn-badge shadcn-badge-success" style={{ marginTop: '8px' }}>+४ आज थपिएका</span>
                </div>

                <div className="shadcn-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>समाचार विधा / वर्ग</span>
                    <Tag size={22} style={{ color: 'var(--brand-orange)' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{CATEGORY_OPTIONS.length} विधा</div>
                  <span className="shadcn-badge shadcn-badge-orange" style={{ marginTop: '8px' }}>मुख्य तथा प्रादेशिक</span>
                </div>

                <div className="shadcn-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>भर्खरै समाचार टिकर</span>
                    <Zap size={22} style={{ color: '#E11D48' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#E11D48' }}>
                    {breakingNewsText.split('\n').filter(Boolean).length} मुख्य समाचार
                  </div>
                  <span className="shadcn-badge shadcn-badge-destructive" style={{ marginTop: '8px', backgroundColor: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>लाइभ टिकर</span>
                </div>

                <div className="shadcn-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>दैनिक राशिफल राशी</span>
                    <Sparkles size={22} style={{ color: 'var(--brand-blue)' }} />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-blue)' }}>१२ राशी</div>
                  <span className="shadcn-badge shadcn-badge-default" style={{ marginTop: '8px' }}>आजको अद्यावधिक</span>
                </div>
              </div>

              {/* QUICK BHAKHARAI NEWS TEXTAREA CARD ON OVERVIEW */}
              <div className="shadcn-card" style={{ padding: '24px', marginBottom: '32px' }}>
                <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 className="shadcn-card-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={20} style={{ color: '#E11D48' }} /> भर्खरै समाचार छिटो अद्यावधिक (Bhakharai News Textarea)
                    </h3>
                    <p className="shadcn-card-description">
                      वेबसाइटको माथिल्लो पट्टीमा निरन्तर चल्ने भर्खरैका ताजा समाचारहरू यहाँबाट सिधै लेख्नुहोस् वा सम्पादन गर्नुहोस्।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchTab('bhakharai')}
                    className="shadcn-btn shadcn-btn-outline"
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    पूर्ण भर्खरै समाचार पाना हेर्नुहोस्
                  </button>
                </div>

                <form onSubmit={handleUpdateBreakingNews} style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label className="shadcn-label" style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', display: 'block' }}>
                      🔥 भर्खरै समाचारहरू (प्रत्येक नयाँ हरफमा एउटा समाचार):
                    </label>
                    <textarea
                      rows={6}
                      value={breakingNewsText}
                      onChange={(e) => setBreakingNewsText(e.target.value)}
                      placeholder="१. यहाँ भर्खरैको मुख्य समाचार लेख्नुहोस्...&#10;२. यहाँ अर्को भर्खरै समाचार लेख्नुहोस्..."
                      className="shadcn-textarea"
                      style={{ width: '100%', fontSize: '0.95rem', lineHeight: 1.65, padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)' }}
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="shadcn-btn shadcn-btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Zap size={16} /> भर्खरै समाचार अद्यावधिक गर्नुहोस्
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES MANAGEMENT TABLE */}
          {activeTab === 'articles' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="shadcn-card-title" style={{ fontSize: '1.6rem' }}>📰 समाचार सूची</h1>
                  <p className="shadcn-card-description">सनस्टार न्युजमा प्रकाशित सबै समाचार र बहु-विधा सूची तथा व्यवस्थापन।</p>
                </div>
                <button
                  onClick={() => setIsAddArticleModalOpen(true)}
                  className="shadcn-btn shadcn-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> नयाँ समाचार थप्नुहोस्
                </button>
              </div>

              {/* Filter Controls & Multi-Category Pills */}
              <div className="shadcn-card" style={{ padding: '18px 20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="समाचार शीर्षक वा विधा खोज्नुहोस्..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="shadcn-input"
                    style={{ paddingLeft: '36px' }}
                  />
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} /> विधा अनुसार फिल्टर:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`shadcn-btn ${selectedCategoryFilter === 'all' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
                    style={{ padding: '4px 12px', fontSize: '0.78rem', borderRadius: '16px' }}
                  >
                    सबै विधाहरू
                  </button>
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`shadcn-btn ${isSelected ? 'shadcn-btn-primary' : 'shadcn-btn-outline'}`}
                        style={{ padding: '4px 12px', fontSize: '0.78rem', borderRadius: '16px' }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data Table */}
              <div className="shadcn-table-container">
                <table className="shadcn-table">
                  <thead>
                    <tr>
                      <th>कभर तस्बिर</th>
                      <th>समाचार शीर्षक</th>
                      <th>सम्बन्धित विधाहरू</th>
                      <th>प्रकाशन मिति</th>
                      <th>पठन सङ्ख्या</th>
                      <th style={{ textAlign: 'right' }}>कार्य</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedArticles.length > 0 ? (
                      paginatedArticles.map((art) => {
                        const articleCats = art.categories && art.categories.length > 0 ? art.categories : [art.category];
                        return (
                          <tr key={art.id}>
                            <td style={{ width: '70px' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={art.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600'}
                                alt={art.title}
                                style={{ width: '54px', height: '38px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            </td>
                            <td style={{ fontWeight: 700, maxWidth: '300px' }}>
                              <Link href={`/news/${art.id}`} target="_blank" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                                {art.title}
                              </Link>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {articleCats.map((c, i) => (
                                  <span key={i} className="shadcn-badge shadcn-badge-outline" style={{ fontSize: '0.72rem' }}>
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{art.time || art.date || '२ घन्टा अघि'}</td>
                            <td style={{ fontWeight: 800, color: 'var(--brand-blue)' }}>{art.views || '१२०'} पटक पढिएको</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <Link
                                  href={`/news/${art.id}`}
                                  target="_blank"
                                  className="shadcn-btn shadcn-btn-secondary"
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                                >
                                  <Eye size={14} /> हेर्नुहोस्
                                </Link>
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="shadcn-btn shadcn-btn-destructive"
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                >
                                  <Trash2 size={14} /> हटाउनुहोस्
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          कुनै समाचार फेला परेन।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Bar */}
                <div className="shadcn-pagination">
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                    कुल <strong>{filteredArticles.length}</strong> समाचार मध्ये (पृष्ठ {articlePage} / {totalArticlePages})
                  </span>
                  <div className="shadcn-pagination-controls">
                    <button
                      onClick={() => setArticlePage((p) => Math.max(1, p - 1))}
                      disabled={articlePage === 1}
                      className="shadcn-page-btn"
                    >
                      ◄ अघिल्लो
                    </button>
                    <span style={{ padding: '0 8px', fontWeight: 800 }}>{articlePage}</span>
                    <button
                      onClick={() => setArticlePage((p) => Math.min(totalArticlePages, p + 1))}
                      disabled={articlePage >= totalArticlePages}
                      className="shadcn-page-btn"
                    >
                      पछिल्लो ►
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CREATE ARTICLE */}
          {activeTab === 'create' && (
            <div className="shadcn-card" style={{ padding: '28px', maxWidth: '880px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 className="shadcn-card-title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={20} style={{ color: 'var(--brand-orange)' }} /> नयाँ समाचार सिर्जना
                </h1>
                <p className="shadcn-card-description">एउटा समाचारका लागि बहु-विधाहरू चयन गर्नुहोस् र विस्तृत विवरण लेख्नुहोस्।</p>
              </div>

              <form onSubmit={handleCreateArticle} style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label className="shadcn-label">समाचारको मुख्य शीर्षक</label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="उदाहरण: त्रिशूली नदीको जलस्तर घट्यो..."
                    className="shadcn-input"
                  />
                </div>

                {/* MULTI-CATEGORY SELECTION PICKER */}
                <div>
                  <label className="shadcn-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} style={{ color: 'var(--brand-blue)' }} /> बहु-विधाहरू चयन गर्नुहोस्
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = selectedCreateCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCreateCategory(cat)}
                          className={`shadcn-btn ${isSelected ? 'shadcn-btn-primary' : 'shadcn-btn-outline'}`}
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.82rem',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '} {cat}
                        </button>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                    चयन गरिएका विधाहरू ({selectedCreateCategories.length}): <strong style={{ color: 'var(--brand-blue)' }}>{selectedCreateCategories.join(', ')}</strong>
                  </span>
                </div>

                <div>
                  <label className="shadcn-label">कभर तस्बिरको लिङ्क (URL)</label>
                  <input
                    name="imageUrl"
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    className="shadcn-input"
                  />
                </div>

                <div>
                  <label className="shadcn-label">छोटो सारांश</label>
                  <textarea
                    name="excerpt"
                    rows={2}
                    placeholder="समाचारको १-२ वाक्यको छोटो सार..."
                    className="shadcn-textarea"
                    required
                  />
                </div>

                <div>
                  <label className="shadcn-label">विस्तृत समाचार सामग्री</label>
                  <EasyMarkdownEditor
                    value={articleMarkdownContent}
                    onChange={setArticleMarkdownContent}
                    name="content"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" name="isExclusive" id="isExclusive" style={{ width: '18px', height: '18px' }} />
                  <label htmlFor="isExclusive" style={{ fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                    🌟 विशेष एक्सक्लुसिभ समाचार (मुख्य बक्समा देखाउने)
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} className="shadcn-btn shadcn-btn-primary" style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> {loading ? 'प्रकाशन हुँदैछ...' : 'समाचार प्रकाशित गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: BANNER ADS MANAGEMENT */}
          {activeTab === 'banners' && (
            <div>
              {/* Header Title & Action Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="shadcn-card-title" style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📢 विज्ञापन तथा ब्यानर व्यवस्थापन
                  </h1>
                  <p className="shadcn-card-description">
                    सनस्टार पोर्टलका सम्पूर्ण विज्ञापन स्थानहरू, पूर्वावलोकन र व्यवस्थापन।
                  </p>
                </div>
                <button
                  onClick={() => setIsAddBannerModalOpen(true)}
                  className="shadcn-btn shadcn-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> नयाँ विज्ञापन थप्नुहोस्
                </button>
              </div>

              {/* 1. POSITION DICTIONARY CARD */}
              <div className="shadcn-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 className="shadcn-card-title" style={{ fontSize: '1.15rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📌 ब्यानर रहने स्थानहरूको जानकारी
                </h3>
                <p className="shadcn-card-description" style={{ marginBottom: '18px' }}>
                  प्रत्येक ब्यानर स्थान साङ्केतिक कोड ले पोर्टलको कुन पाना र कुन स्थानमा विज्ञापन देखाउने जनाउँछ:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                  {BANNER_POSITIONS_INFO.map((pos) => (
                    <div
                      key={pos.keyword}
                      style={{
                        padding: '14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-main)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="shadcn-badge shadcn-badge-orange" style={{ fontFamily: 'monospace', fontWeight: 800 }}>
                          {pos.keyword}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--brand-blue)', fontWeight: 700 }}>
                          {pos.size}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
                        {pos.name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        पाना: {pos.page}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                        {pos.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. INTERACTIVE LIVE SITE PREVIEW SECTION */}
              <div className="shadcn-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 className="shadcn-card-title" style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      💻 ब्यानर पूर्वावलोकन
                    </h3>
                    <p className="shadcn-card-description">
                      विभिन्‍न मुख्य पानाहरूमा विज्ञापन ब्यानर कहाँ र कसरी देखिन्छन् भन्ने प्रत्यक्ष पूर्वावलोकन:
                    </p>
                  </div>

                  {/* Layout Sub-Tabs */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setBannerPreviewTab('home')}
                      className={`shadcn-btn ${bannerPreviewTab === 'home' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      🏠 गृहपृष्ठ पूर्वावलोकन
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerPreviewTab('post')}
                      className={`shadcn-btn ${bannerPreviewTab === 'post' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      📰 समाचार पाना पूर्वावलोकन
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerPreviewTab('rashifal')}
                      className={`shadcn-btn ${bannerPreviewTab === 'rashifal' ? 'shadcn-btn-primary' : 'shadcn-btn-secondary'}`}
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      🔮 दैनिक राशिफल पूर्वावलोकन
                    </button>
                  </div>
                </div>

                {/* PREVIEW CANVAS */}
                <div
                  style={{
                    border: '2px dashed var(--brand-orange)',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: 'var(--bg-main)',
                    maxWidth: '100%',
                    overflowX: 'auto',
                  }}
                >
                  {/* HOME PAGE PREVIEW CANVAS */}
                  {bannerPreviewTab === 'home' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '8px 16px', backgroundColor: '#0b1d33', color: '#FFF', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center' }}>
                        🌐 सनस्टार न्युज - गृहपृष्ठ
                      </div>

                      {/* Header Top Leaderboard */}
                      <AdBanner position="header-top" maxHeight="100px" />

                      {/* Hero Section Grid */}
                      <div className="dashboard-preview-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <span className="shadcn-badge shadcn-badge-orange">मुख्य समाचार खण्ड</span>
                          <h3 style={{ fontSize: '1rem', marginTop: '10px' }}>प्रधानमन्त्रीद्वारा देशबासीका नाममा विशेष सम्बोधन...</h3>
                        </div>
                        {/* Hero Right Sidebar Banner */}
                        <div>
                          <AdBanner position="hero-side" maxHeight="180px" />
                        </div>
                      </div>

                      {/* Mid Content 1 Banner */}
                      <AdBanner position="mid-content-1" maxHeight="100px" />

                      {/* Main Articles & Sticky Sidebar Grid */}
                      <div className="dashboard-preview-grid" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '14px' }}>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <span className="shadcn-badge shadcn-badge-outline">प्रदेश समाचार खण्ड</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>७ वटै प्रदेशका ताजा समाचार र गतिविधिहरू...</p>
                        </div>
                        {/* Sticky Sidebar Widget Banner */}
                        <div>
                          <AdBanner position="sidebar-widget" maxHeight="180px" />
                        </div>
                      </div>

                      {/* Mid Content 2 Banner */}
                      <AdBanner position="mid-content-2" maxHeight="100px" />

                      {/* Footer Top Leaderboard */}
                      <AdBanner position="footer-top" maxHeight="100px" />

                      <div style={{ padding: '12px', backgroundColor: '#081628', color: '#FFF', borderRadius: '6px', fontSize: '0.78rem', textAlign: 'center' }}>
                        © सनस्टार न्युज नेटवर्क - फुटर खण्ड
                      </div>
                    </div>
                  )}

                  {/* POST READER PAGE PREVIEW CANVAS */}
                  {bannerPreviewTab === 'post' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '8px 16px', backgroundColor: '#0b1d33', color: '#FFF', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center' }}>
                        📰 सनस्टार न्युज - समाचार वाचन पाना
                      </div>

                      {/* Header Top Leaderboard */}
                      <AdBanner position="header-top" maxHeight="100px" />

                      {/* 2-Column Article Reader Layout */}
                      <div className="dashboard-preview-grid" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '16px' }}>
                        {/* Main Article Body (70%) */}
                        <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <span className="shadcn-badge shadcn-badge-category" style={{ marginBottom: '8px' }}>राजनीति</span>
                          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '10px' }}>
                            प्रतिनिधिसभा बैठकमा बजेट माथि विस्तृत छलफल जारी
                          </h2>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                            प्रकाशन मिति: २०८१ भदौ २१ गते | सम्पादक: सनस्टार न्युज टोली
                          </div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800"
                            alt="News preview"
                            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '14px' }}
                          />
                          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                            काठमाडौँ — प्रतिनिधिसभाको आजको बैठकमा चालू आर्थिक वर्षको बजेट तथा कार्यक्रममाथि सांसदहरूले आफ्नो विचार राखिरहेका छन्...
                          </p>
                        </div>

                        {/* Right Sticky Sidebar (30%) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <span className="shadcn-badge shadcn-badge-orange" style={{ alignSelf: 'flex-start' }}>
                            दायाँ स्टिकी साइडबार
                          </span>

                          {/* Single News Sidebar Banner Position */}
                          <AdBanner position="single-news-sidebar" maxHeight="200px" />

                          {/* Secondary Sticky Sidebar Banner Position */}
                          <AdBanner position="sidebar-widget" maxHeight="180px" />

                          <div style={{ padding: '14px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '0 0 8px 0' }}>🔥 ताजा तथा लोकप्रिय समाचार</h4>
                            <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.78rem' }}>
                              <li>काठमाडौँ उपत्यकामा वायु प्रदूषण बढ्यो</li>
                              <li>नेपाल र भारतबीच उर्जा सम्झौता</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Footer Top Leaderboard */}
                      <AdBanner position="footer-top" maxHeight="100px" />

                      <div style={{ padding: '12px', backgroundColor: '#081628', color: '#FFF', borderRadius: '6px', fontSize: '0.78rem', textAlign: 'center' }}>
                        © सनस्टार न्युज नेटवर्क - फुटर खण्ड
                      </div>
                    </div>
                  )}

                  {/* RASHIFAL PAGE PREVIEW CANVAS */}
                  {bannerPreviewTab === 'rashifal' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '8px 16px', backgroundColor: '#0b1d33', color: '#FFF', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center' }}>
                        🔮 सनस्टार न्युज - दैनिक राशिफल पाना
                      </div>

                      {/* Header Top Leaderboard */}
                      <AdBanner position="header-top" maxHeight="100px" />

                      {/* Rashifal Top Leaderboard */}
                      <AdBanner position="rashifal-top" maxHeight="100px" />

                      {/* 12 Zodiac Grid & Sidebar */}
                      <div className="dashboard-preview-grid" style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '16px' }}>
                        <div style={{ padding: '18px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '8px' }}>✨ आजको १२ राशीको दैनिक भविष्यफल</h3>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>मेष, वृष, मिथुन, कर्कट, सिंह, कन्या, तुला, वृश्चिक, धनु, मकर, कुम्भ, मीन...</p>
                        </div>

                        <div>
                          <AdBanner position="sidebar-widget" maxHeight="180px" />
                        </div>
                      </div>

                      {/* Footer Top Leaderboard */}
                      <AdBanner position="footer-top" maxHeight="100px" />

                      <div style={{ padding: '12px', backgroundColor: '#081628', color: '#FFF', borderRadius: '6px', fontSize: '0.78rem', textAlign: 'center' }}>
                        © सनस्टार न्युज नेटवर्क - फुटर खण्ड
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. BANNERS MANAGEMENT TABLE */}
              <div className="shadcn-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 className="shadcn-card-title" style={{ fontSize: '1.15rem' }}>
                    📋 हालका विज्ञापन ब्यानरहरूको तालिका
                  </h3>

                  {/* Position Filter Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>स्थान अनुसार:</span>
                    <select
                      value={selectedPositionFilter}
                      onChange={(e) => setSelectedPositionFilter(e.target.value)}
                      className="shadcn-input"
                      style={{ maxWidth: '240px', padding: '6px 12px', fontSize: '0.82rem' }}
                    >
                      <option value="all">सबै स्थानहरू</option>
                      {BANNER_POSITIONS_INFO.map((pos) => (
                        <option key={pos.keyword} value={pos.keyword}>
                          {pos.name} ({pos.page})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="shadcn-table-container">
                  <table className="shadcn-table">
                    <thead>
                      <tr>
                        <th>ब्यानर तस्बिर</th>
                        <th>ब्यानर शीर्षक</th>
                        <th>ब्यानर स्थान</th>
                        <th>वेबसाइट लिङ्क</th>
                        <th>क्लिक सङ्ख्या</th>
                        <th>स्थिति</th>
                        <th style={{ textAlign: 'right' }}>कार्य</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bannersList.filter((b) => selectedPositionFilter === 'all' ? true : b.position === selectedPositionFilter).length > 0 ? (
                        bannersList
                          .filter((b) => selectedPositionFilter === 'all' ? true : b.position === selectedPositionFilter)
                          .map((banner) => (
                            <tr key={banner.id}>
                              <td style={{ width: '110px' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={banner.imageUrl}
                                  alt={banner.title}
                                  style={{ width: '100px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                />
                              </td>
                              <td style={{ fontWeight: 800 }}>{banner.title}</td>
                              <td>
                                <span className="shadcn-badge shadcn-badge-orange" style={{ fontFamily: 'monospace' }}>
                                  {banner.position}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {banner.targetUrl}
                              </td>
                              <td style={{ fontWeight: 900, color: 'var(--brand-blue)' }}>{banner.clicksCount || 0}</td>
                              <td><span className="shadcn-badge shadcn-badge-success">सक्रिय</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  onClick={() => handleDeleteBanner(banner.id)}
                                  className="shadcn-btn shadcn-btn-destructive"
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                >
                                  <Trash2 size={14} /> हटाउनुहोस्
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                            कुनै ब्यानर फेला परेन।
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RASHIFAL MANAGEMENT */}
          {activeTab === 'rashifal' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 className="shadcn-card-title" style={{ fontSize: '1.6rem' }}>🔮 दैनिक राशिफल व्यवस्थापन</h1>
                <p className="shadcn-card-description">१२ वटै राशीहरूको दैनिक, साप्ताहिक र मासिक भविष्यफल अद्यावधिक गर्नुहोस्।</p>
              </div>

              {/* 12 Rashifal Grid Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                {rashifalList.map((item) => (
                  <div key={item.id} className="shadcn-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image || `/images/zodiac/${item.id}.png`}
                          alt={item.sign}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                          {item.sign} ({item.latinName})
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                          {item.dateRange}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span className="shadcn-badge shadcn-badge-orange">रंग: {item.luckyColor}</span>
                      <span className="shadcn-badge shadcn-badge-default">अंक: {item.luckyNumber}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, height: '3.6em', overflow: 'hidden', marginBottom: '14px' }}>
                      {item.prediction}
                    </p>

                    <button
                      onClick={() => setEditingRashifal(item)}
                      className="shadcn-btn shadcn-btn-outline"
                      style={{ width: '100%', fontSize: '0.82rem', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit size={14} /> सम्पादन गर्नुहोस्
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: STAFF USERS */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="shadcn-card-title" style={{ fontSize: '1.6rem' }}>👥 कर्मचारी प्रयोगकर्ताहरू</h1>
                  <p className="shadcn-card-description">सनस्टार न्युज सम्पादकीय र प्राविधिक टोलीका प्रयोगकर्ता खाताहरू।</p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="shadcn-btn shadcn-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> नयाँ कर्मचारी थप्नुहोस्
                </button>
              </div>

              <div className="shadcn-table-container">
                <table className="shadcn-table">
                  <thead>
                    <tr>
                      <th>प्रयोगकर्ता</th>
                      <th>इमेल</th>
                      <th>भूमिका</th>
                      <th>स्थिति</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 800 }}>👨‍💼 सम्पादक प्रमुख</td>
                      <td>admin@sunstar.com</td>
                      <td><span className="shadcn-badge shadcn-badge-default">व्यवस्थापक</span></td>
                      <td><span className="shadcn-badge shadcn-badge-success">सक्रिय</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 800 }}>✍️ सीता श्रेष्ठ</td>
                      <td>sita@sunstar.com</td>
                      <td><span className="shadcn-badge shadcn-badge-orange">सम्पादक</span></td>
                      <td><span className="shadcn-badge shadcn-badge-success">सक्रिय</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: BHAKHARAI NEWS (tab=bhakharai) */}
          {activeTab === 'bhakharai' && (
            <div className="shadcn-card" style={{ padding: '28px', maxWidth: '880px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 className="shadcn-card-title" style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={22} style={{ color: '#E11D48' }} /> भर्खरै समाचार व्यवस्थापन (Breaking News Ticker)
                </h1>
                <p className="shadcn-card-description">
                  वेबसाइटको माथिल्लो पट्टी (Top Ticker Bar) मा निरन्तर चल्ने भर्खरैका मुख्य ताजा समाचारहरू व्यवस्थापन गर्नुहोस्।
                </p>
              </div>

              <form onSubmit={handleUpdateBreakingNews} style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label className="shadcn-label" style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔥 भर्खरै समाचार विवरण (प्रत्येक नयाँ हरफमा एउटा समाचार):
                  </label>
                  <textarea
                    rows={8}
                    value={breakingNewsText}
                    onChange={(e) => setBreakingNewsText(e.target.value)}
                    placeholder="१. यहाँ पहिलो भर्खरै समाचार लेख्नुहोस्...&#10;२. यहाँ दोस्रो भर्खरै समाचार लेख्नुहोस्...&#10;३. यहाँ तेस्रो भर्खरै समाचार लेख्नुहोस्..."
                    className="shadcn-textarea"
                    style={{
                      width: '100%',
                      fontSize: '0.98rem',
                      lineHeight: 1.7,
                      fontFamily: 'inherit',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      border: '1.5px solid var(--border-color)',
                    }}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                    💡 सुझाव: प्रत्येक हरफ (Line Break) ले नयाँ भर्खरै समाचार सिर्जना गर्दछ। टिकर बारमा यी समाचारहरू पालैपालो निरन्तर चल्नेछन्।
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    className="shadcn-btn shadcn-btn-primary"
                    style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Zap size={18} /> भर्खरै समाचार अद्यावधिक गर्नुहोस्
                  </button>
                </div>
              </form>

              {/* LIVE TICKER PREVIEW BOX */}
              <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-orange)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} /> टिकर बार प्रत्यक्ष पूर्वावलोकन (Live Website Ticker Preview):
                </h4>

                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="shadcn-badge shadcn-badge-destructive" style={{ backgroundColor: '#E11D48', color: '#FFF', padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      🔴 भर्खरै
                    </span>
                    <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '0.88rem', fontWeight: 700 }}>
                      {breakingNewsText.split('\n').filter(Boolean).map((item, idx) => (
                        <span key={idx} style={{ marginRight: '24px', color: 'var(--text-primary)' }}>
                          🔥 {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT RASHIFAL MODAL */}
      {editingRashifal && (
        <div className="shadcn-modal-overlay" onClick={() => setEditingRashifal(null)}>
          <div className="shadcn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shadcn-modal-header">
              <h3 className="shadcn-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: 'var(--brand-orange)' }} /> {editingRashifal.sign} राशी सम्पादन
              </h3>
              <button onClick={() => setEditingRashifal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveRashifalPrediction}>
              <div className="shadcn-modal-body" style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '50%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editingRashifal.image || `/images/zodiac/${editingRashifal.id}.png`} alt={editingRashifal.sign} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 900 }}>{editingRashifal.sign} ({editingRashifal.latinName})</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{editingRashifal.dateRange}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="shadcn-label">शुभ रंग</label>
                    <input
                      value={editingRashifal.luckyColor || ''}
                      onChange={(e) => setEditingRashifal({ ...editingRashifal, luckyColor: e.target.value })}
                      className="shadcn-input"
                    />
                  </div>
                  <div>
                    <label className="shadcn-label">शुभ अंक</label>
                    <input
                      value={editingRashifal.luckyNumber || ''}
                      onChange={(e) => setEditingRashifal({ ...editingRashifal, luckyNumber: e.target.value })}
                      className="shadcn-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="shadcn-label">आजको दैनिक भविष्यफल</label>
                  <textarea
                    rows={4}
                    value={editingRashifal.prediction || ''}
                    onChange={(e) => setEditingRashifal({ ...editingRashifal, prediction: e.target.value })}
                    className="shadcn-textarea"
                    required
                  />
                </div>
              </div>
              <div className="shadcn-modal-footer">
                <button type="button" onClick={() => setEditingRashifal(null)} className="shadcn-btn shadcn-btn-secondary">रद्द गर्नुहोस्</button>
                <button type="submit" className="shadcn-btn shadcn-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Edit size={15} /> विवरण सेभ गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BANNER MODAL */}
      {isAddBannerModalOpen && (
        <div className="shadcn-modal-overlay" onClick={() => setIsAddBannerModalOpen(false)}>
          <div className="shadcn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shadcn-modal-header">
              <h3 className="shadcn-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} style={{ color: 'var(--brand-orange)' }} /> नयाँ विज्ञापन ब्यानर थप्नुहोस्
              </h3>
              <button onClick={() => setIsAddBannerModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateBanner}>
              <div className="shadcn-modal-body" style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="shadcn-label">विज्ञापन ब्यानर शीर्षक</label>
                  <input name="title" required placeholder="उदाहरण: एनएमबी बैंक ३००x२५० साइडबार" className="shadcn-input" />
                </div>
                <div>
                  <label className="shadcn-label">ब्यानर रहने स्थान</label>
                  <select name="position" required className="shadcn-input">
                    {BANNER_POSITIONS_INFO.map((pos) => (
                      <option key={pos.keyword} value={pos.keyword}>
                        {pos.name} ({pos.page})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="shadcn-label">तस्बिरको लिङ्क (URL)</label>
                  <input name="imageUrl" type="url" required placeholder="https://assets-cdn.ekantipur.com/..." className="shadcn-input" />
                </div>
                <div>
                  <label className="shadcn-label">वेबसाइट लिङ्क</label>
                  <input name="targetUrl" type="url" placeholder="https://example.com" className="shadcn-input" />
                </div>
              </div>
              <div className="shadcn-modal-footer">
                <button type="button" onClick={() => setIsAddBannerModalOpen(false)} className="shadcn-btn shadcn-btn-secondary">रद्द गर्नुहोस्</button>
                <button type="submit" disabled={loading} className="shadcn-btn shadcn-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> ब्यानर प्रकाशित गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STAFF USER MODAL */}
      {isAddUserModalOpen && (
        <div className="shadcn-modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="shadcn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shadcn-modal-header">
              <h3 className="shadcn-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'var(--brand-orange)' }} /> नयाँ कर्मचारी थप्नुहोस्
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="shadcn-modal-body" style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="shadcn-label">पुरा नाम</label>
                  <input name="name" required placeholder="राम श्रेष्ठ" className="shadcn-input" />
                </div>
                <div>
                  <label className="shadcn-label">इमेल</label>
                  <input name="email" type="email" required placeholder="ram@sunstar.com" className="shadcn-input" />
                </div>
                <div>
                  <label className="shadcn-label">भूमिका</label>
                  <select name="role" required className="shadcn-input">
                    <option value="Editor">सम्पादक</option>
                    <option value="Reporter">संवाददाता</option>
                    <option value="Admin">व्यवस्थापक</option>
                  </select>
                </div>
                <div>
                  <label className="shadcn-label">पासवर्ड</label>
                  <input name="password" type="password" required minLength={6} className="shadcn-input" />
                </div>
              </div>
              <div className="shadcn-modal-footer">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="shadcn-btn shadcn-btn-secondary">रद्द गर्नुहोस्</button>
                <button type="submit" disabled={loading} className="shadcn-btn shadcn-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> प्रयोगकर्ता सिर्जना गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <FileText size={40} style={{ color: 'var(--brand-orange)', marginBottom: '12px' }} />
          <p style={{ fontWeight: 800 }}>व्यवस्थापक ड्यासबोर्ड लोड हुँदैछ...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
