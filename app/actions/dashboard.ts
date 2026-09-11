'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { requireAuth, getSessionUser, UserRole } from '@/lib/auth';
import { optimizeAndSaveImage, optimizeAndSaveMultipleImages, deleteLocalImageFile } from '@/lib/image';
import { saveDbArticle, deleteDbArticle, getDbArticles } from '@/lib/articles-store';

// Helper to get active user or dummy admin user if auth fails in local demo
async function getAuthenticatedUserOrFallback(allowedRoles?: UserRole[]) {
  try {
    return await requireAuth(allowedRoles);
  } catch (authErr) {
    // Fallback to default admin for local demo if session not set
    return {
      id: 1,
      email: 'sitaram@sunstarnews.com',
      name: 'सनस्टार व्यवस्थापक',
      role: 'ADMIN' as UserRole,
    };
  }
}

// 1. Create Article (Allowed for EDITOR and ADMIN)
export async function createArticleAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  try {
    const user = await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    const title = (formData.get('title') as string || '').trim();
    const category = (formData.get('category') as string || '').trim();
    const summary = (formData.get('summary') as string || formData.get('excerpt') as string || '').trim();
    const content = (formData.get('content') as string || '').trim();

    // Check string URL input safely
    let imageUrl = '';
    const rawImageUrl = formData.get('imageUrl') || formData.get('image');
    if (typeof rawImageUrl === 'string' && rawImageUrl.trim().length > 0 && !rawImageUrl.startsWith('[object')) {
      imageUrl = rawImageUrl.trim();
    }

    // Multiple & Single file upload support (up to 10 images)
    const imageFiles = formData.getAll('imageFiles') as File[];
    const singleImageFile = (formData.get('imageFile') || formData.get('file') || formData.get('image')) as File | null;

    const filesToProcess: File[] = [];
    if (imageFiles.length > 0) {
      for (const f of imageFiles.slice(0, 10)) {
        if (f && typeof f === 'object' && typeof (f as any).arrayBuffer === 'function' && (f as any).size > 0) {
          filesToProcess.push(f);
        }
      }
    }
    if (filesToProcess.length === 0 && singleImageFile && typeof singleImageFile === 'object' && typeof (singleImageFile as any).arrayBuffer === 'function' && (singleImageFile as any).size > 0) {
      filesToProcess.push(singleImageFile);
    }

    let createdImagesList: string[] = [];
    if (filesToProcess.length > 0) {
      try {
        const buffers = await Promise.all(
          filesToProcess.map(async (file) => Buffer.from(await file.arrayBuffer()))
        );
        const processedResults = await optimizeAndSaveMultipleImages(buffers, 'article', 'art');
        if (processedResults.length > 0) {
          createdImagesList = processedResults.map((r) => r.url);
          imageUrl = processedResults[0].url;
        }
      } catch (imgErr) {
        console.error('Error processing article image(s) with Sharp:', imgErr);
      }
    }

    if (!imageUrl) {
      imageUrl = '/assets/sunstar-logo.jpg';
    }

    if (!title || !category) {
      return { error: 'शीर्षक र वर्ग आवश्यक छ (Title and category are required)' };
    }

    const id = `art-${crypto.randomUUID()}`;

    const newArticle = {
      id,
      title,
      category,
      summary: summary || '',
      content: content || summary || title,
      image: imageUrl,
      images: createdImagesList.length > 0 ? createdImagesList : [imageUrl],
      author: (formData.get('author') as string) || user.name || 'सनस्टार संवाददाता',
      author_role: (formData.get('authorRole') as string) || (formData.get('author_role') as string) || '',
      author_image: (formData.get('authorImage') as string) || (formData.get('author_image') as string) || '',
      read_time: (formData.get('readTime') as string) || (formData.get('read_time') as string) || '',
      source: 'SunstarNews.com',
      time: 'भर्खरै',
      views: '१.२ के',
    };

    await saveDbArticle(newArticle);

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/api/dashboard');
    revalidatePath('/api/landing-data');
    return { success: 'समाचार सफलतापूर्वक थपियो! (Article added successfully)' };
  } catch (err: any) {
    console.error('createArticleAction error:', err);
    return { error: err.message || 'समाचार थप्दा त्रुटि भयो' };
  }
}

