<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Banner;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Dashboard", description: "Admin Dashboard Management, Stats, and Multiplexed Action Endpoints")]
class DashboardController extends Controller
{
    #[OA\Get(
        path: "/api/dashboard",
        summary: "Fetch complete dashboard statistics, articles, banners, and users",
        tags: ["Dashboard"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Dashboard data bundle",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "stats", type: "object"),
                        new OA\Property(property: "articles", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "banners", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "users", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "breakingNews", type: "array", items: new OA\Items(type: "string"))
                    ]
                )
            )
        ]
    )]
    public function index()
    {
        try {
            $articles = Article::orderBy('created_at', 'desc')->get();
            $banners = Banner::orderBy('created_at', 'desc')->get();
            $users = User::orderBy('created_at', 'desc')->get();

            $defaultBreakingNews = [
                'काठमाडौँ उपत्यकामा वायु प्रदूषण नियन्त्रणका लागि नयाँ कार्ययोजना सार्वजनिक',
                'नेपाल स्टक एक्सचेन्ज (नेप्से) परिसूचकमा आज उच्च अंकको वृद्धि, लगानीकर्ता उत्साहित',
                'नेपाल र भारतबीच सीमा सुरक्षा तथा व्यापार सहजीकरणसम्बन्धी द्विपक्षीय वार्ता सम्पन्न',
                'पर्यटन बोर्डद्वारा नेपाल भ्रमण वर्षका लागि नयाँ अन्तर्राष्ट्रिय अभियान घोषणा',
                'काठमाडौँ-तराई द्रुतमार्ग निर्माण कार्य तीव्र गतिमा अघि बढ्दै, सुरुङ मार्ग ब्रेकथ्रु नजिक'
            ];

            try {
                $breakingNews = Cache::get('sunstar_breaking_news', $defaultBreakingNews);
            } catch (\Throwable $ce) {
                $breakingNews = $defaultBreakingNews;
            }

            $totalViewsCount = 125400;
            try {
                $totalViewsCount += Article::sum('views_count');
            } catch (\Throwable $ve) {}

            return response()->json([
                'success' => true,
                'stats' => [
                    'totalArticles' => $articles->count(),
                    'totalBanners' => $banners->count(),
                    'activeBanners' => $banners->where('is_active', true)->count(),
                    'totalUsers' => $users->count(),
                    'totalViews' => number_format($totalViewsCount) . '+',
                    'monthlyVisitors' => '४५,०००+'
                ],
                'articles' => $articles,
                'banners' => $banners,
                'users' => $users,
                'breakingNews' => $breakingNews,
            ]);
        } catch (\Throwable $e) {
            Log::error('Dashboard index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'ड्यासबोर्ड डेटा लोड गर्दा समस्या आयो: ' . $e->getMessage(),
                'stats' => [
                    'totalArticles' => 0,
                    'totalBanners' => 0,
                    'activeBanners' => 0,
                    'totalUsers' => 0,
                    'totalViews' => '0',
                    'monthlyVisitors' => '0'
                ],
                'articles' => [],
                'banners' => [],
                'users' => [],
                'breakingNews' => []
            ], 200);
        }
    }

    #[OA\Post(
        path: "/api/dashboard",
        summary: "Multiplexed action handler for dashboard operations",
        tags: ["Dashboard"],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Pass action or actionType with payload",
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "action", type: "string", example: "create-article"),
                        new OA\Property(property: "actionType", type: "string", example: "create-article"),
                        new OA\Property(property: "title", type: "string"),
                        new OA\Property(property: "category", type: "string"),
                        new OA\Property(property: "content", type: "string"),
                        new OA\Property(property: "summary", type: "string"),
                        new OA\Property(property: "id", type: "string"),
                        new OA\Property(property: "imageFiles", type: "array", items: new OA\Items(type: "string", format: "binary")),
                        new OA\Property(property: "avatarFiles", type: "array", items: new OA\Items(type: "string", format: "binary")),
                        new OA\Property(property: "bannerFiles", type: "array", items: new OA\Items(type: "string", format: "binary"))
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Action executed successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "सफलतापूर्वक सम्पन्न भयो!")
                    ]
                )
            )
        ]
    )]
    public function store(Request $request)
    {
        try {
            $action = $request->input('action') ?? $request->input('actionType');

            switch ($action) {
                case 'create-article':
                case 'add-article':
                    $title = trim($request->input('title', ''));
                    $category = trim($request->input('category', 'मुख्य समाचार'));

                    if (empty($title)) {
                        return response()->json(['success' => false, 'error' => 'शीर्षक आवश्यक छ'], 422);
                    }

                    $imagesList = [];

                    // 1. Capture all uploaded files from any file field
                    $uploadedFiles = [];
                    if ($request->hasFile('imageFiles')) {
                        $f = $request->file('imageFiles');
                        if (is_array($f)) {
                            foreach ($f as $fileItem) {
                                if ($fileItem instanceof \Illuminate\Http\UploadedFile) $uploadedFiles[] = $fileItem;
                            }
                        } elseif ($f instanceof \Illuminate\Http\UploadedFile) {
                            $uploadedFiles[] = $f;
                        }
                    }
                    foreach ($request->allFiles() as $key => $fileOrArray) {
                        if (in_array($key, ['imageFiles', 'avatarFiles', 'bannerFiles', 'authorAvatarFile', 'authorImageFile', 'avatarFile'])) continue;
                        if (str_contains($key, 'image') || str_contains($key, 'file') || str_contains($key, 'photo')) {
                            if (is_array($fileOrArray)) {
                                foreach ($fileOrArray as $f) {
                                    if ($f instanceof \Illuminate\Http\UploadedFile && !in_array($f, $uploadedFiles, true)) {
                                        $uploadedFiles[] = $f;
                                    }
                                }
                            } elseif ($fileOrArray instanceof \Illuminate\Http\UploadedFile && !in_array($fileOrArray, $uploadedFiles, true)) {
                                $uploadedFiles[] = $fileOrArray;
                            }
                        }
                    }

                    foreach ($uploadedFiles as $file) {
                        $savedUrl = FileUploadService::saveFile($file);
                        if ($savedUrl) {
                            $imagesList[] = $savedUrl;
                        }
                    }

                    // 2. Direct imageUrl input (support single, comma-separated, or newline-separated URLs)
                    $rawImageUrl = trim((string)($request->input('imageUrl') ?: $request->input('image')));
                    if (!empty($rawImageUrl)) {
                        $urlParts = preg_split('/[\r\n,]+/', $rawImageUrl);
                        foreach ($urlParts as $p) {
                            $p = trim($p);
                            if (FileUploadService::isValidImageUrl($p)) {
                                $normalized = FileUploadService::normalizeUrl($p);
                                if (!in_array($normalized, $imagesList, true)) {
                                    $imagesList[] = $normalized;
                                }
                            }
                        }
                    }

                    if (empty($imagesList)) {
                        $imagesList[] = '/assets/sunstar-logo.jpg';
                    }

                    $rawCategories = $request->input('categories');
                    if (is_string($rawCategories)) {
                        $rawCategories = json_decode($rawCategories, true) ?: [$category];
                    }
                    $categories = is_array($rawCategories) ? $rawCategories : [$category];

                    $province = trim((string)($request->input('province') ?: $request->input('pradesh', '')));
                    $isPradesh = ($category === 'प्रदेश') || in_array('प्रदेश', $categories, true) || in_array('pradesh', $categories, true);

                    if ($isPradesh && empty($province)) {
                        return response()->json([
                            'success' => false,
                            'error' => 'प्रदेश समाचारका लागि प्रदेश चयन गर्न अनिवार्य छ! (Please select a province/pradesh)',
                        ], 422);
                    }

                    $tags = [];
                    if (!empty($province)) {
                        $provinceLabels = [
                            'koshi' => 'कोशी',
                            'madhesh' => 'मधेश',
                            'bagmati' => 'बाग्मती',
                            'gandaki' => 'गण्डकी',
                            'lumbini' => 'लुम्बिनी',
                            'karnali' => 'कर्णाली',
                            'sudurpaschim' => 'सुदूरपश्चिम',
                        ];
                        $provLabel = $provinceLabels[$province] ?? $province;
                        $tags = ['प्रदेश', $provLabel, $province];
                        if (!in_array('प्रदेश', $categories, true)) {
                            $categories[] = 'प्रदेश';
                        }
                    }

                    $id = 'art-' . Str::uuid();
                    $slug = Str::slug($title) ?: ('news-' . time());

                    $authorImage = null;
                    if ($request->hasFile('authorAvatarFile') || $request->hasFile('authorImageFile')) {
                        $avatarFile = $request->file('authorAvatarFile') ?: $request->file('authorImageFile');
                        if ($avatarFile) {
                            $authorImage = FileUploadService::saveFile($avatarFile, 'author');
                        }
                    }
                    if (!$authorImage) {
                        $rawAuthorImg = $request->input('authorImage') ?: $request->input('author_image');
                        if (FileUploadService::isValidImageUrl($rawAuthorImg)) {
                            $authorImage = FileUploadService::normalizeUrl($rawAuthorImg);
                        }
                    }
                    $authorRole = $request->input('authorRole') ?: $request->input('author_role');
                    $readTime = $request->input('readTime') ?: $request->input('read_time');

                    $article = Article::create([
                        'id' => $id,
                        'title' => $title,
                        'slug' => $slug,
                        'category' => $category,
                        'categories' => $categories ?: [$category, 'ताजा खबर'],
                        'province' => $province ?: null,
                        'tags' => $tags,
                        'summary' => $request->input('summary', $title),
                        'content' => $request->input('content', $title),
                        'image' => $imagesList[0],
                        'images' => $imagesList,
                        'author' => $request->input('author', 'सनस्टार संवाददाता'),
                        'author_role' => $authorRole ?: null,
                        'author_image' => $authorImage ?: null,
                        'read_time' => $readTime ?: null,
                        'source' => $request->input('source', 'SunstarNews.com'),
                        'time' => 'भर्खरै',
                        'views' => '१.२ के',
                        'views_count' => 0,
                        'likes_count' => 12,
                        'shares_count' => 0,
                        'comments_count' => 0,
                        'comments_list' => [],
                        'is_published' => true,
                    ]);

                    return response()->json([
                        'success' => true,
                        'message' => 'समाचार सफलतापूर्वक थपियो!',
                        'data' => $article,
                    ]);

                case 'update-article':
                    $id = $request->input('id');
                    $article = Article::where('id', $id)->first();
                    if (!$article) {
                        return response()->json(['success' => false, 'error' => 'समाचार फेला परेन'], 404);
                    }

                    if ($request->filled('title')) $article->title = $request->input('title');
                    if ($request->filled('category')) $article->category = $request->input('category');
                    if ($request->filled('summary')) $article->summary = $request->input('summary');
                    if ($request->filled('content')) $article->content = $request->input('content');
                    if ($request->filled('author')) $article->author = $request->input('author');
                    if ($request->filled('authorRole') || $request->filled('author_role')) {
                        $article->author_role = $request->input('authorRole') ?: $request->input('author_role');
                    }
                    if ($request->filled('readTime') || $request->filled('read_time')) {
                        $article->read_time = $request->input('readTime') ?: $request->input('read_time');
                    }
                    if ($request->hasFile('authorAvatarFile') || $request->hasFile('authorImageFile')) {
                        $avatarFile = $request->file('authorAvatarFile') ?: $request->file('authorImageFile');
                        if ($avatarFile) {
                            $savedAuthorImage = FileUploadService::saveFile($avatarFile, 'author');
                            if ($savedAuthorImage) {
                                $article->author_image = $savedAuthorImage;
                            }
                        }
                    } elseif ($request->filled('authorImage') || $request->filled('author_image')) {
                        $rawAuthorImg = $request->input('authorImage') ?: $request->input('author_image');
                        if (FileUploadService::isValidImageUrl($rawAuthorImg)) {
                            $article->author_image = FileUploadService::normalizeUrl($rawAuthorImg);
                        }
                    }
                    if ($request->filled('likesCount')) $article->likes_count = (int) $request->input('likesCount');

                    if ($request->has('province') || $request->has('pradesh')) {
                        $province = trim((string)($request->input('province') ?: $request->input('pradesh', '')));
                        $article->province = $province ?: null;
                        if (!empty($province)) {
                            $provinceLabels = [
                                'koshi' => 'कोशी',
                                'madhesh' => 'मधेश',
                                'bagmati' => 'बाग्मती',
                                'gandaki' => 'गण्डकी',
                                'lumbini' => 'लुम्बिनी',
                                'karnali' => 'कर्णाली',
                                'sudurpaschim' => 'सुदूरपश्चिम',
                            ];
                            $provLabel = $provinceLabels[$province] ?? $province;
                            $article->tags = array_values(array_unique(array_merge($article->tags ?: [], ['प्रदेश', $provLabel, $province])));
                        }
                    }

                    // 1. Process all newly uploaded multiple files
                    $newImages = [];
                    $uploadedFiles = [];
                    if ($request->hasFile('imageFiles')) {
                        $f = $request->file('imageFiles');
                        if (is_array($f)) {
                            foreach ($f as $fileItem) {
                                if ($fileItem instanceof \Illuminate\Http\UploadedFile) $uploadedFiles[] = $fileItem;
                            }
                        } elseif ($f instanceof \Illuminate\Http\UploadedFile) {
                            $uploadedFiles[] = $f;
                        }
                    }
                    foreach ($request->allFiles() as $key => $fileOrArray) {
                        if (in_array($key, ['imageFiles', 'avatarFiles', 'bannerFiles', 'authorAvatarFile', 'authorImageFile', 'avatarFile'])) continue;
                        if (str_contains($key, 'image') || str_contains($key, 'file') || str_contains($key, 'photo')) {
                            if (is_array($fileOrArray)) {
                                foreach ($fileOrArray as $f) {
                                    if ($f instanceof \Illuminate\Http\UploadedFile && !in_array($f, $uploadedFiles, true)) {
                                        $uploadedFiles[] = $f;
                                    }
                                }
                            } elseif ($fileOrArray instanceof \Illuminate\Http\UploadedFile && !in_array($fileOrArray, $uploadedFiles, true)) {
                                $uploadedFiles[] = $fileOrArray;
                            }
                        }
                    }

                    foreach ($uploadedFiles as $file) {
                        $savedUrl = FileUploadService::saveFile($file);
                        if ($savedUrl) {
                            $newImages[] = $savedUrl;
                        }
                    }

                    // 2. Direct imageUrl input (support single, comma-separated, or newline-separated URLs)
                    $rawImageUrl = trim((string)($request->input('imageUrl') ?: $request->input('image')));
                    if (!empty($rawImageUrl)) {
                        $urlParts = preg_split('/[\r\n,]+/', $rawImageUrl);
                        foreach ($urlParts as $p) {
                            $p = trim($p);
                            if (FileUploadService::isValidImageUrl($p)) {
                                $normalized = FileUploadService::normalizeUrl($p);
                                if (!in_array($normalized, $newImages, true)) {
                                    $newImages[] = $normalized;
                                }
                            }
                        }
                    }

                    // 3. Process retained images (what user kept in edit modal)
                    $retainedRaw = $request->input('retainedImages');
                    $retained = null;
                    if (is_string($retainedRaw)) {
                        $decoded = json_decode($retainedRaw, true);
                        if (is_array($decoded)) {
                            $retained = $decoded;
                        }
                    } elseif (is_array($retainedRaw)) {
                        $retained = $retainedRaw;
                    }

                    if ($retained === null) {
                        $retained = is_array($article->images) && !empty($article->images)
                            ? $article->images
                            : [$article->image ?: '/assets/sunstar-logo.jpg'];
                    }

                    $retained = array_values(array_filter((array)$retained, fn($img) => FileUploadService::isValidImageUrl($img)));

                    // 4. Merge retained images with newly uploaded images
                    $finalImages = array_values(array_unique(array_merge($newImages, $retained)));
                    if (empty($finalImages)) {
                        $finalImages = ['/assets/sunstar-logo.jpg'];
                    }

                    $primaryImage = trim((string)$request->input('primaryImage', ''));
                    if (!empty($primaryImage) && in_array($primaryImage, $finalImages, true)) {
                        $finalImages = array_values(array_unique(array_merge([$primaryImage], $finalImages)));
                    }

                    $article->images = $finalImages;
                    $article->image = $finalImages[0];
                    $article->save();

                    return response()->json([
                        'success' => true,
                        'message' => 'समाचार सफलतापूर्वक अद्यावधिक भयो!',
                        'data' => $article,
                    ]);

                case 'delete-article':
                    $id = $request->input('id');
                    Article::where('id', $id)->delete();
                    return response()->json(['success' => true, 'message' => 'समाचार हटाइयो!']);

                case 'update-likes':
                    $id = $request->input('articleId') ?: $request->input('id');
                    $count = (int) $request->input('likesCount', 12);
                    $article = Article::where('id', $id)->first();
                    if ($article) {
                        $article->likes_count = max(0, $count);
                        $article->save();
                    }
                    return response()->json(['success' => true, 'message' => 'लाइक्स सफलतापूर्वक अद्यावधिक भयो!']);

                case 'toggle-like':
                    $id = $request->input('articleId') ?: $request->input('id');
                    $increment = $request->boolean('increment', true);
                    $article = Article::where('id', $id)->first();
                    if ($article) {
                        if ($increment) {
                            $article->increment('likes_count');
                        } else {
                            $article->likes_count = max(0, $article->likes_count - 1);
                            $article->save();
                        }
                    }
                    return response()->json(['success' => true, 'message' => 'लाइक अद्यावधिक भयो!']);

                case 'add-comment':
                    $id = $request->input('articleId') ?: $request->input('id');
                    $name = trim($request->input('name', 'नेपाली जनता'));
                    $text = trim($request->input('text', ''));
                    $article = Article::where('id', $id)->first();
                    if ($article && !empty($text)) {
                        $newComment = [
                            'id' => 'c-' . time() . '-' . rand(100, 999),
                            'name' => $name,
                            'avatar' => '👤',
                            'time' => 'भर्खरै',
                            'text' => $text,
                            'likes' => 0,
                            'approved' => true,
                        ];
                        $list = is_array($article->comments_list) ? $article->comments_list : [];
                        array_unshift($list, $newComment);
                        $article->comments_list = $list;
                        $article->comments_count = count($list);
                        $article->save();
                    }
                    return response()->json(['success' => true, 'message' => 'प्रतिक्रिया राखियो!']);

                case 'delete-comment':
                    $id = $request->input('articleId') ?: $request->input('id');
                    $commentId = $request->input('commentId');
                    $article = Article::where('id', $id)->first();
                    if ($article) {
                        $list = is_array($article->comments_list) ? $article->comments_list : [];
                        $list = array_values(array_filter($list, fn($c) => ($c['id'] ?? '') !== $commentId));
                        $article->comments_list = $list;
                        $article->comments_count = count($list);
                        $article->save();
                    }
                    return response()->json(['success' => true, 'message' => 'प्रतिक्रिया हटाइयो!']);

                case 'create-user':
                case 'create-staff':
                    $name = trim($request->input('name', 'Staff'));
                    $email = strtolower(trim($request->input('email', 'staff@sunstar.com')));
                    $password = $request->input('password', 'password');
                    $role = $request->input('role', 'EDITOR');
                    $username = $request->input('username') ?: explode('@', $email)[0];
                    $avatarUrl = $request->input('avatar') ?: '';

                    if ($request->hasFile('avatarFiles')) {
                        $files = $request->file('avatarFiles');
                        $file = is_array($files) ? $files[0] : $files;
                        $saved = FileUploadService::saveFile($file, 'avatar');
                        if ($saved) $avatarUrl = $saved;
                    } elseif ($request->hasFile('avatarFile') || $request->hasFile('file') || $request->hasFile('image')) {
                        $file = $request->file('avatarFile') ?: ($request->file('file') ?: $request->file('image'));
                        $saved = FileUploadService::saveFile($file, 'avatar');
                        if ($saved) $avatarUrl = $saved;
                    }

                    if (empty($avatarUrl) || !FileUploadService::isValidImageUrl($avatarUrl)) {
                        $avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                    }

                    if (User::where('email', $email)->exists()) {
                        return response()->json(['success' => false, 'error' => 'यो इमेल पहिल्यै प्रयोगमा छ'], 422);
                    }

                    $user = User::create([
                        'name' => $name,
                        'username' => $username,
                        'email' => $email,
                        'password' => bcrypt($password),
                        'role' => $role,
                        'avatar' => $avatarUrl,
                    ]);

                    return response()->json(['success' => true, 'message' => 'नयाँ कर्मचारी प्रयोगकर्ता सिर्जना गरियो!', 'data' => $user]);

                case 'create-banner':
                case 'add-banner':
                    $title = trim($request->input('title', 'विज्ञापन ब्यानर'));
                    $position = trim($request->input('position', 'header-top'));
                    $targetUrl = trim($request->input('targetUrl', '#'));
                    $imageUrl = $request->input('imageUrl') ?: '';

                    $files = [];
                    if ($request->hasFile('bannerFiles')) {
                        $raw = $request->file('bannerFiles');
                        $files = is_array($raw) ? $raw : [$raw];
                    } elseif ($request->hasFile('file') || $request->hasFile('image')) {
                        $raw = $request->file('file') ?: $request->file('image');
                        $files = is_array($raw) ? $raw : [$raw];
                    }

                    $createdBanners = [];
                    if (!empty($files)) {
                        $total = count($files);
                        foreach ($files as $idx => $file) {
                            $storedUrl = FileUploadService::saveFile($file, 'banner');
                            if ($storedUrl) {
                                $bTitle = $total > 1 ? (($title ?: 'विज्ञापन ब्यानर') . ' (' . ($idx + 1) . ')') : ($title ?: 'विज्ञापन ब्यानर');
                                $banner = Banner::create([
                                    'id' => 'banner-' . time() . '-' . Str::random(5),
                                    'title' => $bTitle,
                                    'position' => $position,
                                    'image_url' => $storedUrl,
                                    'target_url' => $targetUrl,
                                    'is_active' => true,
                                    'clicks_count' => 0,
                                ]);
                                $createdBanners[] = $banner;
                            }
                        }
                    } elseif (!empty($imageUrl) && FileUploadService::isValidImageUrl($imageUrl)) {
                        $banner = Banner::create([
                            'id' => 'banner-' . time() . '-' . Str::random(5),
                            'title' => $title ?: 'विज्ञापन ब्यानर',
                            'position' => $position,
                            'image_url' => FileUploadService::normalizeUrl($imageUrl),
                            'target_url' => $targetUrl,
                            'is_active' => true,
                            'clicks_count' => 0,
                        ]);
                        $createdBanners[] = $banner;
                    } else {
                        $banner = Banner::create([
                            'id' => 'banner-' . time() . '-' . Str::random(5),
                            'title' => $title ?: 'विज्ञापन ब्यानर',
                            'position' => $position,
                            'image_url' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
                            'target_url' => $targetUrl,
                            'is_active' => true,
                            'clicks_count' => 0,
                        ]);
                        $createdBanners[] = $banner;
                    }

                    return response()->json([
                        'success' => true,
                        'message' => 'नयाँ विज्ञापन ब्यानर सफलताका साथ प्रकाशित भयो!',
                        'data' => count($createdBanners) === 1 ? $createdBanners[0] : $createdBanners,
                    ]);

                case 'delete-banner':
                    $id = $request->input('id');
                    Banner::where('id', $id)->delete();
                    return response()->json(['success' => true, 'message' => 'विज्ञापन ब्यानर हटाइयो!']);

                case 'update-breaking-news':
                    $lines = $request->input('breakingNews') ?: $request->input('items');
                    if (is_array($lines)) {
                        Cache::forever('sunstar_breaking_news', $lines);
                    }
                    return response()->json(['success' => true, 'message' => 'भर्खरै समाचार सफलतापूर्वक अद्यावधिक भयो!']);

                case 'share-article':
                    $id = $request->input('articleId') ?: $request->input('id');
                    $article = Article::where('id', $id)->first();
                    if ($article) {
                        $article->increment('shares_count');
                    }
                    return response()->json(['success' => true, 'message' => 'सेयर संख्या अद्यावधिक भयो!']);

                default:
                    return response()->json(['success' => true, 'message' => 'Action processed successfully.']);
            }
        } catch (\Throwable $e) {
            Log::error('Dashboard store exception: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'error' => 'त्रुटि (Error): ' . $e->getMessage()
            ], 500);
        }
    }
}