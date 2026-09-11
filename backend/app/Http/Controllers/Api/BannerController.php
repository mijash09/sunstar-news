<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Banners", description: "Advertisement Banner Management Endpoints")]
class BannerController extends Controller
{
    #[OA\Get(
        path: "/api/banners",
        summary: "List all advertisement banners",
        tags: ["Banners"],
        parameters: [
            new OA\Parameter(name: "position", in: "query", required: false, description: "Filter by position (e.g. header-top, sidebar)", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of banners",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "count", type: "integer", example: 2),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object"))
                    ]
                )
            )
        ]
    )]
    public function index(Request $request)
    {
        $query = Banner::query();
        if ($request->filled('position')) {
            $query->where('position', $request->input('position'));
        }
        $banners = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'count' => $banners->count(),
            'data' => $banners,
        ]);
    }

    #[OA\Post(
        path: "/api/banners",
        summary: "Create new banner advertisement",
        tags: ["Banners"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "title", type: "string", example: "नयाँ विज्ञापन"),
                        new OA\Property(property: "position", type: "string", example: "header-top"),
                        new OA\Property(property: "targetUrl", type: "string", example: "https://example.com"),
                        new OA\Property(property: "bannerFiles", type: "array", items: new OA\Items(type: "string", format: "binary")),
                        new OA\Property(property: "imageUrl", type: "string", example: "https://images.unsplash.com/photo-1557804506-669a67965ba0")
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Banner created")
        ]
    )]
    public function store(Request $request)
    {
        $title = trim($request->input('title', ''));
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
                if ($file && $file->isValid()) {
                    $ext = $file->getClientOriginalExtension() ?: 'jpg';
                    $cleanName = Str::random(24) . '.' . $ext;
                    $path = $file->storeAs('uploads', $cleanName, 'public');
                    $storedUrl = '/storage/' . $path;
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
        } elseif (!empty($imageUrl)) {
            $banner = Banner::create([
                'id' => 'banner-' . time() . '-' . Str::random(5),
                'title' => $title ?: 'विज्ञापन ब्यानर',
                'position' => $position,
                'image_url' => $imageUrl,
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
        ], 201);
    }

    #[OA\Delete(
        path: "/api/banners/{id}",
        summary: "Delete banner advertisement",
        tags: ["Banners"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, description: "Banner ID", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Banner deleted")
        ]
    )]
    public function destroy($id)
    {
        $deleted = Banner::where('id', $id)->delete();
        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'विज्ञापन ब्यानर हटाइयो!']);
        }
        return response()->json(['success' => false, 'error' => 'ब्यानर भेटिएन'], 404);
    }
}