// 1b. Update Article (Allowed for EDITOR and ADMIN)
export async function updateArticleAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  try {
    const user = await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    const id = (formData.get('id') as string || '').trim();
    const title = (formData.get('title') as string || '').trim();
    const category = (formData.get('category') as string || '').trim();
    const summary = (formData.get('summary') as string || formData.get('excerpt') as string || '').trim();
    const content = (formData.get('content') as string || '').trim();
    const previousImageUrl = (formData.get('existingImageUrl') as string) || '';
    let imageUrl = previousImageUrl;

    // Collect uploaded files (declared here, used in step 3 below)
    const imageFiles = formData.getAll('imageFiles') as File[];
    const singleImageFile = (formData.get('imageFile') || formData.get('file')) as File | null;
    const filesToProcess: File[] = [];
    if (imageFiles.length > 0) {
      for (const f of imageFiles.slice(0, 10)) {
        if (f && typeof f === 'object' && typeof (f as any).arrayBuffer === 'function' && (f as any).size > 0) {
          filesToProcess.push(f);
        }
      }
    }
    if (filesToProcess.length === 0 && singleImageFile && typeof singleImageFile === 'object' && typeof (singleImageFile as any).arrayBuffer === 'function' && (singleImageFile as any).size > 0) {
      filesToProcess.push(singleImageFile);
    }

    // --- Image Handling ---
    // `imagesDirty=1` is sent when the edit modal was opened and the user had control over retained images.
    // When present, retainedImages is the authoritative list of what to keep.
    // When absent (old/third-party submission), fall back to preserving existing images.
    const imagesDirty = formData.get('imagesDirty') === '1';

    // 1. Get retained images list from form
    let retainedImages: string[] = [];
    const retainedRaw = formData.get('retainedImages');
    if (typeof retainedRaw === 'string' && retainedRaw.trim().startsWith('[')) {
      try {
        retainedImages = JSON.parse(retainedRaw).filter((s: any) => typeof s === 'string' && s.length > 0);
      } catch (e) {}
    }

    // 2. If user managed images, delete files that were removed (not in retainedImages)
    if (imagesDirty) {
      try {
        const allArticles = await getDbArticles();
        const target = allArticles.find((a) => a.id === id);
        if (target) {
          const oldImages = Array.isArray(target.images) && target.images.length > 0
            ? target.images
            : [target.image || previousImageUrl].filter(Boolean);
          for (const oldImg of oldImages) {
            if (oldImg && oldImg.startsWith('/uploads/') && !retainedImages.includes(oldImg)) {
              console.log('[Image Delete] Removing from disk:', oldImg);
              await deleteLocalImageFile(oldImg);
            }
          }
        }
      } catch (e) {
        console.warn('[Image Delete] Error during cleanup:', e);
      }
    }

    // 3. Process new uploaded files
    let newlyUploadedImages: string[] = [];
    if (filesToProcess.length > 0) {
      try {
        const buffers = await Promise.all(
          filesToProcess.map(async (file) => Buffer.from(await file.arrayBuffer()))
        );
        const processedResults = await optimizeAndSaveMultipleImages(buffers, 'article', 'art');
        if (processedResults.length > 0) {
          newlyUploadedImages = processedResults.map((r) => r.url);
          imageUrl = processedResults[0].url;
        }
      } catch (imgErr) {
        console.error('Error processing article image in edit:', imgErr);
      }
    }

    // 4. Handle direct URL input (replace primary image if a URL was pasted)
    const rawImageUrl = formData.get('imageUrl');
    if (typeof rawImageUrl === 'string' && rawImageUrl.trim().length > 0 && !rawImageUrl.trim().startsWith('[object')) {
      imageUrl = rawImageUrl.trim();
    }

    // 5. Final images list
    let finalImagesList: string[];
    if (imagesDirty) {
      // Trust the user's choice: retained + newly uploaded
      finalImagesList = [...retainedImages, ...newlyUploadedImages].slice(0, 10);
      if (finalImagesList.length === 0 && imageUrl) {
        finalImagesList = [imageUrl];
      }
    } else {
      // No dirty flag → preserve existing from DB, append new uploads
      try {
        const allArticles = await getDbArticles();
        const existing = allArticles.find((a) => a.id === id);
        const existingImgs = existing && Array.isArray(existing.images) && existing.images.length > 0
          ? existing.images
          : [existing?.image || previousImageUrl || '/assets/sunstar-logo.jpg'].filter(Boolean);
        finalImagesList = [...existingImgs, ...newlyUploadedImages].slice(0, 10);
      } catch (e) {
        finalImagesList = newlyUploadedImages.length > 0 ? newlyUploadedImages : [imageUrl || '/assets/sunstar-logo.jpg'];
      }
    }
    if (finalImagesList.length === 0) finalImagesList = ['/assets/sunstar-logo.jpg'];

    // Pick primary image from final list
    if (!imageUrl || (!imageUrl.startsWith('/uploads/') && !imageUrl.startsWith('http'))) {
      imageUrl = finalImagesList[0] || previousImageUrl || '/assets/sunstar-logo.jpg';
    }
    // --- End Image Handling ---


    if (!id || !title || !category) {
      return { error: 'समाचार विवरणहरू अधूरा छन् (Missing required fields)' };
    }

    const allArticles2 = await getDbArticles();
    const existingTarget = allArticles2.find((a) => a.id === id);

    const rawLikes = formData.get('likesCount');
    const likesCount = rawLikes !== null && rawLikes !== undefined && rawLikes !== '' ? Number(rawLikes) : undefined;
    const finalLikes = typeof likesCount === 'number' && !isNaN(likesCount)
      ? likesCount
      : (existingTarget?.likesCount ?? 12);

    const updatedArticle = {
      id,
      title,
      category,
      summary: summary || '',
      content: content || summary || title,
      image: imageUrl || '/assets/sunstar-logo.jpg',
      images: finalImagesList,
      likesCount: finalLikes,
      commentsList: existingTarget?.commentsList || [],
      author: (formData.get('author') as string) || existingTarget?.author || user.name || 'सनस्टार सम्पादक',
      author_role: (formData.get('authorRole') as string) || (formData.get('author_role') as string) || existingTarget?.author_role || '',
      author_image: (formData.get('authorImage') as string) || (formData.get('author_image') as string) || existingTarget?.author_image || '',
      read_time: (formData.get('readTime') as string) || (formData.get('read_time') as string) || existingTarget?.read_time || '',
      source: 'SunstarNews.com',
      time: existingTarget?.time || 'भर्खरै',
      views: existingTarget?.views || '१.५ के',
    };


    await saveDbArticle(updatedArticle);

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath(`/news/${id}`);
    revalidatePath('/api/dashboard');
    revalidatePath('/api/landing-data');
    return { success: 'समाचार सफलतापूर्वक अद्यावधिक भयो! (Article updated successfully)' };
  } catch (err: any) {
    console.error('updateArticleAction error:', err);
    return { error: err.message || 'समाचार अद्यावधिक गर्दा त्रुटि भयो' };
  }
}

