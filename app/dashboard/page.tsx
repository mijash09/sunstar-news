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
  Segmented,
} from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  PlusOutlined,
  PictureOutlined,
  UserOutlined,
  ThunderboltOutlined,
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
import SUNSTAR_DATA, { BannerAd } from '@/lib/data';
import EasyMarkdownEditor from '@/components/organisms/EasyMarkdownEditor';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

type TabType = 'overview' | 'articles' | 'create' | 'banners' | 'users' | 'bhakharai';

const BANNER_POSITIONS_INFO = [
  // Home Page Positions
  { keyword: 'header-top', name: 'मुख्य माथिल्लो ब्यानर (Header Top)', size: '७२८ x ९० px', page: 'गृहपृष्ठ / सबै पाना', screen: 'home', desc: 'हेडर र मुख्य नेभिगेसन बारको मुनि देखा पर्ने मुख्य ब्यानर' },
  { keyword: 'home-hero-below', name: 'मुख्य समाचार मुनिको ब्यानर (Below Hero)', size: '९७० x ९० / ७२८ x ९० px', page: 'गृहपृष्ठ', screen: 'home', desc: 'गृहपृष्ठको प्रमुख लिड समाचार मुनि देखा पर्ने मुख्य ब्यानर' },
  { keyword: 'mid-content-1', name: 'राजनीति र अर्थ बीचको ब्यानर (Mid 1)', size: '७२८ x ९० px', page: 'गृहपृष्ठ', screen: 'home', desc: 'गृहपृष्ठमा राजनीति र अर्थ समाचार ब्लक बीच देखा पर्ने ब्यानर' },
  { keyword: 'mid-content-2', name: 'खेलकुद र मनोरञ्जन बीचको ब्यानर (Mid 2)', size: '७२८ x ९० px', page: 'गृहपृष्ठ', screen: 'home', desc: 'गृहपृष्ठमा खेलकुद र मनोरञ्जन समाचार बीच देखा पर्ने ब्यानर' },
  { keyword: 'sidebar-widget', name: 'दायाँ स्टिकी ब्यानर (Sidebar Widget)', size: '३०० x २५० px', page: 'गृहपृष्ठ साइडबार', screen: 'home', desc: 'गृहपृष्ठको दायाँ कोलममा देखिने स्क्वायर ब्यानर' },
  { keyword: 'footer-top', name: 'फुटर माथिल्लो ब्यानर (Above Footer)', size: '७२८ x ९० px', page: 'सबै पाना', screen: 'home', desc: 'वेबसाइटको तल्लो फुटर माथि देखा पर्ने ब्यानर' },

  // Single News Page Positions
  { keyword: 'news-top', name: 'समाचार शीर्षक माथिको ब्यानर (Above Title)', size: '७२८ x ९० px', page: 'समाचार पाना', screen: 'single_news', desc: 'समाचार विवरण पानाको शीर्षक भन्दा ठिक माथि देखा पर्ने ब्यानर' },
  { keyword: 'news-under-image', name: 'मुख्य तस्बिर मुनिको ब्यानर (Under Photo)', size: '७२८ x ९० px', page: 'समाचार पाना', screen: 'single_news', desc: 'समाचारको मुख्य तस्बिर मुनि देखा पर्ने ब्यानर' },
  { keyword: 'news-in-content', name: 'समाचार सामग्री बीचको ब्यानर (In-Content)', size: '७२८ x ९० px', page: 'समाचार पाना', screen: 'single_news', desc: 'समाचारको मुख्य विवरण/प्याराग्राफको बीचमा देखा पर्ने ब्यानर' },
  { keyword: 'single-news-sidebar', name: 'समाचार दायाँ साइडबार ब्यानर (Sticky Sidebar)', size: '३०० x २५० px', page: 'समाचार पाना', screen: 'single_news', desc: 'समाचार पढ्दा दायाँ पट्टी स्क्रोलसँगै रहने स्टिकी ब्यानर' },
  { keyword: 'news-bottom', name: 'प्रतिक्रिया मुनिको ब्यानर (Article Bottom)', size: '७२८ x ९० px', page: 'समाचार पाना', screen: 'single_news', desc: 'समाचारको अन्त्यमा प्रतिक्रिया र सम्बन्धित समाचार मुनि देखिने ब्यानर' },
  { keyword: 'rashifal-top', name: 'राशिफल माथिल्लो ब्यानर', size: '७२८ x ९० px', page: 'राशिफल पाना', screen: 'single_news', desc: 'दैनिक/साप्ताहिक राशिफल पानाको माथि देखिने ब्यानर' },
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

const PROVINCE_OPTIONS = [
  { key: 'koshi', label: 'कोशी प्रदेश', icon: '🏞️' },
  { key: 'madhesh', label: 'मधेश प्रदेश', icon: '🌾' },
  { key: 'bagmati', label: 'बाग्मती प्रदेश', icon: '🏛️' },
  { key: 'gandaki', label: 'गण्डकी प्रदेश', icon: '🏔️' },
  { key: 'lumbini', label: 'लुम्बिनी प्रदेश', icon: '🌸' },
  { key: 'karnali', label: 'कर्णाली प्रदेश', icon: '🌲' },
  { key: 'sudurpaschim', label: 'सुदूरपश्चिम प्रदेश', icon: '🌊' },
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
    if (tab && ['overview', 'articles', 'create', 'banners', 'users', 'bhakharai'].includes(tab)) {
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
  const [bannersList, setBannersList] = useState<BannerAd[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
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
  const [createArticleProvince, setCreateArticleProvince] = useState<string>('');
  const [editArticleProvince, setEditArticleProvince] = useState<string>('');
  const [selectedPositionForNewBanner, setSelectedPositionForNewBanner] = useState<string>('header-top');
  const [bannerScreenTab, setBannerScreenTab] = useState<'home' | 'single_news'>('home');
  const [selectedUserRole, setSelectedUserRole] = useState<string>('Editor');

  // Writer / Opinion Profile States
  const [createAuthorName, setCreateAuthorName] = useState('');
  const [createAuthorRole, setCreateAuthorRole] = useState('');
  const [createAuthorImage, setCreateAuthorImage] = useState('');
  const [createReadTime, setCreateReadTime] = useState('');
  const [createAuthorAvatarFileList, setCreateAuthorAvatarFileList] = useState<UploadFile[]>([]);

  const [editAuthorName, setEditAuthorName] = useState('');
  const [editAuthorRole, setEditAuthorRole] = useState('');
  const [editAuthorImage, setEditAuthorImage] = useState('');
  const [editReadTime, setEditReadTime] = useState('');
  const [editAuthorAvatarFileList, setEditAuthorAvatarFileList] = useState<UploadFile[]>([]);

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
    const comments = Array.isArray(record.commentsList)
      ? record.commentsList
      : (Array.isArray(record.comments_list) ? record.comments_list : []);
    const likes = typeof record.likesCount === 'number'
      ? record.likesCount
      : (typeof record.likes_count === 'number' ? record.likes_count : 12);

    setSelectedArticleForComments({
      ...record,
      commentsList: comments,
      comments_list: comments,
      likesCount: likes,
      likes_count: likes,
    });
    setEditLikesInputValue(likes);
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
          const currentList = Array.isArray(selectedArticleForComments.commentsList)
            ? selectedArticleForComments.commentsList
            : (Array.isArray(selectedArticleForComments.comments_list) ? selectedArticleForComments.comments_list : []);
          const updatedList = currentList.filter((c: any) => c.id !== commentId);
          setSelectedArticleForComments({
            ...selectedArticleForComments,
            commentsList: updatedList,
            comments_list: updatedList,
            commentsCount: updatedList.length,
            comments_count: updatedList.length,
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
      if (selectedCreateCategories.includes('प्रदेश') && !createArticleProvince) {
        setLoading(false);
        toast.error('प्रदेश समाचारका लागि प्रदेश चयन गर्न अनिवार्य छ! (Please select a province)', { id: toastId });
        return;
      }

      const formData = new FormData(e.currentTarget);
      formData.set('actionType', 'create-article');
      formData.set('content', articleMarkdownContent);
      formData.set('summary', (formData.get('excerpt') as string) || (formData.get('summary') as string) || '');
      formData.set('category', selectedCreateCategories[0] || 'मुख्य समाचार');
      formData.set('categories', JSON.stringify(selectedCreateCategories));
      formData.set('province', createArticleProvince);
      formData.set('pradesh', createArticleProvince);
      formData.set('author', createAuthorName.trim() || 'सनस्टार संवाददाता');
      formData.set('authorRole', createAuthorRole.trim());
      formData.set('author_role', createAuthorRole.trim());
      formData.set('authorImage', createAuthorImage.trim());
      formData.set('author_image', createAuthorImage.trim());
      formData.set('readTime', createReadTime.trim());
      formData.set('read_time', createReadTime.trim());

      if (createAuthorAvatarFileList.length > 0) {
        const fileObj = createAuthorAvatarFileList[0].originFileObj || (createAuthorAvatarFileList[0] instanceof File ? createAuthorAvatarFileList[0] : null);
        if (fileObj) {
          formData.append('authorAvatarFile', fileObj);
        }
      }

      // Clean out any accidental DOM file inputs captured by new FormData
      formData.delete('file');
      formData.delete('imageFiles');
      formData.delete('imageFiles[]');

      // Append multiple files with array key only
      articleFileList.forEach((file) => {
        const fileObj = file.originFileObj || (file instanceof File ? file : null);
        if (fileObj) {
          formData.append('imageFiles[]', fileObj);
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
        setCreateArticleProvince('');
        setCreateAuthorName('');
        setCreateAuthorRole('');
        setCreateAuthorImage('');
        setCreateReadTime('');
        setCreateAuthorAvatarFileList([]);
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
    setEditArticleProvince(record.province || record.pradesh || '');
    setEditArticleFileList([]);
    setEditAuthorName(record.author || '');
    setEditAuthorRole(record.author_role || record.authorRole || '');
    setEditAuthorImage(record.author_image || record.authorImage || '');
    setEditReadTime(record.read_time || record.readTime || '');
    setEditAuthorAvatarFileList([]);
    
    // Populate existing images reliably
    let imgs: string[] = [];
    if (Array.isArray(record.images) && record.images.length > 0) {
      imgs = record.images;
    } else if (typeof record.images === 'string' && record.images.trim().startsWith('[')) {
      try {
        imgs = JSON.parse(record.images);
      } catch (e) {
        imgs = [record.image || '/assets/sunstar-logo.jpg'];
      }
    } else if (record.image) {
      imgs = [record.image];
    }
    setEditExistingImages(imgs.filter(Boolean));
    setIsEditArticleModalOpen(true);
  }

  async function handleUpdateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingArticle) return;

    const toastId = toast.loading('समाचार अद्यावधिक हुँदैछ...');
    setLoading(true);

    try {
      if (editArticleCategory === 'प्रदेश' && !editArticleProvince) {
        setLoading(false);
        toast.error('प्रदेश समाचारका लागि प्रदेश चयन गर्न अनिवार्य छ!', { id: toastId });
        return;
      }

      const formData = new FormData(e.currentTarget);
      formData.set('actionType', 'update-article');
      formData.set('id', editingArticle.id);
      formData.set('content', editArticleMarkdown);
      formData.set('category', editArticleCategory);
      formData.set('province', editArticleProvince);
      formData.set('pradesh', editArticleProvince);
      formData.set('summary', (formData.get('excerpt') as string) || (formData.get('summary') as string) || '');
      formData.set('existingImageUrl', editingArticle.image || '');
      formData.set('author', editAuthorName.trim() || 'सनस्टार संवाददाता');
      formData.set('authorRole', editAuthorRole.trim());
      formData.set('author_role', editAuthorRole.trim());
      formData.set('authorImage', editAuthorImage.trim());
      formData.set('author_image', editAuthorImage.trim());
      formData.set('readTime', editReadTime.trim());
      formData.set('read_time', editReadTime.trim());

      if (editAuthorAvatarFileList.length > 0) {
        const fileObj = editAuthorAvatarFileList[0].originFileObj || (editAuthorAvatarFileList[0] instanceof File ? editAuthorAvatarFileList[0] : null);
        if (fileObj) {
          formData.append('authorAvatarFile', fileObj);
        }
      }

      // Explicitly set retainedImages from current state
      formData.set('retainedImages', JSON.stringify(editExistingImages));
      if (editExistingImages.length > 0) {
        formData.set('primaryImage', editExistingImages[0]);
      }

      // Clean out any accidental DOM file inputs captured by new FormData
      formData.delete('file');
      formData.delete('imageFiles');
      formData.delete('imageFiles[]');

      // Append all multiple files with array key only
      editArticleFileList.forEach((file) => {
        const fileObj = file.originFileObj || (file instanceof File ? file : null);
        if (fileObj) {
          formData.append('imageFiles[]', fileObj);
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
        setEditArticleFileList([]);
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
          formData.append('bannerFiles[]', file.originFileObj);
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
      title: 'तस्बिर',
      dataIndex: 'image',
      key: 'image',
      render: (img: string, record: any) => {
        const count = Array.isArray(record.images) ? record.images.length : (img ? 1 : 0);
        return (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={img || (Array.isArray(record.images) && record.images[0]) || '/assets/sunstar-logo.jpg'}
              alt="Cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/assets/sunstar-logo.jpg'; }}
              className={styles.articleThumb}
            />
            {count > 1 && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 3,
                  right: 3,
                  background: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  padding: '1px 5px',
                  borderRadius: 4,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                📷 {count}
              </span>
            )}
          </div>
        );
      },
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
        const likes = record.likesCount ?? record.likes_count ?? 12;
        const commentsArr = Array.isArray(record.commentsList)
          ? record.commentsList
          : (Array.isArray(record.comments_list) ? record.comments_list : []);
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
                <Text style={{ color: '#000000', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 10 }}>
                  वेबसाइटको माथिल्लो पट्टीमा चल्ने ताजा समाचारहरू (प्रत्येक हरफमा एउटा):
                </Text>
                <Input.TextArea
                  rows={3}
                  value={breakingNewsText}
                  onChange={(e) => setBreakingNewsText(e.target.value)}
                  placeholder="१. मुख्य ताजा समाचार...&#10;२. दोस्रो ताजा समाचार..."
                  style={{ marginBottom: 12, background: '#ffffff', border: '1px solid #d9d9d9', color: '#000000', borderRadius: 8 }}
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
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ color: '#000000', fontSize: '1rem', fontWeight: 800 }}>📰 हालै प्रकाशित समाचारहरू</Text>
                  <Button size="small" className={styles.btnGhost} onClick={() => handleTabChange('articles')}>सबै हेर्नुहोस्</Button>
                </div>
                <div>
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
                <Text strong style={{ color: '#000000', fontSize: '1.15rem', fontWeight: 800 }}>📰 समाचार सूची तथा व्यवस्थापन</Text>
                <Button className={styles.btnPrimary} icon={<PlusOutlined />} onClick={() => handleTabChange('create')}>
                  नयाँ समाचार
                </Button>
              </div>

              {/* Filters */}
              <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Input
                  placeholder="शीर्षक वा विधा खोज्नुहोस्..."
                  prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, minWidth: 200, background: '#ffffff', border: '1px solid #cbd5e1', color: '#000000', borderRadius: 8 }}
                />
                <Select
                  style={{ minWidth: 200 }}
                  value={selectedCategoryFilter}
                  onChange={(val) => setSelectedCategoryFilter(val)}
                  dropdownStyle={{ background: '#ffffff', borderColor: '#cbd5e1' }}
                >
                  <Option value="all">सबै विधाहरू</Option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
                <Text style={{ color: '#000000', fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {filteredArticles.length} समाचार
                </Text>
              </div>

              <div>
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

                  {/* Dedicated Section for Pradesh Samachar */}
                  <Card
                    type="inner"
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                          🏔️ प्रदेश समाचार चयन (Province Selection)
                        </span>
                        {selectedCreateCategories.includes('प्रदेश') ? (
                          <Tag color="error" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                            * प्रदेश समाचारका लागि प्रदेश अनिवार्य छ
                          </Tag>
                        ) : (
                          <Tag color="default" style={{ borderRadius: 12, padding: '2px 10px' }}>
                            वैकल्पिक (प्रदेश छान्दा स्वतः 'प्रदेश' विधा चयन हुनेछ)
                          </Tag>
                        )}
                      </div>
                    }
                    style={{
                      borderRadius: 10,
                      border: selectedCreateCategories.includes('प्रदेश')
                        ? (createArticleProvince ? '2px solid #52c41a' : '2px solid #ff4d4f')
                        : '1px solid #d9d9d9',
                      backgroundColor: selectedCreateCategories.includes('प्रदेश')
                        ? (createArticleProvince ? '#f6ffed' : '#fff2f0')
                        : '#fafafa',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Paragraph style={{ marginBottom: 12, fontSize: '0.88rem' }}>
                      {selectedCreateCategories.includes('प्रदेश')
                        ? '⚠️ तपाईंले "प्रदेश" विधा चयन गर्नुभएको छ। तलका ७ प्रदेशहरूमध्ये एउटा प्रदेश अनिवार्य रूपमा छान्नुहोस्:'
                        : 'यदि यो समाचार कुनै निश्चित प्रदेशसँग सम्बन्धित छ भने तलबाट सम्बन्धित प्रदेश चयन गर्नुहोस्:'}
                    </Paragraph>

                    <Row gutter={[12, 12]}>
                      {PROVINCE_OPTIONS.map((prov) => {
                        const isProvSelected = createArticleProvince === prov.key;
                        return (
                          <Col xs={12} sm={8} md={6} key={prov.key}>
                            <div
                              onClick={() => {
                                if (isProvSelected) {
                                  if (!selectedCreateCategories.includes('प्रदेश')) {
                                    setCreateArticleProvince('');
                                  }
                                } else {
                                  setCreateArticleProvince(prov.key);
                                  if (!selectedCreateCategories.includes('प्रदेश')) {
                                    setSelectedCreateCategories((prev) => [...prev, 'प्रदेश']);
                                  }
                                }
                              }}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: isProvSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                backgroundColor: isProvSelected ? '#e6f7ff' : '#ffffff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: isProvSelected ? 700 : 500,
                                color: isProvSelected ? '#1890ff' : 'inherit',
                                boxShadow: isProvSelected ? '0 2px 8px rgba(24, 144, 255, 0.2)' : 'none',
                                transition: 'all 0.2s',
                              }}
                            >
                              <span style={{ fontSize: '1.2rem' }}>{prov.icon}</span>
                              <span style={{ fontSize: '0.9rem' }}>{prov.label}</span>
                              {isProvSelected && (
                                <span style={{ marginLeft: 'auto', color: '#1890ff', fontWeight: 800 }}>✓</span>
                              )}
                            </div>
                          </Col>
                        );
                      })}
                    </Row>

                    {selectedCreateCategories.includes('प्रदेश') && !createArticleProvince && (
                      <div style={{ marginTop: 12, color: '#ff4d4f', fontWeight: 700, fontSize: '0.88rem' }}>
                        ⚠️ कृपया माथिका ७ प्रदेशहरूमध्ये एउटा प्रदेश चयन गर्नुहोस्। यो अनिवार्य छ!
                      </div>
                    )}
                  </Card>

                  {/* Dedicated Section for Opinion / Analysis (विचार / विश्लेषण स्तम्भकार विवरण) */}
                  <Card
                    type="inner"
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                          ✍️ विचार / विश्लेषण स्तम्भकार विवरण (Writer Profile)
                        </span>
                        {selectedCreateCategories.includes('विचार') ? (
                          <Tag color="purple" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                            * विचार/विश्लेषण विधा चयन गरिएको छ
                          </Tag>
                        ) : (
                          <Tag color="default" style={{ borderRadius: 12, padding: '2px 10px' }}>
                            वैकल्पिक (विचार तथा स्तम्भका लागि उपयोगी)
                          </Tag>
                        )}
                      </div>
                    }
                    style={{
                      borderRadius: 10,
                      border: selectedCreateCategories.includes('विचार') ? '2px solid #722ed1' : '1px solid #d9d9d9',
                      backgroundColor: selectedCreateCategories.includes('विचार') ? '#f9f0ff' : '#fafafa',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Paragraph style={{ marginBottom: 14, fontSize: '0.88rem' }}>
                      {selectedCreateCategories.includes('विचार')
                        ? '✍️ तपाईंले "विचार" विधा चयन गर्नुभएको छ। लेखक/स्तम्भकारको नाम, पद/परिचय, तस्बिर र पठन समय भर्नुहोस्। यो विवरण गृहपृष्ठको "विचार / विश्लेषण" सेक्सनमा विशेष कार्डका रूपमा प्रस्तुत हुनेछ:'
                        : 'यदि यो समाचार विचार, स्तम्भ वा गहन विश्लेषण हो भने स्तम्भकार/लेखकको नाम, भूमिका र तस्बिर यहाँ राख्नुहोस्:'}
                    </Paragraph>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>👤 लेखक / स्तम्भकारको पूरा नाम (Writer Name)</Text>
                        <Input
                          name="author"
                          value={createAuthorName}
                          onChange={(e) => setCreateAuthorName(e.target.value)}
                          placeholder="उदाहरण: कृष्ण बहाब / रितेश पन्थी"
                          size="large"
                        />
                      </Col>

                      <Col xs={24} sm={12}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>🎓 लेखकको भूमिका / परिचय (Writer Role / Title)</Text>
                        <Input
                          name="authorRole"
                          value={createAuthorRole}
                          onChange={(e) => setCreateAuthorRole(e.target.value)}
                          placeholder="उदाहरण: जलवायु राजनीति विज्ञ (सनस्टार विचार) / मानवाधिकार एवं कानुन अध्येता"
                          size="large"
                        />
                      </Col>

                      <Col xs={24} sm={16}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>📷 लेखकको तस्बिर (Writer Photo / Avatar)</Text>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Upload
                            maxCount={1}
                            listType="picture"
                            fileList={createAuthorAvatarFileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setCreateAuthorAvatarFileList(fileList)}
                            accept="image/*"
                          >
                            <Button icon={<UploadOutlined />}>फोटो अपलोड</Button>
                          </Upload>
                          <Input
                            name="authorImage"
                            value={createAuthorImage}
                            onChange={(e) => setCreateAuthorImage(e.target.value)}
                            placeholder="वा फोटोको लिङ्क (Direct URL)"
                            style={{ flex: 1, minWidth: 200 }}
                          />
                        </div>
                      </Col>

                      <Col xs={24} sm={8}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>⏱️ अनुमानित पठन समय (Reading Time)</Text>
                        <Input
                          name="readTime"
                          value={createReadTime}
                          onChange={(e) => setCreateReadTime(e.target.value)}
                          placeholder="उदाहरण: ६ मिनेट पाठ"
                          size="large"
                        />
                      </Col>
                    </Row>
                  </Card>

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
                          beforeUpload={(file) => {
                            (file as any).thumbUrl = URL.createObjectURL(file);
                            return false;
                          }}
                          onChange={({ fileList }) => {
                            const withThumbs = fileList.map((f) => {
                              if (!f.thumbUrl && f.originFileObj) {
                                f.thumbUrl = URL.createObjectURL(f.originFileObj);
                              }
                              return f;
                            });
                            setArticleFileList(withThumbs.slice(0, 10));
                          }}
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
                          ⚡ अधिकतम् १० ओटा सम्म तस्बिरहरू (Array max 10)। सबै तस्बिरहरू ग्यालरीमा समावेश हुन्छन्।
                        </Text>
                      </Col>

                      <Col xs={24} md={12}>
                        <Text strong style={{ display: 'block', marginBottom: 6 }}>🔗 वा कभर तस्बिरको लिङ्क (Direct URL)</Text>
                        <Input.TextArea
                          name="imageUrl"
                          placeholder="https://images.unsplash.com/... (एउटा वा धेरै लिङ्कहरू कमा वा नयाँ हरफमा राख्न सक्नुहुन्छ)"
                          rows={2}
                          size="large"
                        />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>🖼️ विज्ञापन तथा ब्यानर व्यवस्थापन</Title>
                  <Text type="secondary">
                    स्क्रीन छनोट गरी विभिन्न स्थानका ब्यानरहरू व्यवस्थापन गर्नुहोस् (एउटै स्थानमा धेरै तस्बिर भएमा अटो-क्यारोसेल चल्नेछ)
                  </Text>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Segmented
                    size="large"
                    value={bannerScreenTab}
                    onChange={(val) => setBannerScreenTab(val as 'home' | 'single_news')}
                    options={[
                      { label: '🏠 गृहपृष्ठ (Home Page)', value: 'home' },
                      { label: '📄 समाचार पाना (Single News)', value: 'single_news' },
                    ]}
                    style={{ fontWeight: 700 }}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedPositionForNewBanner(bannerScreenTab === 'home' ? 'header-top' : 'news-top');
                      setIsAddBannerModalOpen(true);
                    }}
                  >
                    नयाँ ब्यानर थप्नुहोस्
                  </Button>
                </div>
              </div>

              {/* Positions List for Selected Screen */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {BANNER_POSITIONS_INFO.filter((p) => p.screen === bannerScreenTab).map((pos) => {
                  const posBanners = bannersList.filter(
                    (b) => String(b.position || '').toLowerCase().trim() === pos.keyword.toLowerCase().trim()
                  );
                  const isCarousel = posBanners.length > 1;

                  return (
                    <Card
                      key={pos.keyword}
                      style={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '6px 0' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                            {pos.name}
                          </span>
                          <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            {pos.keyword}
                          </Tag>
                          <Tag color="orange" style={{ fontWeight: 700 }}>
                            📐 {pos.size}
                          </Tag>
                          {posBanners.length === 0 ? (
                            <Tag color="default">कुनै ब्यानर छैन (वेबसाइटमा लुक्नेछ)</Tag>
                          ) : isCarousel ? (
                            <Tag color="purple" style={{ fontWeight: 700 }}>
                              🎠 क्यारोसेल सक्रिय ({posBanners.length} तस्बिरहरू)
                            </Tag>
                          ) : (
                            <Tag color="green" style={{ fontWeight: 700 }}>
                              🟢 १ ब्यानर सक्रिय
                            </Tag>
                          )}
                        </div>
                      }
                      extra={
                        <Button
                          type="primary"
                          ghost
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setSelectedPositionForNewBanner(pos.keyword);
                            setIsAddBannerModalOpen(true);
                          }}
                        >
                          + यस स्थानमा ब्यानर थप्नुहोस्
                        </Button>
                      }
                    >
                      <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 16 }}>
                        ℹ️ {pos.desc}
                      </Paragraph>

                      {posBanners.length === 0 ? (
                        <div
                          style={{
                            padding: '32px 16px',
                            textAlign: 'center',
                            background: '#f8fafc',
                            borderRadius: 10,
                            border: '1.5px dashed #cbd5e1',
                          }}
                        >
                          <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
                            यस स्थानमा हाल कुनै विज्ञापन ब्यानर राखिएको छैन। सार्वजनिक वेबसाइटमा यो भाग खाली नदेखिई स्वतः लुक्नेछ।
                          </Text>
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              setSelectedPositionForNewBanner(pos.keyword);
                              setIsAddBannerModalOpen(true);
                            }}
                          >
                            यस स्थान ({pos.name}) मा नयाँ ब्यानर थप्नुहोस्
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {isCarousel && (
                            <div
                              style={{
                                marginBottom: 16,
                                padding: '8px 14px',
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: 8,
                                color: '#1d4ed8',
                                fontSize: 13,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                              <span>🎠</span>
                              <span>
                                <strong>क्यारोसेल सक्रिय:</strong> वेबसाइटमा यी {posBanners.length} वटा ब्यानरहरू निरन्तर अटो-स्लाइड हुनेछन् र प्रयोगकर्ताले तीर वा थोप्लाहरू थिचेर पनि फेर्न सक्नेछन्।
                              </span>
                            </div>
                          )}

                          <Row gutter={[16, 16]}>
                            {posBanners.map((banner, index) => (
                              <Col xs={24} sm={12} md={8} lg={6} key={banner.id}>
                                <Card
                                  size="small"
                                  style={{ borderRadius: 8, overflow: 'hidden', height: '100%' }}
                                  cover={
                                    <div
                                      style={{
                                        height: 130,
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 8,
                                        borderBottom: '1px solid #e2e8f0',
                                        position: 'relative',
                                      }}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        alt={banner.title}
                                        src={banner.imageUrl || (banner as any).image_url || 'https://via.placeholder.com/728x90'}
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '100%',
                                          objectFit: 'contain', // Keeps original proportions without cutting
                                        }}
                                      />
                                      {isCarousel && (
                                        <span
                                          style={{
                                            position: 'absolute',
                                            top: 6,
                                            left: 6,
                                            background: 'rgba(0,0,0,0.65)',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            padding: '1px 6px',
                                            borderRadius: 4,
                                          }}
                                        >
                                          स्लाइड #{index + 1}
                                        </span>
                                      )}
                                    </div>
                                  }
                                  actions={[
                                    <Tag color={banner.isActive || (banner as any).is_active ? 'green' : 'red'} key="status">
                                      {banner.isActive || (banner as any).is_active ? 'सक्रिय' : 'निष्क्रिय'}
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
                                    title={<span style={{ fontSize: 13, fontWeight: 700 }}>{banner.title}</span>}
                                    description={
                                      <div style={{ fontSize: 11, color: '#64748b' }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          🔗 <a href={banner.targetUrl || (banner as any).target_url} target="_blank" rel="noreferrer">
                                            {banner.targetUrl || (banner as any).target_url || 'कुनै लिङ्क छैन'}
                                          </a>
                                        </div>
                                      </div>
                                    }
                                  />
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
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

          {/* TAB 6: BREAKING NEWS */}
          {activeTab === 'bhakharai' && (
            <div style={{ maxWidth: 800 }}>
              <Title level={4} style={{ marginBottom: 16 }}>⚡ भर्खरै समाचार व्यवस्थापन (Breaking News Ticker)</Title>
              <Text style={{ display: 'block', marginBottom: 16, color: '#000000', fontWeight: 600 }}>
                वेबसाइटको माथिल्लो पट्टी (Top Ticker Bar) मा निरन्तर चल्ने भर्खरैका मुख्य समाचारहरू लेख्नुहोस् (प्रत्येक हरफमा १ वटा समाचार):
              </Text>
              <Input.TextArea
                rows={8}
                value={breakingNewsText}
                onChange={(e) => setBreakingNewsText(e.target.value)}
                placeholder="१. ताजा मुख्य समाचार...&#10;२. दोस्रो समाचार..."
                style={{ marginBottom: 16, color: '#000000', background: '#ffffff', border: '1px solid #d9d9d9' }}
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
                <Select.OptGroup label="🏠 गृहपृष्ठका स्थानहरू (Home Page Slots)">
                  {BANNER_POSITIONS_INFO.filter((p) => p.screen === 'home').map((pos) => (
                    <Option key={pos.keyword} value={pos.keyword}>
                      {pos.name} - {pos.size}
                    </Option>
                  ))}
                </Select.OptGroup>
                <Select.OptGroup label="📄 समाचार विवरण पानाका स्थानहरू (Single News Slots)">
                  {BANNER_POSITIONS_INFO.filter((p) => p.screen === 'single_news').map((pos) => (
                    <Option key={pos.keyword} value={pos.keyword}>
                      {pos.name} - {pos.size}
                    </Option>
                  ))}
                </Select.OptGroup>
              </Select>
            </div>

            <div>
              <Text strong>📷 तस्बिर अपलोड (Multiple Allowed)</Text>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                💡 १ भन्दा बढी तस्बिर छानेमा ती तस्बिरहरू वेबसाइटमा स्वतः अटो-रोटेटिङ क्यारोसेलमा देखिनेछन्। Sharp ले तस्बिरको कुनै पनि भाग नकाटी (No Crop) आकार घटाएर WebP मा सुरक्षित राख्नेछ।
              </div>
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

              {/* Dedicated Pradesh Section in Edit Modal */}
              <Card
                type="inner"
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      🏔️ प्रदेश चयन (Province Selection)
                    </span>
                    {editArticleCategory === 'प्रदेश' ? (
                      <Tag color="error" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                        * अनिवार्य छ
                      </Tag>
                    ) : (
                      <Tag color="default" style={{ borderRadius: 12, padding: '2px 10px' }}>
                        वैकल्पिक
                      </Tag>
                    )}
                  </div>
                }
                style={{
                  borderRadius: 8,
                  border: editArticleCategory === 'प्रदेश'
                    ? (editArticleProvince ? '2px solid #52c41a' : '2px solid #ff4d4f')
                    : '1px solid #d9d9d9',
                  backgroundColor: editArticleCategory === 'प्रदेश'
                    ? (editArticleProvince ? '#f6ffed' : '#fff2f0')
                    : '#fafafa',
                  transition: 'all 0.3s ease',
                }}
              >
                <Row gutter={[10, 10]}>
                  {PROVINCE_OPTIONS.map((prov) => {
                    const isProvSelected = editArticleProvince === prov.key;
                    return (
                      <Col xs={12} sm={8} md={6} key={prov.key}>
                        <div
                          onClick={() => {
                            if (isProvSelected) {
                              if (editArticleCategory !== 'प्रदेश') setEditArticleProvince('');
                            } else {
                              setEditArticleProvince(prov.key);
                              if (editArticleCategory !== 'प्रदेश') setEditArticleCategory('प्रदेश');
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: isProvSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            backgroundColor: isProvSelected ? '#e6f7ff' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: isProvSelected ? 700 : 500,
                            color: isProvSelected ? '#1890ff' : 'inherit',
                            fontSize: '0.85rem',
                          }}
                        >
                          <span>{prov.icon}</span>
                          <span>{prov.label}</span>
                          {isProvSelected && <span style={{ marginLeft: 'auto', color: '#1890ff', fontWeight: 800 }}>✓</span>}
                        </div>
                      </Col>
                    );
                  })}
                </Row>
                {editArticleCategory === 'प्रदेश' && !editArticleProvince && (
                  <div style={{ marginTop: 8, color: '#ff4d4f', fontWeight: 600, fontSize: '0.82rem' }}>
                    ⚠️ कृपया एउटा प्रदेश चयन गर्नुहोस्। यो अनिवार्य छ!
                  </div>
                )}
              </Card>

              {/* Dedicated Section for Opinion / Analysis in Edit Modal */}
              <Card
                type="inner"
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      ✍️ विचार / विश्लेषण स्तम्भकार विवरण (Writer Profile)
                    </span>
                    {editArticleCategory === 'विचार' ? (
                      <Tag color="purple" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                        * विचार/विश्लेषण
                      </Tag>
                    ) : (
                      <Tag color="default" style={{ borderRadius: 12, padding: '2px 10px' }}>
                        वैकल्पिक
                      </Tag>
                    )}
                  </div>
                }
                style={{
                  borderRadius: 8,
                  border: editArticleCategory === 'विचार' ? '2px solid #722ed1' : '1px solid #d9d9d9',
                  backgroundColor: editArticleCategory === 'विचार' ? '#f9f0ff' : '#fafafa',
                  transition: 'all 0.3s ease',
                }}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>👤 स्तम्भकारको नाम (Writer Name)</Text>
                    <Input
                      name="author"
                      value={editAuthorName}
                      onChange={(e) => setEditAuthorName(e.target.value)}
                      placeholder="उदाहरण: कृष्ण बहाब / रितेश पन्थी"
                    />
                  </Col>

                  <Col xs={24} sm={12}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>🎓 स्तम्भकारको परिचय/भूमिका (Writer Role / Title)</Text>
                    <Input
                      name="authorRole"
                      value={editAuthorRole}
                      onChange={(e) => setEditAuthorRole(e.target.value)}
                      placeholder="उदाहरण: जलवायु राजनीति विज्ञ (सनस्टार विचार)"
                    />
                  </Col>

                  <Col xs={24} sm={16}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>📷 स्तम्भकारको तस्बिर (Writer Photo / Avatar)</Text>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Upload
                        maxCount={1}
                        listType="picture"
                        fileList={editAuthorAvatarFileList}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setEditAuthorAvatarFileList(fileList)}
                        accept="image/*"
                      >
                        <Button size="small" icon={<UploadOutlined />}>फोटो बदल्नुहोस्</Button>
                      </Upload>
                      <Input
                        name="authorImage"
                        value={editAuthorImage}
                        onChange={(e) => setEditAuthorImage(e.target.value)}
                        placeholder="वा फोटोको URL (https://...)"
                        style={{ flex: 1, minWidth: 160 }}
                      />
                    </div>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>⏱️ पठन समय (Reading Time)</Text>
                    <Input
                      name="readTime"
                      value={editReadTime}
                      onChange={(e) => setEditReadTime(e.target.value)}
                      placeholder="उदाहरण: ६ मिनेट पाठ"
                    />
                  </Col>
                </Row>
              </Card>

              <Card title="📷 कभर तथा ग्यालरी तस्बिरहरू (Multiple Images Supported)" type="inner">
                {/* Always-present hidden fields so server knows what the user retained */}
                <input type="hidden" name="retainedImages" value={JSON.stringify(editExistingImages)} />
                <input type="hidden" name="imagesDirty" value="1" />

                {editExistingImages.length > 0 ? (
                  <div style={{ marginBottom: 14 }}>
                    <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>
                      हालका तस्बिरहरू ({editExistingImages.length} ओटा) — कभर बदल्न &quot;कभर बनाउनुहोस्&quot; थिच्नुहोस् वा (✕) बाट हटाउनुहोस्:
                    </Text>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {editExistingImages.map((img: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: idx === 0 ? '2px solid #1890ff' : '1px solid #d9d9d9',
                            boxShadow: idx === 0 ? '0 0 8px rgba(24,144,255,0.4)' : 'none',
                          }}
                        >
                          <img
                            src={img}
                            alt={`Cover ${idx + 1}`}
                            style={{ height: 75, width: 115, objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/sunstar-logo.jpg';
                            }}
                          />
                          {idx === 0 ? (
                            <span
                              style={{
                                position: 'absolute',
                                bottom: 3,
                                left: 3,
                                background: '#1890ff',
                                color: '#fff',
                                fontSize: '10px',
                                padding: '1px 6px',
                                borderRadius: 3,
                                fontWeight: 700,
                              }}
                            >
                              ⭐ मुख्य कभर
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditExistingImages((prev) => [prev[idx], ...prev.filter((_, i) => i !== idx)]);
                              }}
                              style={{
                                position: 'absolute',
                                bottom: 3,
                                left: 3,
                                background: 'rgba(0,0,0,0.75)',
                                border: 'none',
                                borderRadius: 3,
                                color: '#fff',
                                fontSize: '10px',
                                padding: '1px 6px',
                                cursor: 'pointer',
                              }}
                              title="यो तस्बिरलाई मुख्य कभर बनाउनुहोस्"
                            >
                              कभर बनाउनुहोस्
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(idx)}
                            style={{
                              position: 'absolute',
                              top: 3,
                              right: 3,
                              background: '#ff4d4f',
                              border: 'none',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              cursor: 'pointer',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 'bold',
                              lineHeight: 1,
                            }}
                            title="तस्बिर हटाउनुहोस्"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginBottom: 8, color: '#ff4d4f' }}>
                    ⚠️ सबै हालका तस्बिरहरू हटाइएका छन् — तल नयाँ तस्बिर अपलोड गर्नुहोस् वा लिङ्क राख्नुहोस्।
                  </Text>
                )}
                <Row gutter={16}>
                  <Col xs={24} md={14}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>
                      नयाँ तस्बिरहरू थप्नुहोस् (Multiple Max 10)
                      {editArticleFileList.length > 0 && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          {editArticleFileList.length} नयाँ छानियो
                        </Tag>
                      )}
                    </Text>
                    <Upload
                      multiple
                      maxCount={10}
                      listType="picture-card"
                      fileList={editArticleFileList}
                      beforeUpload={(file) => {
                        (file as any).thumbUrl = URL.createObjectURL(file);
                        return false;
                      }}
                      onChange={({ fileList }) => {
                        const withThumbs = fileList.map((f) => {
                          if (!f.thumbUrl && f.originFileObj) {
                            f.thumbUrl = URL.createObjectURL(f.originFileObj);
                          }
                          return f;
                        });
                        setEditArticleFileList(withThumbs.slice(0, 10));
                      }}
                      onRemove={(file) => {
                        setEditArticleFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                      }}
                      accept="image/*"
                    >
                      {editArticleFileList.length >= 10 ? null : (
                        <div>
                          <UploadOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                          <div style={{ marginTop: 6, fontWeight: 600, fontSize: '0.82rem' }}>+ तस्बिर थप्नुहोस्</div>
                          <div style={{ fontSize: '0.68rem', color: '#888' }}>(Multiple)</div>
                        </div>
                      )}
                    </Upload>
                    <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>
                      ⚡ एकैपटक धेरै तस्बिर सेलेक्ट गर्न सक्नुहुन्छ वा पटक-पटक थप्न सक्नुहुन्छ (अधिकतम् १० ओटा)।
                    </Text>
                  </Col>
                  <Col xs={24} md={10}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>🔗 वा नयाँ तस्बिरको लिङ्क (Direct URL)</Text>
                    <Input.TextArea
                      name="imageUrl"
                      placeholder="https://images.unsplash.com/... (एउटा वा धेरै लिङ्कहरू कमा वा नयाँ हरफमा)"
                      defaultValue=""
                      rows={3}
                    />
                    <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      इन्टरनेटबाट लिङ्क राख्न चाहनुहुन्छ भने यहाँ पेस्ट गर्नुहोस्।
                    </Text>
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
        {selectedArticleForComments && (() => {
          const commentsArr = Array.isArray(selectedArticleForComments.commentsList)
            ? selectedArticleForComments.commentsList
            : (Array.isArray(selectedArticleForComments.comments_list) ? selectedArticleForComments.comments_list : []);
          return (
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
                जम्मा प्रतिक्रियाहरू: <Tag color="blue">💬 {commentsArr.length}</Tag>
              </Text>
            </Card>

            <Divider style={{ margin: '4px 0' }} />

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>पाठकका प्रतिक्रिया सूची (Reader Comments):</Text>
              {commentsArr.length === 0 ? (
                <Text type="secondary">यस समाचारमा अझै कुनै प्रतिक्रियाहरू छैनन्।</Text>
              ) : (
                <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {commentsArr.map((c: any, idx: number) => (
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
          );
        })()}
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
