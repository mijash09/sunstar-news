<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'clicks_count' => 'integer',
    ];

    public function getImageUrlAttribute($value): string
    {
        if (empty($value) || !is_string($value)) {
            return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200';
        }
        $value = trim($value);
        if (!\App\Services\FileUploadService::isValidImageUrl($value)) {
            return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200';
        }
        return \App\Services\FileUploadService::normalizeUrl($value);
    }
}
