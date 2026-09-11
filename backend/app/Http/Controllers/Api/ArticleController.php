<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Articles", description: "Article Management, Interactions, Comments & Share Endpoints")]
class ArticleController extends Controller
{
    #[OA\Get(
        path: "/api/articles",
        summary: "List all articles with optional filtering",
        tags: ["Articles"],
        parameters: [
            new OA\Parameter(name: "category", in: "query", required: false, description: "Filter by category", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "search", in: "query", required: false, description: "Search term in title or content", schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "limit", in: "query", required: false, description: "Number of articles (default 20)", schema: new OA\Schema(type: "integer", default: 20))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of articles",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "count", type: "integer", example: 10),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object"))
                    ]
                )
            )
        ]
    )]
    public function index(Request $request)
    {
        $query = Article::query();

        if ($request->filled('category')) {
            $cat = $request->input('category');
            $query->where('category', 'like', "%{$cat}%");
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $limit = (int) $request->input('limit', 20);
        $articles = $query->orderBy('created_at', 'desc')->take($limit)->get();

        return response()->json([
            'success' => true,
            'count' => $articles->count(),
            'data' => $articles,
        ]);
    }

    #[OA\Get(
        path: "/api/articles/{id}",
        summary: "Get single article by ID or slug",
        tags: ["Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID or slug", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Article details"),
            new OA\Response(response: 404, description: "Article not found")
        ]
    )]
    public function show($id)
    {
        $article = Article::where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'error' => 'समाचार भेटिएन (Article not found)'
            ], 404);
        }

        $article->increment('views_count');

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    #[OA\Post(
        path: "/api/articles",
        summary: "Create a new article",
        tags: ["Articles"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "title", type: "string", example: "नयाँ समाचार शीर्षक"),
                        new OA\Property(property: "category", type: "string", example: "मुख्य समाचार"),
                        new OA\Property(property: "summary", type: "string", example: "समाचार सारांश"),
                        new OA\Property(property: "content", type: "string", example: "समाचार विस्तृत सामग्री..."),
                        new OA\Property(property: "imageFiles", type: "array", items: new OA\Items(type: "string", format: "binary")),
                        new OA\Property(property: "imageUrl", type: "string", example: "https://images.unsplash.com/photo-1544735716-392fe2489ffa"),
                        new OA\Property(property: "author", type: "string", example: "सनस्टार संवाददाता")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Article created successfully")
        ]
    )]
    public function store(Request $request)
    {
        $title = trim($request->input('title', ''));
        $category = trim($request->input('category', 'मुख्य समाचार'));

        if (empty($title)) {
            return response()->json([
                'success' => false,
                'error' => 'शीर्षक आवश्यक छ (Title is required)'
            ], 422);
        }

        $imagesList = [];
        if ($request->hasFile('imageFiles')) {
            $files = $request->file('imageFiles');
            if (!is_array($files)) $files = [$files];
            foreach ($files as $file) {
                if ($file && $file->isValid()) {
                    $ext = $file->getClientOriginalExtension() ?: 'jpg';
                    $cleanName = Str::random(24) . '.' . $ext;
                    $path = $file->storeAs('uploads', $cleanName, 'public');
                    $imagesList[] = '/storage/' . $path;
                }
            }
        } elseif ($request->hasFile('imageFile') || $request->hasFile('file') || $request->hasFile('image')) {
            $file = $request->file('imageFile') ?: ($request->file('file') ?: $request->file('image'));
            if ($file && $file->isValid()) {
                $ext = $file->getClientOriginalExtension() ?: 'jpg';
                $cleanName = Str::random(24) . '.' . $ext;
                $path = $file->storeAs('uploads', $cleanName, 'public');
                $imagesList[] = '/storage/' . $path;
            }
        }

        $rawImageUrl = $request->input('imageUrl') ?: $request->input('image');
        if (empty($imagesList) && !empty($rawImageUrl) && !str_starts_with($rawImageUrl, '[object')) {
            $imagesList[] = $rawImageUrl;
        }

        if (empty($imagesList)) {
            $imagesList[] = '/assets/sunstar-logo.jpg';
        }

        $primaryImage = $imagesList[0];
        $id = 'art-' . Str::uuid();
        $slug = Str::slug($title) ?: ('news-' . time());

        $province = trim((string)($request->input('province') ?: $request->input('pradesh', '')));
        $rawCategories = $request->input('categories');
        if (is_string($rawCategories)) {
            $rawCategories = json_decode($rawCategories, true) ?: [$category];
        }
        $categories = is_array($rawCategories) ? $rawCategories : [$category];

        $isPradesh = ($category === 'प्रदेश') || in_array('प्रदेश', $categories, true) || in_array('pradesh', $categories, true);
        if ($isPradesh && empty($province)) {
            return response()->json([
                'success' => false,
                'error' => 'प्रदेश समाचारका लागि प्रदेश चयन गर्न अनिवार्य छ! (Please select a province/pradesh)'
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

        $authorImage = null;
        if ($request->hasFile('authorAvatarFile') || $request->hasFile('authorImageFile')) {
            $avatarFile = $request->file('authorAvatarFile') ?: $request->file('authorImageFile');
            if ($avatarFile && $avatarFile->isValid()) {
                $ext = $avatarFile->getClientOriginalExtension() ?: 'jpg';
                $cleanName = 'author_' . Str::random(20) . '.' . $ext;
                $path = $avatarFile->storeAs('uploads', $cleanName, 'public');
                $authorImage = '/storage/' . $path;
            }
        }
        if (!$authorImage) {
            $authorImage = $request->input('authorImage') ?: $request->input('author_image');
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
            'image' => $primaryImage,
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
            'message' => 'समाचार सफलतापूर्वक थपियो! (Article created successfully)',
            'data' => $article,
        ], 201);
    }

    #[OA\Put(
        path: "/api/articles/{id}",
        summary: "Update existing article",
        tags: ["Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Article updated successfully")
        ]
    )]
    public function update(Request $request, $id)
    {
        $article = Article::where('id', $id)->first();
        if (!$article) {
            return response()->json(['success' => false, 'error' => 'समाचार भेटिएन'], 404);
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
            if ($avatarFile && $avatarFile->isValid()) {
                $ext = $avatarFile->getClientOriginalExtension() ?: 'jpg';
                $cleanName = 'author_' . Str::random(20) . '.' . $ext;
                $path = $avatarFile->storeAs('uploads', $cleanName, 'public');
                $article->author_image = '/storage/' . $path;
            }
        } elseif ($request->filled('authorImage') || $request->filled('author_image')) {
            $article->author_image = $request->input('authorImage') ?: $request->input('author_image');
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
                $uploadedFiles = array_merge($uploadedFiles, $f);
            } elseif ($f) {
                $uploadedFiles[] = $f;
            }
        }
        foreach ($request->allFiles() as $key => $fileOrArray) {
            if ($key === 'imageFiles' || $key === 'avatarFiles' || $key === 'bannerFiles') continue;
            if (str_contains($key, 'image') || str_contains($key, 'file') || str_contains($key, 'photo')) {
                if (is_array($fileOrArray)) {
                    foreach ($fileOrArray as $f) {
                        if ($f && !in_array($f, $uploadedFiles, true)) $uploadedFiles[] = $f;
                    }
                } elseif ($fileOrArray && !in_array($fileOrArray, $uploadedFiles, true)) {
                    $uploadedFiles[] = $fileOrArray;
                }
            }
        }

        foreach ($uploadedFiles as $file) {
            if ($file && $file->isValid()) {
                $ext = $file->getClientOriginalExtension() ?: 'jpg';
                $cleanName = Str::random(24) . '.' . $ext;
                $path = $file->storeAs('uploads', $cleanName, 'public');
                $newImages[] = '/storage/' . $path;
            }
        }

        // 2. Direct imageUrl input (support single, comma-separated, or newline-separated URLs)
        $rawImageUrl = trim((string)($request->input('imageUrl') ?: $request->input('image')));
        if (!empty($rawImageUrl) && !str_starts_with($rawImageUrl, '[object')) {
            $urlParts = preg_split('/[\r\n,]+/', $rawImageUrl);
            foreach ($urlParts as $p) {
                $p = trim($p);
                if (!empty($p) && !in_array($p, $newImages, true)) {
                    $newImages[] = $p;
                }
            }
        }

        // 3. Process retained images
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

        $retained = array_values(array_filter((array)$retained, fn($img) => !empty($img) && is_string($img)));

        // 4. Merge retained and new images
        if (!empty($newImages) || $request->has('retainedImages')) {
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
        }

        $article->save();

        return response()->json([
            'success' => true,
            'message' => 'समाचार अद्यावधिक भयो! (Article updated)',
            'data' => $article,
        ]);
    }

    #[OA\Delete(
        path: "/api/articles/{id}",
        summary: "Delete article",
        tags: ["Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Article deleted successfully")
        ]
    )]
    public function destroy($id)
    {
        $deleted = Article::where('id', $id)->delete();
        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'समाचार हटाइयो (Article deleted)']);
        }
        return response()->json(['success' => false, 'error' => 'समाचार फेला परेन'], 404);
    }

    #[OA\Post(
        path: "/api/share",
        summary: "Increment article share counter",
        tags: ["Articles"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "articleId", type: "string", example: "art-lead-1"),
                    new OA\Property(property: "platform", type: "string", example: "facebook")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Share recorded",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "shares_count", type: "integer", example: 46),
                        new OA\Property(property: "message", type: "string", example: "सेयर संख्या अद्यावधिक भयो!")
                    ]
                )
            )
        ]
    )]
    public function share(Request $request)
    {
        $articleId = $request->input('articleId') ?: $request->input('id');
        if (!$articleId) {
            return response()->json(['success' => false, 'error' => 'articleId required'], 400);
        }

        $article = Article::where('id', $articleId)->orWhere('slug', $articleId)->first();
        if ($article) {
            $article->increment('shares_count');
            return response()->json([
                'success' => true,
                'shares_count' => $article->shares_count,
                'message' => 'सेयर संख्या अद्यावधिक भयो!'
            ]);
        }

        return response()->json(['success' => true, 'shares_count' => 1]);
    }

    #[OA\Post(
        path: "/api/articles/{id}/like",
        summary: "Toggle or increment article likes",
        tags: ["Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID", schema: new OA\Schema(type: "string"))
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "increment", type: "boolean", example: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Like updated")
        ]
    )]
    public function like(Request $request, $id)
    {
        $article = Article::where('id', $id)->orWhere('slug', $id)->first();
        if (!$article) {
            return response()->json(['success' => false, 'error' => 'समाचार फेला परेन'], 404);
        }

        $increment = $request->boolean('increment', true);
        if ($increment) {
            $article->increment('likes_count');
        } else {
            $article->likes_count = max(0, $article->likes_count - 1);
            $article->save();
        }

        return response()->json([
            'success' => true,
            'likes_count' => $article->likes_count,
            'message' => 'लाइक अद्यावधिक भयो!'
        ]);
    }

    #[OA\Post(
        path: "/api/articles/{id}/comments",
        summary: "Add comment to an article",
        tags: ["Articles"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Article ID", schema: new OA\Schema(type: "string"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "राम शर्मा"),
                    new OA\Property(property: "text", type: "string", example: "धेरै राम्रो समाचार!")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Comment added")
        ]
    )]
    public function comment(Request $request, $id)
    {
        $article = Article::where('id', $id)->orWhere('slug', $id)->first();
        if (!$article) {
            return response()->json(['success' => false, 'error' => 'समाचार फेला परेन'], 404);
        }

        $name = trim($request->input('name', 'नेपाली जनता'));
        $text = trim($request->input('text', ''));

        if (empty($text)) {
            return response()->json(['success' => false, 'error' => 'प्रतिक्रिया खाली हुनुहुँदैन'], 422);
        }

        $newComment = [
            'id' => 'c-' . time() . '-' . rand(100, 999),
            'name' => $name,
            'avatar' => '👤',
            'time' => 'भर्खरै',
            'text' => $text,
            'likes' => 0,
            'approved' => true,
        ];

        $currentList = is_array($article->comments_list) ? $article->comments_list : [];
        array_unshift($currentList, $newComment);

        $article->comments_list = $currentList;
        $article->comments_count = count($currentList);
        $article->save();

        return response()->json([
            'success' => true,
            'message' => 'प्रतिक्रिया सफलताका साथ प्रकाशित भयो!',
            'comment' => $newComment,
            'comments_count' => $article->comments_count,
        ], 201);
    }
}
