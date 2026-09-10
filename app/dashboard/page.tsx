'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Upload,
  Switch,
  Space,
  Popconfirm,
  Badge,
  Typography,
  Divider,
  Tooltip,
  UploadFile,
} from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  PlusOutlined,
  PictureOutlined,
  UserOutlined,
  ThunderboltOutlined,
  BookOutlined,
  LogoutOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  GlobalOutlined,
  LinkOutlined,
  FileMarkdownOutlined,
  CommentOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import toast from 'react-hot-toast';

import { logoutAction } from '@/app/actions/auth';
import { createArticleAction, deleteArticleAction, createStaffUserAction, createBannerAction, deleteBannerAction } from '@/app/actions/dashboard';
import SUNSTAR_DATA, { BannerAd, RashifalItem } from '@/lib/data';
import EasyMarkdownEditor from '@/components/organisms/EasyMarkdownEditor';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

type TabType = 'overview' | 'articles' | 'create' | 'banners' | 'users' | 'rashifal' | 'bhakharai';

const BANNER_POSITIONS_INFO = [
  { keyword: 'header-top', name: 'मुख्य माथिल्लो ब्यानर', size: '७२८ x ९० px', page: 'गृहपृष्ठ / सबै पाना' },
  { keyword: 'hero-side', name: 'मुख्य समाचार दायाँ ब्यानर', size: '३०० x २५० px', page: 'गृहपृष्ठ' },
  { keyword: 'mid-content-1', name: 'मुख्य सामग्री बीचको ब्यानर', size: '७२८ x ९० px', page: 'गृहपृष्ठ' },
  { keyword: 'mid-content-2', name: 'प्रदेश समाचार बीचको ब्यानर', size: '७२८ x ९० px', page: 'गृहपृष्ठ' },
  { keyword: 'sidebar-widget', name: 'दायाँ स्टिकी ब्यानर', size: '३०० x २५० px', page: 'गृहपृष्ठ साइडबार' },
  { keyword: 'single-news-sidebar', name: 'समाचार पाना दायाँ ब्यानर', size: '३०० x २५० px', page: 'समाचार पाना' },
  { keyword: 'rashifal-top', name: 'राशिफल माथिल्लो ब्यानर', size: '७२८ x ९० px', page: 'राशिफल पाना' },
  { keyword: 'footer-top', name: 'फुटर माथिल्लो ब्यानर', size: '७२८ x ९० px', page: 'सबै पाना' },
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

async function parseJsonResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('API response parse error (non-JSON):', res.status, text.substring(0, 200));
    return {
      success: false,
      error: res.ok ? 'अमान्य प्रतिक्रिया' : `सर्भरमा त्रुटि भयो (Status ${res.status})`,
    };
  }
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get('tab') as TabType) || 'overview';
  const [activeTab, setActiveTab] = useState<TabType>(tabParam);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync tab with URL query string
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['overview', 'articles', 'create', 'banners', 'users', 'rashifal', 'bhakharai'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabType);
    router.push(`/dashboard?tab=${key}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedCreateCategories, setSelectedCreateCategories] = useState<string[]>(['मुख्य समाचार']);
  const [loading, setLoading] = useState(false);
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(true);

  // Dynamic Dashboard State
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [bannersList, setBannersList] = useState<BannerAd[]>(SUNSTAR_DATA.banners || []);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rashifalList, setRashifalList] = useState<RashifalItem[]>(SUNSTAR_DATA.rashifal || []);
  const [breakingNewsText, setBreakingNewsText] = useState<string>(
    (SUNSTAR_DATA.breakingNews || []).join('\n')
  );
  const [statsData, setStatsData] = useState<any>({
    totalArticles: 0,
    totalBanners: 0,
    activeBanners: 0,
    totalUsers: 0,
    totalViews: '१,२५,४००+',
    monthlyVisitors: '४५,०००+',
  });

  // Antd Upload File Lists
  const [articleFileList, setArticleFileList] = useState<UploadFile[]>([]);
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);

  // Markdown State for Article Form
  const [articleMarkdownContent, setArticleMarkdownContent] = useState('');

  // Modals State
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditArticleModalOpen, setIsEditArticleModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedArticleForComments, setSelectedArticleForComments] = useState<any | null>(null);
  const [newAdminCommentText, setNewAdminCommentText] = useState('');
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [editArticleMarkdown, setEditArticleMarkdown] = useState('');
  const [editArticleFileList, setEditArticleFileList] = useState<UploadFile[]>([]);
  const [editArticleCategory, setEditArticleCategory] = useState('मुख्य समाचार');
  const [selectedPositionForNewBanner, setSelectedPositionForNewBanner] = useState<string>('header-top');
  const [selectedUserRole, setSelectedUserRole] = useState<string>('Editor');

  // Editable Likes in Comments Modal
  const [editLikesInputValue, setEditLikesInputValue] = useState<number>(12);
  const [isSavingLikes, setIsSavingLikes] = useState(false);

  // Existing images list for edit modal (deletable)
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);

  function handleRemoveExistingImage(idx: number) {
    setEditExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSaveEditedLikes() {
    if (!selectedArticleForComments) return;
    setIsSavingLikes(true);
    const toastId = toast.loading('लाइक्स सुरक्षित गर्दैछ...');
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-likes',
          articleId: selectedArticleForComments.id,
          likesCount: editLikesInputValue,
        }),
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        toast.error(data.error || 'लाइक्स सुरक्षित गर्न सकिएन', { id: toastId });
      } else {
        toast.success('लाइक्स सफलतापूर्वक अद्यावधिक भयो!', { id: toastId });
        setSelectedArticleForComments({ ...selectedArticleForComments, likesCount: editLikesInputValue });
        fetchDashboardData();
      }
    } catch (err: any) {
      toast.error('त्रुटि भयो: ' + err.message, { id: toastId });
    } finally {
      setIsSavingLikes(false);
    }
  }

  function handleOpenCommentsModal(record: any) {
    setSelectedArticleForComments(record);
    setEditLikesInputValue(typeof record.likesCount === 'number' ? record.likesCount : 12);
    setIsCommentsModalOpen(true);
  }

  async function handleDeleteComment(articleId: string, commentId: string) {
    const toastId = toast.loading('प्रतिक्रिया हटाइँदैछ...');
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-comment', articleId, commentId }),
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        toast.error(data.error || 'हटाइएन', { id: toastId });
      } else {
        toast.success('प्रतिक्रिया हटाइयो!', { id: toastId });
        if (selectedArticleForComments) {
          const updatedList = (selectedArticleForComments.commentsList || []).filter((c: any) => c.id !== commentId);
          setSelectedArticleForComments({
            ...selectedArticleForComments,
            commentsList: updatedList,
            commentsCount: updatedList.length,
          });
        }
        fetchDashboardData();
      }
    } catch (err: any) {
      toast.error('त्रुटि भयो', { id: toastId });
    }
  }

  async function handleAddAdminComment() {
    if (!newAdminCommentText.trim() || !selectedArticleForComments) return;
    const toastId = toast.loading('प्रतिक्रिया राखिँदैछ...');
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-comment',
          articleId: selectedArticleForComments.id,
          name: 'सनस्टार व्यवस्थापक (Admin)',
          text: newAdminCommentText.trim(),
        }),
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        toast.error(data.error || 'राख्न सकिएन', { id: toastId });
      } else {
        toast.success('प्रतिक्रिया राखियो!', { id: toastId });
        setNewAdminCommentText('');
        fetchDashboardData();
        setIsCommentsModalOpen(false);
      }
    } catch (err: any) {
      toast.error('त्रुटि भयो', { id: toastId });
    }
  }

  // Fetch API Dashboard Data
  async function fetchDashboardData(showSuccessToast: boolean = false) {
    setIsFetchingDashboard(true);
    try {
      const res = await fetch(`/api/dashboard?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        toast.error(data.error || `GET API त्रुटि (${res.status}): डेटा लोड गर्न सकिएन`);
      } else {
        setArticlesList(data.articles || []);
        setBannersList(data.banners || []);
        setUsersList(data.users || []);
        if (data.rashifal) setRashifalList(data.rashifal);
        if (data.breakingNews && Array.isArray(data.breakingNews)) {
          setBreakingNewsText(data.breakingNews.join('\n'));
        }
        if (data.stats) setStatsData(data.stats);
        if (showSuccessToast) {
          toast.success('ड्यासबोर्ड तथ्याङ्क सफलतापूर्वक अद्यावधिक भयो!');
        }
      }
    } catch (err: any) {
      console.warn('Dashboard fetch warning:', err);
      toast.error('GET API त्रुटि: ' + (err.message || 'सर्भर वा सञ्जाल सम्पर्कमा त्रुटि'));
    } finally {
      setIsFetchingDashboard(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handlers
  async function handleSaveBreakingNews() {
    const toastId = toast.loading('भर्खरै समाचार अद्यावधिक हुँदैछ...');
    setLoading(true);
    try {
      const lines = breakingNewsText.split('\n').filter((l) => l.trim().length > 0);
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-breaking-news', breakingNews: lines, items: lines }),
      });
      const data = await parseJsonResponse(res);
      setLoading(false);
      if (!res.ok || !data.success) {
        toast.error(data.error || 'अद्यावधिक गर्न सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'भर्खरै समाचार सफलतापूर्वक अद्यावधिक भयो!', { id: toastId });
        fetchDashboardData();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error('त्रुटि भयो: ' + err.message, { id: toastId });
    }
  }

  async function handleCreateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading('नयाँ समाचार थपिँदैछ...');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('actionType', 'create-article');
      formData.set('content', articleMarkdownContent);
      formData.set('summary', (formData.get('excerpt') as string) || (formData.get('summary') as string) || '');
      formData.set('category', selectedCreateCategories[0] || 'मुख्य समाचार');
      formData.set('categories', JSON.stringify(selectedCreateCategories));

      // Append multiple files from Antd Upload
      articleFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('imageFiles', file.originFileObj);
        }
      });

      const res = await fetch('/api/dashboard', {
        method: 'POST',
        body: formData,
      });
      const data = await parseJsonResponse(res);
      setLoading(false);

      if (!res.ok || !data.success) {
        toast.error(data.error || 'समाचार थप्न सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'समाचार सफलतापूर्वक थपियो!', { id: toastId });
        (e.target as HTMLFormElement).reset();
        setArticleMarkdownContent('');
        setArticleFileList([]);
        setSelectedCreateCategories(['मुख्य समाचार']);
        handleTabChange('articles');
        await fetchDashboardData();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error('त्रुटि भयो: ' + err.message, { id: toastId });
    }
  }

  async function handleDeleteArticle(id: string) {
    const toastId = toast.loading('समाचार हटाइँदैछ...');
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-article', id }),
      });
      const data = await parseJsonResponse(res);

      if (!res.ok || !data.success) {
        toast.error(data.error || 'समाचार हटाउन सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'समाचार हटाइयो!', { id: toastId });
        fetchDashboardData();
      }
    } catch (err: any) {
      toast.error('त्रुटि भयो', { id: toastId });
    }
  }

  function handleOpenEditModal(record: any) {
    setEditingArticle(record);
    setEditArticleMarkdown(record.content || record.summary || '');
    setEditArticleCategory(record.category || 'मुख्य समाचार');
    setEditArticleFileList([]);
    // Populate existing images
    const imgs: string[] = Array.isArray(record.images) && record.images.length > 0
      ? record.images
      : record.image ? [record.image] : [];
    setEditExistingImages(imgs);
    setIsEditArticleModalOpen(true);
  }

  async function handleUpdateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingArticle) return;

    const toastId = toast.loading('समाचार अद्यावधिक हुँदैछ...');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('actionType', 'update-article');
      formData.set('id', editingArticle.id);
      formData.set('content', editArticleMarkdown);
      formData.set('category', editArticleCategory);
      formData.set('summary', (formData.get('excerpt') as string) || (formData.get('summary') as string) || '');
      formData.set('existingImageUrl', editingArticle.image || '');

      editArticleFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('imageFiles', file.originFileObj);
        }
      });

      const res = await fetch('/api/dashboard', {
        method: 'POST',
        body: formData,
      });
      const data = await parseJsonResponse(res);
      setLoading(false);

      if (!res.ok || !data.success) {
        toast.error(data.error || 'अद्यावधिक गर्न सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'समाचार अद्यावधिक भयो!', { id: toastId });
        setIsEditArticleModalOpen(false);
        setEditingArticle(null);
        await fetchDashboardData();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error('त्रुटि भयो: ' + err.message, { id: toastId });
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading('कर्मचारी प्रयोगकर्ता सिर्जना हुँदैछ...');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('actionType', 'create-user');

      avatarFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('avatarFiles', file.originFileObj);
        }
      });

      const res = await fetch('/api/dashboard', {
        method: 'POST',
        body: formData,
      });
      const data = await parseJsonResponse(res);
      setLoading(false);

      if (!res.ok || !data.success) {
        toast.error(data.error || 'कर्मचारी सिर्जना गर्न सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'नयाँ कर्मचारी प्रयोगकर्ता सिर्जना गरियो!', { id: toastId });
        (e.target as HTMLFormElement).reset();
        setAvatarFileList([]);
        setIsAddUserModalOpen(false);
        fetchDashboardData();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error('त्रुटि भयो: ' + err.message, { id: toastId });
    }
  }

  async function handleCreateBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading('विज्ञापन ब्यानर प्रकाशित हुँदैछ...');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('actionType', 'create-banner');

      bannerFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('bannerFiles', file.originFileObj);
        }
      });

      const res = await fetch('/api/dashboard', {
        method: 'POST',
        body: formData,
      });
      const data = await parseJsonResponse(res);
      setLoading(false);

      if (!res.ok || !data.success) {
        toast.error(data.error || 'ब्यानर प्रकाशित गर्न सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'नयाँ विज्ञापन ब्यानर सफलताका साथ प्रकाशित भयो!', { id: toastId });
        (e.target as HTMLFormElement).reset();
        setBannerFileList([]);
        setIsAddBannerModalOpen(false);
        fetchDashboardData();
      }
    } catch (err: any) {
      setLoading(false);
      toast.error('त्रुटि भयो: ' + err.message, { id: toastId });
    }
  }

  async function handleDeleteBanner(id: string) {
    const toastId = toast.loading('ब्यानर हटाइँदैछ...');
    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-banner', id }),
      });
      const data = await parseJsonResponse(res);

      if (!res.ok || !data.success) {
        toast.error(data.error || 'ब्यानर हटाउन सकिएन', { id: toastId });
      } else {
        toast.success(data.message || 'विज्ञापन ब्यानर हटाइयो!', { id: toastId });
        fetchDashboardData();
      }
    } catch (err: any) {
      toast.error('त्रुटि भयो', { id: toastId });
    }
  }

  // Filtered Articles
  const filteredArticles = articlesList.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.category && art.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat =
      selectedCategoryFilter === 'all' ||
      (art.category && art.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
    return matchSearch && matchCat;
  });

  // Category Tag Toggle for Article Creation
  const toggleCreateCategory = (cat: string) => {
    if (selectedCreateCategories.includes(cat)) {
      if (selectedCreateCategories.length > 1) {
        setSelectedCreateCategories(selectedCreateCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCreateCategories([...selectedCreateCategories, cat]);
    }
  };

  // Ant Design Table Columns for Articles
  const articleTableColumns = [
    {
      title: 'তस्बिर',
      dataIndex: 'image',
      key: 'image',
      render: (img: string) => (
        <img
          src={img || '/assets/sunstar-logo.jpg'}
          alt="Cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/assets/sunstar-logo.jpg'; }}
          className={styles.articleThumb}
        />
      ),
    },
    {
      title: 'शीर्षक',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <div className={styles.articleTitle} style={{ maxWidth: 280 }}>{text}</div>
          <div className={styles.articleMeta}>{record.author || 'सनस्टार संवाददाता'} &middot; {record.time || 'भर्खरै'}</div>
        </div>
      ),
    },
    {
      title: 'विधा',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => (
        <Tag className={styles.tagCategory}>{cat || 'मुख्य समाचार'}</Tag>
      ),
    },
    {
      title: 'लाइक्स र प्रतिक्रिया',
      key: 'interactions',
      render: (_: any, record: any) => {
        const likes = record.likesCount ?? 48;
        const commentsArr = Array.isArray(record.commentsList) ? record.commentsList : [];
        return (
        <Space size={4} direction="vertical">
          <Text style={{ fontSize: '0.85rem', color: '#ff7875', fontWeight: 700 }}>
            ❤️ {likes}
          </Text>
          <Button
            type="link"
            size="small"
            icon={<CommentOutlined />}
            style={{ padding: 0, fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)', height: 'auto' }}
            onClick={() => handleOpenCommentsModal(record)}
          >
            💬 {commentsArr.length}
          </Button>
        </Space>
        );
      },
    },
    {
      title: 'कार्य',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size={4}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            style={{ background: '#fa8c16', border: 'none', borderRadius: 6 }}
            onClick={() => handleOpenEditModal(record)}
          />
          <Button
            icon={<CommentOutlined />}
            size="small"
            style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6 }}
            onClick={() => handleOpenCommentsModal(record)}
          />
          <Link href={`/news/${record.id}`} target="_blank">
            <Button
              icon={<EyeOutlined />}
              size="small"
              style={{ background: 'rgba(24,144,255,0.1)', border: '1px solid rgba(24,144,255,0.2)', color: '#1890ff', borderRadius: 6 }}
            />
          </Link>
          <Popconfirm
            title="समाचार हटाउनुहोस्?"
            onConfirm={() => handleDeleteArticle(record.id)}
            okText="हटाउनुहोस्"
            cancelText="रद्द"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              style={{ borderRadius: 6 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.dashRoot}>
      {/* Sidebar Navigation */}
      {!mobileMenuOpen && (
        <div
          className={styles.sidebar}
          style={{ width: collapsed ? 80 : 255, transition: 'width 0.25s ease' }}
        >
          <div className={styles.sidebarLogo}>
            <span className={styles.logoText}>
              {collapsed ? '☀️' : '☀️ सनस्टार न्युज'}
            </span>
            {!collapsed && <span className={styles.logoSubtext}>Admin Dashboard v2.0</span>}
          </div>

          <div className={styles.sideMenuWrap}>
            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              onClick={({ key }) => handleTabChange(key)}
              className={styles.sideMenu}
              inlineCollapsed={collapsed}
              style={{ border: 'none' }}
              items={[
                { key: 'overview', icon: <DashboardOutlined />, label: 'मुख्य ड्यासबोर्ड' },
                { key: 'articles', icon: <FileTextOutlined />, label: 'समाचार सूची' },
                { key: 'create', icon: <PlusOutlined />, label: 'नयाँ समाचार' },
                { key: 'banners', icon: <PictureOutlined />, label: 'विज्ञापन ब्यानर' },
                { key: 'users', icon: <UserOutlined />, label: 'कर्मचारी' },
                { key: 'bhakharai', icon: <ThunderboltOutlined />, label: 'भर्खरै टिकर' },
                { key: 'rashifal', icon: <BookOutlined />, label: 'दैनिक राशिफल' },
              ]}
            />
          </div>

          <div className={styles.logoutWrap}>
            <form action={logoutAction}>
              <button type="submit" className={styles.logoutBtn}>
                <LogoutOutlined />
                {!collapsed && <span>लगआउट</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.mobileDrawerOverlay} ${mobileMenuOpen ? styles.mobileDrawerOverlayVisible : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.sidebarLogo} style={{ paddingTop: 20 }}>
          <span className={styles.logoText}>☀️ सनस्टार न्युज</span>
          <span className={styles.logoSubtext}>Admin Dashboard</span>
        </div>
        <div className={styles.sideMenuWrap} style={{ flex: 1 }}>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => { handleTabChange(key); setMobileMenuOpen(false); }}
            className={styles.sideMenu}
            style={{ border: 'none' }}
            items={[
              { key: 'overview', icon: <DashboardOutlined />, label: 'मुख्य ड्यासबोर्ड' },
              { key: 'articles', icon: <FileTextOutlined />, label: 'समाचार सूची' },
              { key: 'create', icon: <PlusOutlined />, label: 'नयाँ समाचार' },
              { key: 'banners', icon: <PictureOutlined />, label: 'विज्ञापन ब्यानर' },
              { key: 'users', icon: <UserOutlined />, label: 'कर्मचारी' },
              { key: 'bhakharai', icon: <ThunderboltOutlined />, label: 'भर्खरै टिकर' },
              { key: 'rashifal', icon: <BookOutlined />, label: 'दैनिक राशिफल' },
            ]}
          />
        </div>
        <div className={styles.logoutWrap}>
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn}>
              <LogoutOutlined /> <span>लगआउट</span>
            </button>
          </form>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className={styles.mainArea}>
        {/* Header */}
        <div className={styles.header}>
          <Space size={8}>
            {/* Collapse toggle — desktop */}
            <button
              className={styles.collapseToggle}
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'साइडबार खोल्नुहोस्' : 'साइडबार घटाउनुहोस्'}
            >
              {collapsed ? '≡' : '☰'}
            </button>
            {/* Hamburger — mobile */}
            <button
              className={styles.menuToggle}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <Title level={5} className={styles.headerTitle}>
              {activeTab === 'overview' && '📊 मुख्य ड्यासबोर्ड'}
              {activeTab === 'articles' && '📰 समाचार सूची'}
              {activeTab === 'create' && '✍️ नयाँ समाचार सिर्जना'}
              {activeTab === 'banners' && '🖼️ विज्ञापन ब्यानर'}
              {activeTab === 'users' && '👥 कर्मचारी व्यवस्थापन'}
              {activeTab === 'bhakharai' && '⚡ भर्खरै टिकर'}
              {activeTab === 'rashifal' && '🔮 दैनिक राशिफल'}
            </Title>
          </Space>
          <Space>
            <Link href="/" target="_blank">
              <Button className={styles.btnGhost} icon={<GlobalOutlined />}>वेबसाइट</Button>
            </Link>
            <Button
              className={styles.btnPrimary}
              icon={<ReloadOutlined />}
              onClick={() => fetchDashboardData(true)}
              loading={isFetchingDashboard}
            >
              रिफ्रेस
            </Button>
          </Space>
        </div>

        {/* Scrollable content */}
        <div className={styles.contentScroll}>
          <div className={styles.contentInner}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Stat Cards */}
              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.fadeUp}`} style={{ '--card-color': 'rgba(24,144,255,0.12)' } as React.CSSProperties}>
                  <span className={styles.statIcon}>📰</span>
                  <div className={styles.statValue}>{statsData.totalArticles}</div>
                  <div className={styles.statLabel}>जम्मा समाचार</div>
                  <span className={`${styles.statTrend} ${styles.trendUp}`}>Live</span>
                </div>
                <div className={`${styles.statCard} ${styles.fadeUp}`} style={{ '--card-color': 'rgba(82,196,26,0.12)' } as React.CSSProperties}>
                  <span className={styles.statIcon}>🖼️</span>
                  <div className={styles.statValue}>{statsData.activeBanners}</div>
                  <div className={styles.statLabel}>सक्रिय ब्यानर</div>
                </div>
                <div className={`${styles.statCard} ${styles.fadeUp}`} style={{ '--card-color': 'rgba(250,140,22,0.12)' } as React.CSSProperties}>
                  <span className={styles.statIcon}>👥</span>
                  <div className={styles.statValue}>{statsData.totalUsers}</div>
                  <div className={styles.statLabel}>कर्मचारी</div>
                </div>
                <div className={`${styles.statCard} ${styles.fadeUp}`} style={{ '--card-color': 'rgba(235,47,150,0.12)' } as React.CSSProperties}>
                  <span className={styles.statIcon}>👁️</span>
                  <div className={styles.statValue}>{statsData.totalViews}</div>
                  <div className={styles.statLabel}>जम्मा भ्युज</div>
                  <span className={`${styles.statTrend} ${styles.trendUp}`}>↑</span>
                </div>
                <div className={`${styles.statCard} ${styles.fadeUp}`} style={{ '--card-color': 'rgba(114,46,209,0.12)' } as React.CSSProperties}>
                  <span className={styles.statIcon}>⚡</span>
                  <div className={styles.statValue}>{statsData.monthlyVisitors}</div>
                  <div className={styles.statLabel}>मासिक पाठक</div>
                </div>
              </div>

              {/* Quick Breaking News */}
              <div style={{ background: 'rgba(255,77,79,0.06)', border: '1px solid rgba(255,77,79,0.2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <Text strong style={{ color: '#ff7875', fontSize: '0.95rem' }}>भर्खरै समाचार छिटो अद्यावधिक</Text>
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', display: 'block', marginBottom: 10 }}>
                  वेबसाइटको माथिल्लो पट्टीमा चल्ने ताजा समाचारहरू (प्रत्येक हरफमा एउटा):
                </Text>
                <Input.TextArea
                  rows={3}
                  value={breakingNewsText}
                  onChange={(e) => setBreakingNewsText(e.target.value)}
                  placeholder="१. मुख्य ताजा समाचार...&#10;२. दोस्रो ताजा समाचार..."
                  style={{ marginBottom: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,77,79,0.2)', color: 'rgba(255,255,255,0.85)', borderRadius: 8 }}
                />
                <Button
                  type="primary"
                  danger
                  icon={<ThunderboltOutlined />}
                  onClick={handleSaveBreakingNews}
                  loading={loading}
                  style={{ borderRadius: 8 }}
                >
                  भर्खरै समाचार अद्यावधिक गर्नुहोस्
                </Button>
              </div>

              {/* Recent Articles Preview */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ color: '#fff', fontSize: '0.95rem' }}>📰 हालै प्रकाशित समाचारहरू</Text>
                  <Button size="small" className={styles.btnGhost} onClick={() => handleTabChange('articles')}>सबै हेर्नुहोस्</Button>
                </div>
                <div className={styles.darkTable}>
                  <Table
                    dataSource={articlesList.slice(0, 5)}
                    columns={articleTableColumns}
                    rowKey="id"
                    pagination={false}
                    loading={isFetchingDashboard}
                    size="small"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES LIST */}
          {activeTab === 'articles' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text strong style={{ color: '#fff', fontSize: '1.05rem' }}>📰 समाचार सूची तथा व्यवस्थापन</Text>
                <Button className={styles.btnPrimary} icon={<PlusOutlined />} onClick={() => handleTabChange('create')}>
                  नयाँ समाचार
                </Button>
              </div>

              {/* Filters */}
              <div className={styles.filterBar}>
                <Input
                  placeholder="शीर्षक वा विधा खोज्नुहोस्..."
                  prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', borderRadius: 8 }}
                />
                <Select
                  style={{ minWidth: 200 }}
                  value={selectedCategoryFilter}
                  onChange={(val) => setSelectedCategoryFilter(val)}
                  dropdownStyle={{ background: '#1a1d26', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <Option value="all">सबै विधाहरू</Option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  {filteredArticles.length} समाचार
                </Text>
              </div>

              <div className={styles.darkTable}>
                <Table
                  dataSource={filteredArticles}
                  columns={articleTableColumns}
                  rowKey="id"
                  pagination={{ pageSize: 8, style: { padding: '16px 0' } }}
                  loading={isFetchingDashboard}
                />
              </div>
            </div>
          )}

          {/* TAB 3: CREATE ARTICLE */}
          {activeTab === 'create' && (
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <Title level={3} style={{ marginBottom: 8 }}>✍️ नयाँ समाचार सिर्जना</Title>
              <Paragraph type="secondary">एउटा समाचारका लागि बहु-विधाहरू चयन गर्नुहोस् र विस्तृत विवरण लेख्नुहोस्।</Paragraph>

              <form onSubmit={handleCreateArticle}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>समाचारको मुख्य शीर्षक</Text>
                    <Input name="title" required placeholder="उदाहरण: त्रिशूली नदीको जलस्तर घट्यो..." size="large" />
                  </div>

                  {/* Multi-Category Selector */}
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>🏷️ बहु-विधाहरू चयन गर्नुहोस्</Text>
                    <Space wrap style={{ marginTop: 6 }}>
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = selectedCreateCategories.includes(cat);
                        return (
                          <Tag.CheckableTag
                            key={cat}
                            checked={isSelected}
                            onChange={() => toggleCreateCategory(cat)}
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.85rem',
                              borderRadius: '16px',
                              border: '1px solid #1890ff',
                              fontWeight: 600,
                            }}
                          >
                            {isSelected ? '✓ ' : '+ '} {cat}
                          </Tag.CheckableTag>
                        );
                      })}
                    </Space>
                  </div>

                  {/* Multi Image Upload Box (Ant Design Upload) */}
                  <Card title="📷 कभर तस्बिर (Multiple Upload & URL Supported - Max 10)" type="inner">
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>कम्प्युटर/मोबाइलबाट तस्बिर अपलोड गर्नुहोस् (Max 10)</Text>
                        <Upload
                          multiple
                          maxCount={10}
                          listType="picture-card"
                          fileList={articleFileList}
                          beforeUpload={() => false}
                          onChange={({ fileList }) => setArticleFileList(fileList.slice(0, 10))}
                          accept="image/*"
                        >
                          {articleFileList.length >= 10 ? null : (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>तस्बिर छान्नुहोस्</div>
                            </div>
                          )}
                        </Upload>
                        <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>
                          ⚡ अधिकतम् १० ओटा सम्म तस्बिरहरू (Array max 10)। Sharp द्वारा १६:९ (800x450 WebP) अनुपातमा अटो-क्रप हुन्छ।
                        </Text>
                      </Col>

                      <Col xs={24} md={12}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>🔗 वा कभर तस्बिरको लिङ्क (Direct URL)</Text>
                        <Input name="imageUrl" type="url" placeholder="https://images.unsplash.com/photo-..." size="large" />
                        <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                          कम्प्युटरबाट सेलेक्ट नगर्ने भए यहाँ डायरेक्ट URL राख्नुहोस्।
                        </Text>
                      </Col>
                    </Row>
                  </Card>

                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>छोटो सारांश (Excerpt)</Text>
                    <Input.TextArea name="excerpt" rows={3} required placeholder="समाचारको १-२ वाक्यको छोटो सार..." />
                  </div>

                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>विस्तृत समाचार सामग्री (Rich Markdown Content)</Text>
                    <EasyMarkdownEditor
                      value={articleMarkdownContent}
                      onChange={setArticleMarkdownContent}
                      name="content"
                    />
                  </div>

                  <Space>
                    <input type="checkbox" name="isExclusive" id="isExclusive" style={{ width: 18, height: 18 }} />
                    <label htmlFor="isExclusive" style={{ fontWeight: 600, cursor: 'pointer' }}>
                      🌟 विशेष एक्सक्लुसिभ समाचार (मुख्य बक्समा देखाउने)
                    </label>
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    htmlType="submit"
                    loading={loading}
                    style={{ padding: '0 32px' }}
                  >
                    समाचार प्रकाशित गर्नुहोस्
                  </Button>
                </Space>
              </form>
            </div>
          )}

          {/* TAB 4: BANNERS */}
          {activeTab === 'banners' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>🖼️ विज्ञापन तथा ब्यानर व्यवस्थापन</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddBannerModalOpen(true)}>
                  नयाँ ब्यानर थप्नुहोस्
                </Button>
              </div>

              <Row gutter={[16, 16]}>
                {bannersList.map((banner) => (
                  <Col xs={24} sm={12} md={8} key={banner.id}>
                    <Card
                      cover={
                        <img
                          alt={banner.title}
                          src={banner.imageUrl || 'https://via.placeholder.com/728x90'}
                          style={{ height: 120, objectFit: 'cover' }}
                        />
                      }
                      actions={[
                        <Tag color={banner.isActive ? 'green' : 'red'} key="status">
                          {banner.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                        </Tag>,
                        <Popconfirm
                          key="delete"
                          title="के तपाईं यो ब्यानर हटाउन निश्चित हुनुहुन्छ?"
                          onConfirm={() => handleDeleteBanner(banner.id)}
                        >
                          <Button type="link" danger icon={<DeleteOutlined />}>हटाउनुहोस्</Button>
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        title={banner.title}
                        description={`स्थान: ${banner.position}`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* TAB 5: STAFF USERS */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>👥 कर्मचारी प्रयोगकर्ता व्यवस्थापन</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddUserModalOpen(true)}>
                  नयाँ कर्मचारी थप्नुहोस्
                </Button>
              </div>

              <Table
                dataSource={usersList}
                rowKey="id"
                columns={[
                  {
                    title: 'अवतार',
                    dataIndex: 'avatar',
                    key: 'avatar',
                    render: (av: string) => (
                      <img src={av || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ),
                  },
                  { title: 'नाम', dataIndex: 'name', key: 'name' },
                  { title: 'इमेल', dataIndex: 'email', key: 'email' },
                  {
                    title: 'भूमिका',
                    dataIndex: 'role',
                    key: 'role',
                    render: (role: string) => <Tag color="purple">{role}</Tag>,
                  },
                ]}
              />
            </div>
          )}

          {/* TAB 6: RASHIFAL */}
          {activeTab === 'rashifal' && (
            <div>
              <Title level={4} style={{ marginBottom: 16 }}>🔮 दैनिक राशिफल विवरण</Title>
              <Row gutter={[16, 16]}>
                {rashifalList.map((r: any) => (
                  <Col xs={24} sm={12} md={8} key={r.id}>
                    <Card title={`${r.sign || r.rashi || 'राशि'} (${r.latinName || r.englishName || ''})`}>
                      <Paragraph ellipsis={{ rows: 3 }}>{r.prediction}</Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* TAB 7: BREAKING NEWS */}
          {activeTab === 'bhakharai' && (
            <div style={{ maxWidth: 800 }}>
              <Title level={4} style={{ marginBottom: 16 }}>⚡ भर्खरै समाचार व्यवस्थापन (Breaking News Ticker)</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                वेबसाइटको माथिल्लो पट्टी (Top Ticker Bar) मा निरन्तर चल्ने भर्खरैका मुख्य समाचारहरू लेख्नुहोस् (प्रत्येक हरफमा १ वटा समाचार):
              </Text>
              <Input.TextArea
                rows={8}
                value={breakingNewsText}
                onChange={(e) => setBreakingNewsText(e.target.value)}
                placeholder="१. ताजा मुख्य समाचार...&#10;२. दोस्रो समाचार..."
                style={{ marginBottom: 16 }}
              />
              <Button type="primary" danger icon={<ThunderboltOutlined />} onClick={handleSaveBreakingNews} loading={loading}>
                भर्खरै समाचार अद्यावधिक गर्नुहोस्
              </Button>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ADD BANNER MODAL */}
      <Modal
        title="🖼️ नयाँ विज्ञापन ब्यानर थप्नुहोस्"
        open={isAddBannerModalOpen}
        onCancel={() => setIsAddBannerModalOpen(false)}
        footer={null}
        className={styles.lightModal}
      >
        <form onSubmit={handleCreateBanner}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>ब्यानर शीर्षक</Text>
              <Input name="title" required placeholder="उदाहरण: साइडबार ब्यानर" />
            </div>

            <div>
              <Text strong>स्थान (Position)</Text>
              <input type="hidden" name="position" value={selectedPositionForNewBanner} />
              <Select
                value={selectedPositionForNewBanner}
                onChange={(val) => setSelectedPositionForNewBanner(val)}
                style={{ width: '100%' }}
              >
                {BANNER_POSITIONS_INFO.map((pos) => (
                  <Option key={pos.keyword} value={pos.keyword}>{pos.name} ({pos.page})</Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong>📷 तस्बिर अपलोड (Multiple Allowed)</Text>
              <Upload
                multiple
                listType="picture"
                fileList={bannerFileList}
                beforeUpload={() => false}
                onChange={({ fileList }) => setBannerFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>तस्बिर सेलेक्ट गर्नुहोस्</Button>
              </Upload>
            </div>

            <div>
              <Text strong>🔗 वा तस्बिरको लिङ्क (Direct URL)</Text>
              <Input name="imageUrl" type="url" placeholder="https://..." />
            </div>

            <div>
              <Text strong>वेबसाइट लिङ्क (Target URL)</Text>
              <Input name="targetUrl" type="url" placeholder="https://example.com" />
            </div>

            <Button type="primary" htmlType="submit" loading={loading} block icon={<PlusOutlined />}>
              ब्यानर प्रकाशित गर्नुहोस्
            </Button>
          </Space>
        </form>
      </Modal>

      {/* ADD STAFF USER MODAL */}
      <Modal
        title="👥 नयाँ कर्मचारी थप्नुहोस्"
        open={isAddUserModalOpen}
        onCancel={() => setIsAddUserModalOpen(false)}
        footer={null}
        className={styles.lightModal}
      >
        <form onSubmit={handleCreateUser}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>पुरा नाम</Text>
              <Input name="name" required placeholder="राम श्रेष्ठ" />
            </div>

            <div>
              <Text strong>इमेल</Text>
              <Input name="email" type="email" required placeholder="ram@sunstar.com" />
            </div>

            <div>
              <Text strong>भूमिका (Role)</Text>
              <input type="hidden" name="role" value={selectedUserRole} />
              <Select
                value={selectedUserRole}
                onChange={(val) => setSelectedUserRole(val)}
                style={{ width: '100%' }}
              >
                <Option value="Editor">सम्पादक (Editor)</Option>
                <Option value="Reporter">संवाददाता (Reporter)</Option>
                <Option value="Admin">व्यवस्थापक (Admin)</Option>
              </Select>
            </div>

            <div>
              <Text strong>पासवर्ड</Text>
              <Input.Password name="password" required minLength={6} />
            </div>

            <div>
              <Text strong>📷 प्रोफाइल तस्बिर अपलोड</Text>
              <Upload
                listType="picture"
                fileList={avatarFileList}
                beforeUpload={() => false}
                onChange={({ fileList }) => setAvatarFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>तस्बिर सेलेक्ट गर्नुहोस्</Button>
              </Upload>
            </div>

            <div>
              <Text strong>🔗 वा प्रोफाइल अवतार लिङ्क (URL)</Text>
              <Input name="avatar" type="url" placeholder="https://..." />
            </div>

            <Button type="primary" htmlType="submit" loading={loading} block icon={<PlusOutlined />}>
              प्रयोगकर्ता सिर्जना गर्नुहोस्
            </Button>
          </Space>
        </form>
      </Modal>

      {/* MODAL 3: Edit Article Modal */}
      <Modal
        title="✏️ समाचार सम्पादन / सच्याउनुहोस् (Edit Article)"
        open={isEditArticleModalOpen}
        onCancel={() => {
          setIsEditArticleModalOpen(false);
          setEditingArticle(null);
        }}
        footer={null}
        width={850}
        destroyOnClose
        className={styles.lightModal}
      >
        {editingArticle && (
          <form onSubmit={handleUpdateArticle}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>
                  समाचार ID: <Tag color="blue">{editingArticle.id}</Tag>
                </Text>
                <Text strong style={{ display: 'block', marginBottom: 6 }}>समाचार शीर्षक</Text>
                <Input name="title" defaultValue={editingArticle.title} required size="large" />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: 6 }}>विधा चयन गर्नुहोस् (Category)</Text>
                <Select
                  value={editArticleCategory}
                  onChange={(val) => setEditArticleCategory(val)}
                  style={{ width: '100%' }}
                  size="large"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </div>

              <Card title="📷 नयाँ कभर तस्बिर (अप्शनल)" type="inner">
                {/* Always-present hidden fields so server knows what the user retained */}
                <input type="hidden" name="retainedImages" value={JSON.stringify(editExistingImages)} />
                <input type="hidden" name="imagesDirty" value="1" />

                {editExistingImages.length > 0 ? (
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary" style={{ fontSize: '0.78rem', display: 'block', marginBottom: 4 }}>हालका कभर तस्बिरहरू (देखाउनुस् / हटाउनुस्):</Text>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {editExistingImages.map((img: string, idx: number) => (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={img}
                            alt={`Cover ${idx + 1}`}
                            style={{ height: 70, width: 105, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e8' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/sunstar-logo.jpg';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            style={{
                              position: 'absolute', top: -6, right: -6,
                              background: '#ff4d4f', border: 'none', borderRadius: '50%',
                              width: 20, height: 20, cursor: 'pointer', color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 'bold', lineHeight: 1,
                            }}
                            title="तस्बिर हटाउनुहोस्"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 8, color: '#999' }}>
                    ⚠️ सबै हालका तस्बिरहरू हटाइए — तलतिर नयाँ तस्बिर अपलोड गर्नुहोस्।
                  </Text>
                )}
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>नयाँ कभर तस्बिरहरू छान्नुहोस् (Multiple Max 10)</Text>
                    <Upload
                      multiple
                      maxCount={10}
                      listType="picture-card"
                      fileList={editArticleFileList}
                      beforeUpload={() => false}
                      onChange={({ fileList }) => setEditArticleFileList(fileList.slice(0, 10))}
                      accept="image/*"
                    >
                      {editArticleFileList.length >= 10 ? null : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>तस्बिर छान्नुहोस्</div>
                        </div>
                      )}
                    </Upload>
                    <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>
                      ⚡ नयाँ तस्बिरहरू (अधिकतम् १० ओटा सम्म) छान्नुहोस्। नबदल्ने भए खाली छाड्नुहोस्।
                    </Text>
                  </Col>
                  <Col xs={24} md={12}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>🔗 वा नयाँ तस्बिरको लिङ्क (Direct URL)</Text>
                    <Input name="imageUrl" type="url" placeholder="https://..." defaultValue="" size="large" />
                  </Col>
                </Row>
              </Card>

              <div>
                <Text strong style={{ display: 'block', marginBottom: 6 }}>❤️ लाइक्स संख्या (Likes Count)</Text>
                <Input
                  name="likesCount"
                  type="number"
                  min={0}
                  defaultValue={editingArticle.likesCount ?? 12}
                  size="large"
                  style={{ width: 180 }}
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: 6 }}>छोटो सारांश (Excerpt)</Text>
                <Input.TextArea name="excerpt" rows={3} defaultValue={editingArticle.summary || ''} required />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: 6 }}>विस्तृत सामग्री (Markdown Content)</Text>
                <EasyMarkdownEditor
                  value={editArticleMarkdown}
                  onChange={setEditArticleMarkdown}
                  name="editContent"
                />
              </div>

              <Button type="primary" htmlType="submit" loading={loading} block size="large" icon={<EditOutlined />}>
                समाचार अद्यावधिक गर्नुहोस् (Save Changes)
              </Button>
            </Space>
          </form>
        )}
      </Modal>

      {/* Modal 4: Comments & Likes Management Modal */}
      <Modal
        title={`💬 प्रतिक्रिया तथा लाइक्स व्यवस्थापन`}
        open={isCommentsModalOpen}
        onCancel={() => setIsCommentsModalOpen(false)}
        footer={null}
        width={650}
        className={styles.lightModal}
      >
        {selectedArticleForComments && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Editable Likes Section */}
            <Card
              size="small"
              style={{ background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 10 }}
            >
              <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '0.95rem' }}>
                ❤️ लाइक्स संख्या सम्पादन गर्नुहोस् (Edit Likes Count)
              </Text>
              <Space>
                <Input
                  type="number"
                  min={0}
                  value={editLikesInputValue}
                  onChange={(e) => setEditLikesInputValue(Math.max(0, Number(e.target.value) || 0))}
                  style={{ width: 140 }}
                  addonBefore="❤️"
                  size="large"
                />
                <Button
                  type="primary"
                  danger
                  loading={isSavingLikes}
                  onClick={handleSaveEditedLikes}
                  size="large"
                >
                  सुरक्षित गर्नुहोस्
                </Button>
              </Space>
              <Text type="secondary" style={{ fontSize: '0.78rem', display: 'block', marginTop: 6 }}>
                जम्मा प्रतिक्रियाहरू: <Tag color="blue">💬 {(selectedArticleForComments.commentsList || []).length}</Tag>
              </Text>
            </Card>

            <Divider style={{ margin: '4px 0' }} />

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>पाठकका प्रतिक्रिया सूची (Reader Comments):</Text>
              {(selectedArticleForComments.commentsList || []).length === 0 ? (
                <Text type="secondary">यस समाचारमा अझै कुनै प्रतिक्रियाहरू छैनन्।</Text>
              ) : (
                <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(selectedArticleForComments.commentsList || []).map((c: any, idx: number) => (
                    <Card key={c.id || idx} size="small" style={{ backgroundColor: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Text strong style={{ fontSize: '0.9rem' }}>👤 {c.name}</Text>
                          <Text type="secondary" style={{ fontSize: '0.78rem', marginLeft: 8 }}>({c.time || 'भर्खरै'})</Text>
                          <Paragraph style={{ margin: '4px 0 0 0', fontSize: '0.88rem' }}>{c.text}</Paragraph>
                        </div>
                        <Popconfirm
                          title="के यो प्रतिक्रिया हटाउने निश्चित हुनुहुन्छ?"
                          onConfirm={() => handleDeleteComment(selectedArticleForComments.id, c.id)}
                          okText="हटाउनुहोस्"
                          cancelText="रद्द"
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} size="small">हटाउनुहोस्</Button>
                        </Popconfirm>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <div>
              <Text strong style={{ display: 'block', marginBottom: 6 }}>व्यवस्थापक प्रतिक्रिया थप्नुहोस् (Add Admin Reply):</Text>
              <Input.TextArea
                rows={3}
                value={newAdminCommentText}
                onChange={(e) => setNewAdminCommentText(e.target.value)}
                placeholder="व्यवस्थापक/सम्पादकको तर्फबाट आधिकारिक प्रतिक्रिया..."
                style={{ marginBottom: 12 }}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAdminComment} block>
                प्रतिक्रिया प्रकाशित गर्नुहोस्
              </Button>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0' }}>ड्यासबोर्ड लोड हुँदैछ...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
