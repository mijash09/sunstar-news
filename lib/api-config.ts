// Sunstar News - Unified API Configuration for Local Dev & cPanel Production

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  // If in browser on production domain
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('sunstarnews.com')) {
      return 'https://api.sunstarnews.com/api';
    }
  }

  // Development mode proxy fallback
  return '/api';
}

export function getStorageBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_STORAGE_URL) {
    return process.env.NEXT_PUBLIC_STORAGE_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('sunstarnews.com')) {
      return 'https://api.sunstarnews.com/storage';
    }
  }

  return '/storage';
}
