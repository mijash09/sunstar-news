import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import SUNSTAR_DATA, { BannerAd, RashifalItem } from '@/lib/data';
import { sql } from '@/lib/db';
import { getBreakingNews, saveBreakingNews } from '@/lib/settings-store';
import { createArticleAction, updateArticleAction, deleteArticleAction, createStaffUserAction, createBannerAction, deleteBannerAction, updateUserRoleAction, addCommentAction, deleteCommentAction, toggleLikeAction, updateLikesCountAction } from '@/app/actions/dashboard';
import { getDbArticles } from '@/lib/articles-store';
import { dashboardLimiter, commentLimiter, likeLimiter, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let breakingNews: string[] = [];
    try {
      breakingNews = await getBreakingNews();
    } catch (e) {
      breakingNews = SUNSTAR_DATA.breakingNews || [];
    }

    // Only real DB/cache articles — no dummy static data
    let articles: any[] = [];
    try {
      articles = await getDbArticles();
    } catch (e) {
      articles = [];
    }

    let banners = SUNSTAR_DATA.banners || [];
    try {
      const dbBanners = await sql`SELECT id, title, image_url as imageUrl, target_url as targetUrl, position, is_active as isActive, clicks_count as clicksCount FROM banners ORDER BY created_at DESC`;
      if (dbBanners.length > 0) {
        banners = dbBanners.map((b: any) => ({
          ...b,
          isActive: Boolean(b.isActive),
        }));
      }
    } catch (e) {}

    let users: any[] = [];
    try {
      const dbUsers = await sql`SELECT id, name, username, email, role, avatar FROM users ORDER BY created_at DESC`;
      if (dbUsers.length > 0) {
        users = dbUsers;
      }
    } catch (e) {}

    const stats = {
      totalArticles: articles.length,
      totalBanners: banners.length,
      activeBanners: banners.filter((b: BannerAd) => b.isActive).length,
      totalUsers: users.length,
      totalViews: '१,२५,४००+',
      monthlyVisitors: '४५,०००+',
    };

    return NextResponse.json({
      success: true,
      stats,
      articles,
      banners,
      users,
      rashifal: SUNSTAR_DATA.rashifal || [],
      breakingNews,
    });
  } catch (error: any) {
    console.error('API /api/dashboard GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'ड्यासबोर्ड डेटा लोड गर्दा त्रुटि भयो',
    }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // General dashboard rate limit: 120 requests/minute
    const dl = dashboardLimiter.check(ip);
    if (!dl.success) return rateLimitResponse(dl.retryAfterMs);

    const contentType = request.headers.get('content-type') || '';
    
    // Check if multipart form data or json
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const actionType = formData.get('actionType') as string;

      if (actionType === 'create-article') {
        const res = await createArticleAction(formData);
        if (res?.error) {
          return NextResponse.json({ success: false, error: res.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: res.success });
      }

      if (actionType === 'update-article' || actionType === 'edit-article') {
        const res = await updateArticleAction(formData);
        if (res?.error) {
          return NextResponse.json({ success: false, error: res.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: res.success });
      }

      if (actionType === 'create-user') {
        const res = await createStaffUserAction(formData);
        if (res?.error) {
          return NextResponse.json({ success: false, error: res.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: res.success });
      }

      if (actionType === 'create-banner') {
        const res = await createBannerAction(formData);
        if (res?.error) {
          return NextResponse.json({ success: false, error: res.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: res.success });
      }
    }

    const body = await request.json();
    const { action, id, articleId, commentId, name, text, increment, role, rashifalItem, breakingNews } = body;

    if (action === 'delete-article') {
      const res = await deleteArticleAction(id);
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success });
    }

    if (action === 'add-comment') {
      // Stricter limit: 10 comments per minute per IP
      const cl = commentLimiter.check(ip);
      if (!cl.success) return rateLimitResponse(cl.retryAfterMs);
      const targetArtId = articleId || id;
      const res = await addCommentAction(targetArtId, name, text);
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success });
    }

    if (action === 'delete-comment') {
      const res = await deleteCommentAction(articleId, commentId);
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success });
    }

    if (action === 'toggle-like') {
      // Limit: 30 likes per minute per IP
      const ll = likeLimiter.check(ip);
      if (!ll.success) return rateLimitResponse(ll.retryAfterMs);
      const targetArtId = articleId || id;
      const res = await toggleLikeAction(targetArtId, increment);
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success, likesCount: res.likesCount });
    }

    if (action === 'update-likes') {
      const targetArtId = articleId || id;
      const res = await updateLikesCountAction(targetArtId, Number(body.likesCount));
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success });
    }

    if (action === 'delete-banner') {
      const res = await deleteBannerAction(id);
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success });
    }

    if (action === 'update-role') {
      const res = await updateUserRoleAction(Number(id), role);
      if (res?.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.success });
    }

    if (action === 'update-rashifal') {
      if (SUNSTAR_DATA.rashifal && rashifalItem) {
        SUNSTAR_DATA.rashifal = SUNSTAR_DATA.rashifal.map((r: RashifalItem) =>
          r.id === rashifalItem.id ? rashifalItem : r
        );
      }
      return NextResponse.json({
        success: true,
        message: `${rashifalItem?.sign || ''} राशिको भविष्यफल अद्यावधिक भयो!`,
      });
    }

    if (action === 'update-breaking-news') {
      const itemsList: string[] = Array.isArray(breakingNews)
        ? breakingNews
        : (Array.isArray(body.items) ? body.items : []);
      if (itemsList.length > 0) {
        await saveBreakingNews(itemsList);
        revalidatePath('/');
        revalidatePath('/dashboard');
      }
      return NextResponse.json({
        success: true,
        message: `भर्खरै समाचार टिकर अद्यावधिक भयो (${itemsList.length} वटा समाचार सक्रिय)!`,
      });
    }

    return NextResponse.json({ success: false, error: 'अमान्य अनुरोध (Invalid action)' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/dashboard POST error:', error);
    return NextResponse.json({ success: false, error: error.message || 'त्रुटि भयो' }, { status: 500 });
  }
}
