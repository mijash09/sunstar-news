import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export type ImagePreset = 'article' | 'banner' | 'avatar';

export interface ProcessedImageResult {
  url: string;          // Primary image URL (e.g. featured or banner)
  thumbnailUrl?: string; // Optional lower-res thumbnail URL for cards
  width: number;
  height: number;
  format: string;
}

/**
 * Ensures a directory exists on disk.
 */
async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (e) {
    // Ignore error if directory already exists
  }
}

/**
 * Optimizes an uploaded image buffer using Sharp, resizes to fixed dimension ratios,
 * converts to WebP format for optimal low file size compression, and saves to public/uploads directory.
 */
export async function optimizeAndSaveImage(
  buffer: Buffer,
  preset: ImagePreset = 'article',
  filenamePrefix: string = 'img'
): Promise<ProcessedImageResult> {
  const uuid = crypto.randomUUID();
  const baseFilename = `${filenamePrefix}-${uuid}`;
  const uploadsBaseDir = path.join(process.cwd(), 'public', 'uploads');

  if (preset === 'article') {
    const targetDir = path.join(uploadsBaseDir, 'articles');
    await ensureDir(targetDir);

    const featuredFilename = `${baseFilename}-main.webp`;
    const thumbnailFilename = `${baseFilename}-thumb.webp`;

    const featuredPath = path.join(targetDir, featuredFilename);
    const thumbnailPath = path.join(targetDir, thumbnailFilename);

    // 1. Featured Image: Never cut/crop, preserve aspect ratio, decrease size if > 1200px, convert to WebP
    const featuredMeta = await sharp(buffer)
      .resize({ width: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(featuredPath);

    // 2. Thumbnail: Preserve aspect ratio, decrease size if > 600px, convert to WebP
    const thumbMeta = await sharp(buffer)
      .resize({ width: 600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    return {
      url: `/uploads/articles/${featuredFilename}`,
      thumbnailUrl: `/uploads/articles/${thumbnailFilename}`,
      width: featuredMeta.width || 1200,
      height: featuredMeta.height || 675,
      format: 'webp',
    };
  } else if (preset === 'banner') {
    const targetDir = path.join(uploadsBaseDir, 'banners');
    await ensureDir(targetDir);

    const bannerFilename = `${baseFilename}-banner.webp`;
    const bannerPath = path.join(targetDir, bannerFilename);

    // Banner Image: Never cut/crop the banner (preserve logos, text, contact info)!
    // Only decrease size if width > 1200px, preserve original aspect ratio, convert to WebP
    const bannerMeta = await sharp(buffer)
      .resize({ width: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(bannerPath);

    return {
      url: `/uploads/banners/${bannerFilename}`,
      width: bannerMeta.width || 1200,
      height: bannerMeta.height || 400,
      format: 'webp',
    };
  } else {
    // avatar preset
    const targetDir = path.join(uploadsBaseDir, 'avatars');
    await ensureDir(targetDir);

    const avatarFilename = `${baseFilename}-avatar.webp`;
    const avatarPath = path.join(targetDir, avatarFilename);

    // Avatar Image: Resize without cropping, convert to WebP
    const avatarMeta = await sharp(buffer)
      .resize({ width: 400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(avatarPath);

    return {
      url: `/uploads/avatars/${avatarFilename}`,
      width: avatarMeta.width || 400,
      height: avatarMeta.height || 400,
      format: 'webp',
    };
  }
}

/**
 * Process multiple uploaded image buffers in batch with Sharp optimization.
 */
export async function optimizeAndSaveMultipleImages(
  buffers: Buffer[],
  preset: ImagePreset = 'article',
  filenamePrefix: string = 'img'
): Promise<ProcessedImageResult[]> {
  if (!buffers || buffers.length === 0) return [];
  const results = await Promise.all(
    buffers.map((buf, i) => optimizeAndSaveImage(buf, preset, `${filenamePrefix}-${i + 1}`))
  );
  return results;
}

/**
 * Safely deletes a local uploaded image file (and its thumbnail counterpart if present)
 * from the public/uploads filesystem directory.
 */
export async function deleteLocalImageFile(imageUrl: string): Promise<boolean> {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  if (!imageUrl.startsWith('/uploads/')) return false;

  try {
    const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    const fullPath = path.join(process.cwd(), 'public', relativePath);

    // Try deleting primary file
    try {
      await fs.unlink(fullPath);
    } catch (e) {}

    // If it was a 16x9 featured article image, try deleting matching thumb file
    if (fullPath.includes('-16x9.webp')) {
      const thumbPath = fullPath.replace('-16x9.webp', '-thumb.webp');
      try {
        await fs.unlink(thumbPath);
      } catch (e) {}
    }

    return true;
  } catch (err) {
    console.warn('Could not delete old image file:', imageUrl, (err as any)?.message);
    return false;
  }
}
