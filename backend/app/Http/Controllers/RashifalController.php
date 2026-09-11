<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Process;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Scrapers", description: "Live Financial (NEPSE) and Daily Horoscope (Rashifal) Scrapers")]
class RashifalController extends Controller
{
    #[OA\Get(
        path: "/api/rashifal",
        summary: "Execute Hamro Patro live scraper for daily, weekly, monthly, and yearly horoscope",
        tags: ["Scrapers"],
        parameters: [
            new OA\Parameter(
                name: "type",
                in: "query",
                description: "Period type: daily, weekly, monthly, yearly",
                required: false,
                schema: new OA\Schema(type: "string", default: "daily", enum: ["daily", "weekly", "monthly", "yearly"])
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Scraped horoscope data from Hamro Patro",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "type", type: "string", example: "daily"),
                        new OA\Property(property: "source", type: "string", example: "Hamro Patro Live API"),
                        new OA\Property(property: "date", type: "string", example: "आजको राशिफल भदौ २६, २०८३"),
                        new OA\Property(property: "formattedBsDate", type: "string", example: "२६ भाद्र २०८३"),
                        new OA\Property(property: "fullDate", type: "string", example: "शुक्रबार, २६ भाद्र २०८३"),
                        new OA\Property(property: "timestamp", type: "string"),
                        new OA\Property(property: "predictions", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object"))
                    ]
                )
            )
        ]
    )]
    public function getDailyHoroscope(Request $request)
    {
        $type = strtolower($request->input('type', 'daily'));
        if (!in_array($type, ['daily', 'weekly', 'monthly', 'yearly'], true)) {
            $type = 'daily';
        }

        $cached = Cache::remember("hamropatro_rashifal_{$type}", 900, function () use ($type) {
            $node = file_exists('/opt/homebrew/bin/node') 
                ? '/opt/homebrew/bin/node' 
                : (file_exists('/usr/local/bin/node') ? '/usr/local/bin/node' : 'node');

            $result = Process::path(base_path())->run([$node, base_path('scrape-hamropatro.js'), $type]);

            if ($result->successful()) {
                $rashifalData = json_decode($result->output(), true);
                if (!empty($rashifalData) && !empty($rashifalData['predictions'])) {
                    return $rashifalData;
                }
            }

            return null;
        });

        if ($cached) {
            return response()->json($cached);
        }

        return response()->json([
            'success' => true,
            'type' => $type,
            'source' => 'Sunstar Astrology Engine',
            'date' => 'आजको राशिफल',
            'predictions' => [],
            'data' => []
        ]);
    }
}
