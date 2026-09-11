<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Media", description: "Media Upload & Download Endpoints")]
class MediaController extends Controller
{
    #[OA\Post(
        path: "/api/upload",
        summary: "Upload image(s)",
        tags: ["Media"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "file", description: "Single image to upload", type: "string", format: "binary"),
                        new OA\Property(property: "imageFiles", description: "Multiple images to upload", type: "array", items: new OA\Items(type: "string", format: "binary"))
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Image uploaded successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "url", type: "string", example: "https://api.sunstarnews.com/uploads/sample.jpg"),
                        new OA\Property(property: "full_url", type: "string", example: "https://api.sunstarnews.com/uploads/sample.jpg"),
                        new OA\Property(property: "filename", type: "string", example: "sample.jpg"),
                        new OA\Property(property: "download_url", type: "string", example: "/api/download/sample.jpg")
                    ]
                )
            )
        ]
    )]
    public function upload(Request $request)
    {
        try {
            $uploadedUrls = [];
            $firstFilename = '';

            $files = [];
            if ($request->hasFile('file')) $files[] = $request->file('file');
            if ($request->hasFile('image')) $files[] = $request->file('image');
            if ($request->hasFile('imageFiles')) {
                $fList = $request->file('imageFiles');
                $files = array_merge($files, is_array($fList) ? $fList : [$fList]);
            }
            if ($request->hasFile('avatarFiles')) {
                $fList = $request->file('avatarFiles');
                $files = array_merge($files, is_array($fList) ? $fList : [$fList]);
            }
            if ($request->hasFile('bannerFiles')) {
                $fList = $request->file('bannerFiles');
                $files = array_merge($files, is_array($fList) ? $fList : [$fList]);
            }

            if (empty($files)) {
                return response()->json([
                    'success' => false,
                    'error' => 'कृपया अपलोड गर्नका लागि कम्तीमा एउटा फोटो छान्नुहोस् (No files uploaded).'
                ], 400);
            }

            foreach ($files as $file) {
                $url = FileUploadService::saveFile($file);
                if ($url) {
                    $uploadedUrls[] = $url;
                    if (!$firstFilename) {
                        $firstFilename = basename($url);
                    }
                }
            }

            if (empty($uploadedUrls)) {
                return response()->json([
                    'success' => false,
                    'error' => 'तस्बिर अपलोड हुन सकेन। कृपया फेरि प्रयास गर्नुहोस्।'
                ], 500);
            }

            $primaryUrl = $uploadedUrls[0];

            return response()->json([
                'success' => true,
                'message' => 'तस्बिर सफलतापूर्वक अपलोड भयो!',
                'url' => $primaryUrl,
                'full_url' => $primaryUrl,
                'filename' => $firstFilename,
                'download_url' => '/api/download/' . $firstFilename,
                'urls' => $uploadedUrls,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => 'त्रुटि (Error): ' . $e->getMessage()
            ], 500);
        }
    }

    #[OA\Get(
        path: "/api/download/{filename}",
        summary: "Download image with attachment header",
        tags: ["Media"],
        parameters: [
            new OA\Parameter(
                name: "filename",
                in: "path",
                required: true,
                description: "Name of the file to download",
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "File download attachment"),
            new OA\Response(response: 404, description: "File not found")
        ]
    )]
    public function download($filename)
    {
        $cleanFilename = basename($filename);
        $path = public_path('uploads/' . $cleanFilename);
        if (!file_exists($path)) {
            $path = storage_path('app/public/uploads/' . $cleanFilename);
        }
        if (!file_exists($path)) {
            $path = public_path('assets/' . $cleanFilename);
        }

        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'error' => 'फाइल भेटिएन (File not found)'
            ], 404);
        }

        return response()->download($path, $cleanFilename, [
            'Content-Disposition' => 'attachment; filename="' . $cleanFilename . '"',
        ]);
    }
}
