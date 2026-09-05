'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { requireAuth, UserRole } from '@/lib/auth';

// 1. Create Article (Allowed for EDITOR and ADMIN)
export async function createArticleAction(formData: FormData) {
  const user = await requireAuth(['ADMIN', 'EDITOR']);

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const summary = formData.get('summary') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as string;

  if (!title || !category) {
    return { error: 'शीर्षक र वर्ग आवश्यक छ (Title and category are required)' };
  }

  const id = `db-art-${Date.now()}`;

  await sql`
    INSERT INTO db_articles (id, title, category, summary, content, image, author, source, published)
    VALUES (${id}, ${title}, ${category}, ${summary || ''}, ${content || ''}, ${image || ''}, ${user.name}, ${'SunstarNews.com'}, TRUE)
  `;

  revalidatePath('/');
  revalidatePath('/dashboard');
  return { success: 'समाचार सफलतापूर्वक थपियो! (Article added successfully)' };
}

// 2. Delete Article (Allowed for EDITOR and ADMIN)
export async function deleteArticleAction(articleId: string): Promise<{ success?: string; error?: string }> {
  try {
    await requireAuth(['ADMIN', 'EDITOR']);

    await sql`
      DELETE FROM db_articles WHERE id = ${articleId}
    `;

    revalidatePath('/');
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
    const currentUser = await requireAuth(['ADMIN']);

    if (targetUserId === currentUser.id) {
      return { error: 'तपाईं आफ्नो भूमिका आफैं परिवर्तन गर्न सक्नुहुन्न (Cannot change your own role)' };
    }

    await sql`
      UPDATE users SET role = ${newRole} WHERE id = ${targetUserId}
    `;

    revalidatePath('/dashboard');
    return { success: `प्रयोगकर्ता भूमिका ${newRole} मा परिवर्तन गरियो` };
  } catch (err: any) {
    return { error: err.message || 'भूमिका परिवर्तन गर्दा त्रुटि भयो' };
  }
}

// 4. Create New Staff User (STRICTLY ALLOWED FOR ADMIN ONLY)
export async function createStaffUserAction(formData: FormData) {
  await requireAuth(['ADMIN']);

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as UserRole) || 'EDITOR';

  if (!name || !email || !password) {
    return { error: 'सबै विवरणहरू भर्नुहोस् (All fields required)' };
  }

  const existing = await sql`
    SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
  `;

  if (existing.length > 0) {
    return { error: 'यो इमैल पहिल्यै प्रयोगमा छ (Email already registered)' };
  }

  const passHash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO users (email, name, password_hash, role)
    VALUES (${email.toLowerCase().trim()}, ${name}, ${passHash}, ${role})
  `;

  revalidatePath('/dashboard');
  return { success: 'नयाँ कर्मचारी खाता सफलतापूर्वक सिर्जना गरियो' };
}
