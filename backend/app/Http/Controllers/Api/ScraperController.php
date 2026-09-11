<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Symfony\Component\DomCrawler\Crawler;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Scrapers", description: "Live Financial (NEPSE) and Daily Horoscope (Rashifal) Scrapers")]
class ScraperController extends Controller
{
    #[OA\Get(
        path: "/api/nepse",
        summary: "Fetch live NEPSE index, market turnover, gold, and forex rates",
        tags: ["Scrapers"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Live market ticker data",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "index", type: "string", example: "2,594.18"),
                        new OA\Property(property: "change", type: "string", example: "+14.32"),
                        new OA\Property(property: "percent", type: "string", example: "+0.56%"),
                        new OA\Property(property: "turnover", type: "string", example: "रु ४.६५ अर्ब"),
                        new OA\Property(property: "goldPrice", type: "string", example: "रु १,५४,२०० / तोला"),
                        new OA\Property(property: "forexUSD", type: "string", example: "रु १३५.१०")
                    ]
                )
            )
        ]
    )]
    public function getNepse()
    {
        $data = \App\Http\Controllers\NepseController::fetchOfficialNepseData();
        return response()->json($data);
    }

    #[OA\Get(
        path: "/api/rashifal",
        summary: "Fetch complete 12 zodiac daily horoscope (Rashifal)",
        tags: ["Scrapers"],
        responses: [
            new OA\Response(
                response: 200,
                description: "12 zodiac signs daily horoscope",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "string", example: "mesh"),
                            new OA\Property(property: "sign", type: "string", example: "मेष"),
                            new OA\Property(property: "latinName", type: "string", example: "Aries"),
                            new OA\Property(property: "symbol", type: "string", example: "♈"),
                            new OA\Property(property: "prediction", type: "string")
                        ]
                    )
                )
            )
        ]
    )]
    public function getRashifal()
    {
        $all12SignsFallback = [
            ['id' => 'mesh', 'sign' => 'मेष', 'latinName' => 'Aries', 'symbol' => '♈', 'prediction' => 'आज आम्दानीका नयाँ स्रोतहरू पहिल्याउन सकिनेछ। व्यापार व्यवसायमा लगानी बढाउने अनुकूल समय छ।'],
            ['id' => 'vrish', 'sign' => 'वृष', 'latinName' => 'Taurus', 'symbol' => '♉', 'prediction' => 'सामाजिक कार्यमा सक्रिय सहभागी भइनेछ। रोकिएका पुराना कामहरू पुन: सुरु हुनेछन्।'],
            ['id' => 'mithun', 'sign' => 'मिथुन', 'latinName' => 'Gemini', 'symbol' => '♊', 'prediction' => 'बौद्धिक क्षमता र कार्यकुशलताको चौतर्फी प्रशंसा हुनेछ। अध्ययन तथा रचनात्मक काममा प्रगति हुनेछ।'],
            ['id' => 'karkat', 'sign' => 'कर्कट', 'latinName' => 'Cancer', 'symbol' => '♋', 'prediction' => 'पारिवारिक सुख र सद्भाव बढ्नेछ। नयाँ सवारी वा भौतिक साधन जोड्ने योग रहेको छ।'],
            ['id' => 'simha', 'sign' => 'सिंह', 'latinName' => 'Leo', 'symbol' => '♌', 'prediction' => 'साहस, पराक्रम र आत्मविश्वासमा वृद्धि हुनेछ। प्रतिस्पर्धामा विजय हासिल हुनेछ।'],
            ['id' => 'kanya', 'sign' => 'कन्या', 'latinName' => 'Virgo', 'symbol' => '♍', 'prediction' => 'आर्थिक कारोबारमा सजग रहनुहोला। बोलीको प्रभावले रोकिएका कामहरू बन्नेछन्।'],
            ['id' => 'tula', 'sign' => 'तुला', 'latinName' => 'Libra', 'symbol' => '♎', 'prediction' => 'मान-सम्मान र प्रतिष्ठामा वृद्धि हुनेछ। मनोरञ्जन तथा भ्रमणका अवसर जुट्नेछन्।'],
            ['id' => 'vrischik', 'sign' => 'वृश्चिक', 'latinName' => 'Scorpio', 'symbol' => '♏', 'prediction' => 'यात्रामा सावधानी अपनाउनुहोला। धार्मिक तथा आध्यात्मिक चिन्तनले मानसिक शान्ति दिनेछ।'],
            ['id' => 'dhanu', 'sign' => 'धनु', 'latinName' => 'Sagittarius', 'symbol' => '♐', 'prediction' => 'आर्थिक लाभका नयाँ ढोकाहरू खुल्नेछन्। मित्रजनको सहयोगले कार्यहरू सहजै सम्पन्न हुनेछन्।'],
            ['id' => 'makar', 'sign' => 'मकर', 'latinName' => 'Capricorn', 'symbol' => '♑', 'prediction' => 'कर्मक्षेत्रमा नयाँ जिम्मेवारी र पदोन्नतिको सम्भावना छ। वरिष्ठ व्यक्तित्वहरूको साथ मिल्नेछ।'],
            ['id' => 'kumbha', 'sign' => 'कुम्भ', 'latinName' => 'Aquarius', 'symbol' => '♒', 'prediction' => 'भाग्यले साथ दिनेछ। रोकिएका महत्त्वाकांक्षी योजनाहरू अघि बढाउन सकिनेछ।'],
            ['id' => 'meen', 'sign' => 'मीन', 'latinName' => 'Pisces', 'symbol' => '♓', 'prediction' => 'स्वास्थ्यमा विशेष ध्यान दिनुहोला। धैर्यता र संयमले काम गर्दा सफलता हात लाग्नेछ।']
        ];

        try {
            $data = Cache::remember('rashifal_daily_data', 1800, function () use ($all12SignsFallback) {
                try {
                    $node = file_exists('/opt/homebrew/bin/node') 
                        ? '/opt/homebrew/bin/node' 
                        : (file_exists('/usr/local/bin/node') ? '/usr/local/bin/node' : 'node');
                    $result = Process::path(base_path())->run([$node, base_path('fetch-rashifal.js')]);
                    if ($result->successful()) {
                        $scraped = json_decode($result->output(), true);
                        if (is_array($scraped) && count($scraped) >= 12) {
                            $mapped = [];
                            foreach ($all12SignsFallback as $idx => $fallback) {
                                $item = $scraped[$idx] ?? null;
                                $mapped[] = [
                                    'id' => $fallback['id'],
                                    'sign' => $item['name'] ?? $fallback['sign'],
                                    'latinName' => $item['nameEn'] ?? $fallback['latinName'],
                                    'symbol' => $fallback['symbol'],
                                    'prediction' => !empty($item['text']) ? $item['text'] : $fallback['prediction'],
                                    'letters' => $item['syllables'] ?? null,
                                    'image' => $item['image'] ?? null,
                                    'rashi' => $item['rashi'] ?? ($idx + 1),
                                ];
                            }
                            return $mapped;
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('Rashifal Scrape Notice: ' . $e->getMessage());
                }

                return $all12SignsFallback;
            });

            return response()->json([
                'success' => true,
                'data' => $data,
                'predictions' => $data,
                'date' => 'आजको दैनिक राशिफल'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => true,
                'data' => $all12SignsFallback,
                'predictions' => $all12SignsFallback,
                'date' => 'आजको दैनिक राशिफल'
            ]);
        }
    }
}
