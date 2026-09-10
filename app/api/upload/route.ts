import { NextRequest, NextResponse } from 'next/server';
import { optimizeAndSaveImage, optimizeAndSaveMultipleImages, ImagePreset } from '@/lib/image';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user authentication or fallback
    const user = await getSessionUser();

    // 2. Parse FormData
    const formData = await req.formData();
    const preset = (formData.get('preset') as ImagePreset) || 'article';

    // Check for multiple files ('files') or single file ('file')
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles = files.length > 0 ? files.filter(f => f && f.size > 0) : (singleFile && singleFile.size > 0 ? [singleFile] : []);

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: 'कुनै तस्बिर फाइल अपलोड गरिएको छैन (No image file provided)' },
        { status: 400 }
      );
    }

    // Convert all files to buffers
    const buffers: Buffer[] = await Promise.all(
      allFiles.map(async (file) => Buffer.from(await file.arrayBuffer()))
    );

    // Process and optimize all images with Sharp (standardized ratio, WebP low file size)
    const results = await optimizeAndSaveMultipleImages(buffers, preset, 'upload');

    return NextResponse.json({
      success: true,
      message: `${results.length} वटा तस्बिर(हरू) सफलतापूर्वक अप्टिमाइज गरी सेभ गरियो`,
      data: results[0],
      urls: results.map((r) => r.url),
      results,
    });
  } catch (err: any) {
    console.error('Image Upload Error:', err);
    return NextResponse.json(
      { error: err.message || 'तस्बिर अपलोड गर्दा त्रुटि भयो' },
      { status: 500 }
    );
  }
}