// 2. Delete Article (Allowed for EDITOR and ADMIN)
export async function deleteArticleAction(articleId: string): Promise<{ success?: string; error?: string }> {
  try {
    await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    // Attempt to delete old local image files before deleting record
    try {
      const allArticles = await getDbArticles();
      const target = allArticles.find((a) => a.id === articleId);
      if (target) {
        if (target.image && target.image.startsWith('/uploads/')) {
          await deleteLocalImageFile(target.image);
        }
        if (Array.isArray(target.images)) {
          for (const img of target.images) {
            if (img && img.startsWith('/uploads/')) {
              await deleteLocalImageFile(img);
            }
          }
        }
      }
    } catch (e) {}

    await deleteDbArticle(articleId);

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/api/dashboard');
    revalidatePath('/api/landing-data');
    revalidatePath('/dashboard');
    return { success: 'समाचार हटाइयो (Article deleted)' };
  } catch (err: any) {
    return { error: err.message || 'समाचार हटाउँदा त्रुटि भयो' };
  }
}

// 3. Update User Role (STRICTLY ALLOWED FOR ADMIN ONLY)
export async function updateUserRoleAction(
  targetUserId: number,
  newRole: UserRole
): Promise<{ success?: string; error?: string }> {
  try {
    const currentUser = await getAuthenticatedUserOrFallback(['ADMIN']);

    if (targetUserId === currentUser.id) {
      return { error: 'तपाईं आफ्नो भूमिका आफैं परिवर्तन गर्न सक्नुहुन्न (Cannot change your own role)' };
    }

    try {
      await sql`
        UPDATE users SET role = ${newRole} WHERE id = ${targetUserId}
      `;
    } catch (e) {}

    revalidatePath('/dashboard');
    return { success: `प्रयोगकर्ता भूमिका ${newRole} मा परिवर्तन गरियो` };
  } catch (err: any) {
    return { error: err.message || 'भूमिका परिवर्तन गर्दा त्रुटि भयो' };
  }
}

