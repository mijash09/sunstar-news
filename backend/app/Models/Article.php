<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected $casts = [
        'images' => 'array',
        'categories' => 'array',
        'tags' => 'array',
        'comments_list' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'is_exclusive' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = [
        'commentsList',
        'commentsCount',
        'likesCount',
        'viewsCount',
        'sharesCount',
    ];

    public function getCommentsListAttribute($value = null)
    {
        if (is_array($value)) return $value;
        if (is_string($value)) {
            $d = json_decode($value, true);
            if (is_array($d)) return $d;
        }
        $raw = $this->getAttributes()['comments_list'] ?? null;
        if (is_string($raw)) {
            $d = json_decode($raw, true);
            if (is_array($d)) return $d;
        }
        return is_array($raw) ? $raw : [];
    }

    public function getCommentsCountAttribute($value = null)
    {
        if ($value !== null) return (int)$value;
        $raw = $this->getAttributes()['comments_count'] ?? null;
        if ($raw !== null) return (int)$raw;
        $list = $this->getCommentsListAttribute();
        return is_array($list) ? count($list) : 0;
    }

    public function getLikesCountAttribute($value = null)
    {
        if ($value !== null) return (int)$value;
        $raw = $this->getAttributes()['likes_count'] ?? null;
        return $raw !== null ? (int)$raw : 12;
    }

    public function getViewsCountAttribute($value = null)
    {
        if ($value !== null) return (int)$value;
        $raw = $this->getAttributes()['views_count'] ?? null;
        return $raw !== null ? (int)$raw : 0;
    }

    public function getSharesCountAttribute($value = null)
    {
        if ($value !== null) return (int)$value;
        $raw = $this->getAttributes()['shares_count'] ?? null;
        return $raw !== null ? (int)$raw : 0;
    }

    public static function formatNepaliRelativeTime($date): string
    {
        if (!$date) return 'भर्खरै';
        try {
            $carbon = $date instanceof \Carbon\Carbon ? $date : \Carbon\Carbon::parse($date);
            $diffSeconds = abs(now()->diffInSeconds($carbon));
            $diffMinutes = (int) floor($diffSeconds / 60);

            $nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            $toNepali = function ($num) use ($nepaliDigits) {
                return preg_replace_callback('/\d/', function ($m) use ($nepaliDigits) {
                    return $nepaliDigits[$m[0]];
                }, (string)$num);
            };

            if ($diffMinutes < 1) {
                return 'भर्खरै';
            }
            if ($diffMinutes < 60) {
                return $toNepali($diffMinutes) . ' मिनेट अघि';
            }
            $diffHours = (int) floor($diffMinutes / 60);
            if ($diffHours < 24) {
                return $toNepali($diffHours) . ' घण्टा अघि';
            }
            $diffDays = (int) floor($diffHours / 24);
            if ($diffDays < 30) {
                return $toNepali($diffDays) . ' दिन अघि';
            }
            $diffMonths = (int) floor($diffDays / 30);
            if ($diffMonths < 12) {
                return $toNepali($diffMonths) . ' महिना अघि';
            }
            $diffYears = (int) floor($diffMonths / 12);
            return $toNepali($diffYears) . ' वर्ष अघि';
        } catch (\Exception $e) {
            return 'भर्खरै';
        }
    }

    public function getTimeAttribute($value): string
    {
        $target = $this->updated_at ?: ($this->published_at ?: $this->created_at);
        if ($target) {
            return self::formatNepaliRelativeTime($target);
        }
        return $value ?: 'भर्खरै';
    }
}
