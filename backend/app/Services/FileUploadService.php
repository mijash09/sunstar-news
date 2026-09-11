<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class FileUploadService
{
    /**
     * Save an uploaded file directly into public/uploads and storage/app/public/uploads
     *
     * @param UploadedFile|null $file
     * @param string $prefix
     * @return string|null Full public URL or null on failure
     */
    public static function saveFile($file, string $prefix = ''): ?string
    {
        if (!$file || !($file instanceof UploadedFile) || !$file->isValid()) {
            return null;
        }

        try {
            $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            // Clean extension of any dangerous chars
            $ext = preg_replace('/[^a-z0-9]/', '', $ext) ?: 'jpg';
            $filename = ($prefix ? ($prefix . '_') : '') . Str::random(24) . '.' . $ext;

            // 1. Ensure public/uploads exists
            $publicUploads = public_path('uploads');
            if (!file_exists($publicUploads)) {
                @mkdir($publicUploads, 0777, true);
            }
            @chmod($publicUploads, 0777);

            // 2. Ensure storage/app/public/uploads exists
            $storageUploads = storage_path('app/public/uploads');
            if (!file_exists($storageUploads)) {
                @mkdir($storageUploads, 0777, true);
            }
            @chmod($storageUploads, 0777);

            // Move uploaded file to public/uploads using native move_uploaded_file
            $file->move($publicUploads, $filename);
            $publicFile = $publicUploads . DIRECTORY_SEPARATOR . $filename;
            @chmod($publicFile, 0664);

            // Make backup copy in storage/app/public/uploads
            @copy($publicFile, $storageUploads . DIRECTORY_SEPARATOR . $filename);

            return self::buildFileUrl($filename);
        } catch (\Throwable $e) {
            Log::error('FileUploadService::saveFile failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Build the absolute public URL for an uploaded file name
     */
    public static function buildFileUrl(string $filename): string
    {
        $baseUrl = rtrim((string)config('app.url'), '/');
        if (empty($baseUrl) || str_contains($baseUrl, 'localhost') || str_contains($baseUrl, '127.0.0.1')) {
            $isHttps = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === '1'))
                || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
            $scheme = $isHttps ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'] ?? 'api.sunstarnews.com';
            $baseUrl = $scheme . '://' . $host;
        }

        return $baseUrl . '/uploads/' . $filename;
    }

    /**
     * Determine if a string is a valid image URL or path
     * Filters out dummy strings (like "Ut consequatur hic", lorem ipsum, [object Object])
     */
    public static function isValidImageUrl(?string $url): bool
    {
        if (empty($url) || !is_string($url)) {
            return false;
        }
        $url = trim($url);
        if (str_starts_with($url, '[object') || str_starts_with($url, 'blob:')) {
            return false;
        }
        // Must start with http://, https://, /, or data:image/
        return (bool) preg_match('/^(https?:\/\/|\/|data:image\/)/i', $url);
    }

    /**
     * Normalize image URL so it has absolute domain if it's a relative path
     */
    public static function normalizeUrl(?string $url): string
    {
        if (empty($url) || !self::isValidImageUrl($url)) {
            return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200';
        }
        $url = trim($url);
        if (str_starts_with($url, '/uploads/') || str_starts_with($url, '/storage/uploads/')) {
            return 'https://api.sunstarnews.com' . $url;
        }
        return $url;
    }
}