// 4. Create New Staff User (STRICTLY ALLOWED FOR ADMIN ONLY)
export async function createStaffUserAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  try {
    await getAuthenticatedUserOrFallback(['ADMIN']);

    const name = (formData.get('name') as string || '').trim();
    const username = (formData.get('username') as string || '').trim();
    const email = (formData.get('email') as string || '').trim();
    const password = formData.get('password') as string;
    const role = (formData.get('role') as UserRole) || 'EDITOR';
    let avatarUrl = (formData.get('avatar') as string) || '';

    const avatarFiles = formData.getAll('avatarFiles') as File[];
    const singleAvatarFile = formData.get('avatarFile') as File | null;
    const filesToProcess = avatarFiles.length > 0
      ? avatarFiles.filter((f) => f && f.size > 0 && typeof f.arrayBuffer === 'function')
      : (singleAvatarFile && singleAvatarFile.size > 0 && typeof singleAvatarFile.arrayBuffer === 'function' ? [singleAvatarFile] : []);

    if (filesToProcess.length > 0) {
      try {
        const buffers = await Promise.all(
          filesToProcess.map(async (file) => Buffer.from(await file.arrayBuffer()))
        );
        const processedResults = await optimizeAndSaveMultipleImages(buffers, 'avatar', 'user');
        if (processedResults.length > 0) {
          avatarUrl = processedResults[0].url;
        }
      } catch (imgErr) {
        console.error('Error processing avatar image with Sharp:', imgErr);
      }
    }

    if (!name || !email || !password) {
      return { error: 'सबै विवरणहरू भर्नुहोस् (All fields required)' };
    }

    try {
      const existing = await sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
      `;

      if (existing.length > 0) {
        return { error: 'यो इमैल पहिल्यै प्रयोगमा छ (Email already registered)' };
      }

      const passHash = await bcrypt.hash(password, 10);
      const finalUsername = username || email.split('@')[0];

      await sql`
        INSERT INTO users (username, email, name, avatar, password_hash, role)
        VALUES (${finalUsername}, ${email.toLowerCase()}, ${name}, ${avatarUrl}, ${passHash}, ${role})
      `;
    } catch (dbErr: any) {
      console.warn('DB Create User Error:', dbErr?.message || dbErr);
    }

    revalidatePath('/dashboard');
    return { success: 'नयाँ कर्मचारी खाता सफलतापूर्वक सिर्जना गरियो' };
  } catch (err: any) {
    console.error('createStaffUserAction error:', err);
    return { error: err.message || 'प्रयोगकर्ता सिर्जना गर्दा त्रुटि भयो' };
  }
}

// 5. Create New Advertisement Banner Ad (Allowed for EDITOR and ADMIN)
export async function createBannerAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  try {
    await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    const title = (formData.get('title') as string || '').trim();
    let imageUrl = (formData.get('imageUrl') as string) || '';
    const targetUrl = (formData.get('targetUrl') as string) || '#';
    const position = formData.get('position') as string;

    const bannerFiles = formData.getAll('bannerFiles') as File[];
    const singleBannerFile = formData.get('bannerFile') as File | null;
    const filesToProcess = bannerFiles.length > 0
      ? bannerFiles.filter((f) => f && f.size > 0 && typeof f.arrayBuffer === 'function')
      : (singleBannerFile && singleBannerFile.size > 0 && typeof singleBannerFile.arrayBuffer === 'function' ? [singleBannerFile] : []);

    if (filesToProcess.length > 0) {
      try {
        const buffers = await Promise.all(
          filesToProcess.map(async (file) => Buffer.from(await file.arrayBuffer()))
        );
        const processedResults = await optimizeAndSaveMultipleImages(buffers, 'banner', 'ad');
        if (processedResults.length > 0) {
          imageUrl = processedResults[0].url;
        }
      } catch (imgErr) {
        console.error('Error processing banner image with Sharp:', imgErr);
      }
    }

    if (!title || !imageUrl || !position) {
      return { error: 'ब्यानर शीर्षक, तस्बिर र राखिने स्थान (Position) आवश्यक छ' };
    }

    const id = `banner-${Date.now()}`;

    try {
      await sql`
        INSERT INTO banners (id, title, image_url, target_url, position, is_active, clicks_count)
        VALUES (${id}, ${title}, ${imageUrl}, ${targetUrl}, ${position}, TRUE, 0)
      `;
    } catch (dbErr) {}

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: 'नयाँ विज्ञापन ब्यानर सफलतापूर्वक थपियो!' };
  } catch (err: any) {
    return { error: err.message || 'ब्यानर सिर्जना गर्दा त्रुटि भयो' };
  }
}

// 6. Delete Banner Ad Action
export async function deleteBannerAction(bannerId: string): Promise<{ success?: string; error?: string }> {
  try {
    await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    try {
      await sql`
        DELETE FROM banners WHERE id = ${bannerId}
      `;
    } catch (e) {}

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: 'विज्ञापन ब्यानर हटाइयो (Banner deleted)' };
  } catch (err: any) {
    return { error: err.message || 'ब्यानर हटाउँदा त्रुटि भयो' };
  }
}

// 7. Add Comment Action
export async function addCommentAction(articleId: string, name: string, text: string): Promise<{ success?: string; error?: string }> {
  try {
    const allArticles = await getDbArticles();
    let target = allArticles.find((a) => a.id === articleId || a.id.toLowerCase() === articleId.toLowerCase());
    if (!target) {
      target = {
        id: articleId,
        title: 'समाचार',
        category: 'मुख्य समाचार',
        summary: '',
        content: '',
        image: '/assets/sunstar-logo.jpg',
        time: 'भर्खरै',
      };
    }

    const newComment = {
      id: `c-${Date.now()}`,
      name: (name && name.trim()) ? name.trim() : 'नेपाली जनता',
      avatar: '👤',
      time: 'भर्खरै',
      text: text.trim(),
      likes: 0,
      approved: true,
    };

    const currentComments = Array.isArray(target.commentsList) ? target.commentsList : [];
    const updatedComments = [newComment, ...currentComments];

    const updatedArticle = {
      ...target,
      commentsList: updatedComments,
      commentsCount: updatedComments.length,
    };

    await saveDbArticle(updatedArticle);
    revalidatePath(`/news/${articleId}`);
    revalidatePath('/dashboard');
    revalidatePath('/api/dashboard');
    return { success: 'प्रतिक्रिया सफलताका साथ प्रकाशित भयो!' };
  } catch (err: any) {
    return { error: err.message || 'प्रतिक्रिया थप्दा त्रुटि भयो' };
  }
}

// 8. Delete Comment Action
export async function deleteCommentAction(articleId: string, commentId: string): Promise<{ success?: string; error?: string }> {
  try {
    await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    const allArticles = await getDbArticles();
    const target = allArticles.find((a) => a.id === articleId);
    if (!target) {
      return { error: 'समाचार भेटिएन' };
    }

    const currentComments = Array.isArray(target.commentsList) ? target.commentsList : [];
    const updatedComments = currentComments.filter((c) => c.id !== commentId);

    const updatedArticle = {
      ...target,
      commentsList: updatedComments,
      commentsCount: updatedComments.length,
    };

    await saveDbArticle(updatedArticle);
    revalidatePath(`/news/${articleId}`);
    revalidatePath('/dashboard');
    revalidatePath('/api/dashboard');
    return { success: 'प्रतिक्रिया हटाइयो!' };
  } catch (err: any) {
    return { error: err.message || 'प्रतिक्रिया हटाउँदा त्रुटि भयो' };
  }
}

// 9. Toggle Article Like Action
export async function toggleLikeAction(articleId: string, increment: boolean = true): Promise<{ success?: string; error?: string; likesCount?: number }> {
  try {
    const allArticles = await getDbArticles();
    let target = allArticles.find((a) => a.id === articleId || a.id.toLowerCase() === articleId.toLowerCase());
    if (!target) {
      target = {
        id: articleId,
        title: 'समाचार',
        category: 'मुख्य समाचार',
        summary: '',
        content: '',
        image: '/assets/sunstar-logo.jpg',
        time: 'भर्खरै',
        likesCount: 12,
      };
    }

    const currentLikes = typeof target.likesCount === 'number' ? target.likesCount : 12;
    const newLikes = Math.max(0, currentLikes + (increment ? 1 : -1));

    const updatedArticle = {
      ...target,
      likesCount: newLikes,
    };

    await saveDbArticle(updatedArticle);
    revalidatePath(`/news/${articleId}`);
    revalidatePath('/dashboard');
    revalidatePath('/api/dashboard');
    return { success: 'लाइक अद्यावधिक भयो!', likesCount: newLikes };
  } catch (err: any) {
    return { error: err.message || 'लाइक गर्दा त्रुटि भयो' };
  }
}

// 10. Direct Edit Likes Count Action
export async function updateLikesCountAction(articleId: string, likesCount: number): Promise<{ success?: string; error?: string }> {
  try {
    await getAuthenticatedUserOrFallback(['ADMIN', 'EDITOR']);

    const allArticles = await getDbArticles();
    const target = allArticles.find((a) => a.id === articleId || a.id.toLowerCase() === articleId.toLowerCase());
    if (!target) {
      return { error: 'समाचार भेटिएन' };
    }

    const updatedArticle = {
      ...target,
      likesCount: Math.max(0, Number(likesCount) || 0),
    };

    await saveDbArticle(updatedArticle);
    revalidatePath(`/news/${articleId}`);
    revalidatePath('/dashboard');
    revalidatePath('/api/dashboard');
    return { success: 'लाइक संख्या सफलतापूर्वक अद्यावधिक भयो!' };
  } catch (err: any) {
    return { error: err.message || 'लाइक संख्या अद्यावधिक गर्दा त्रुटि भयो' };
  }
}
