<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Banner;
use Illuminate\Support\Facades\Cache;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Landing", description: "Homepage / Landing Page Data Aggregation")]
class LandingDataController extends Controller
{
    #[OA\Get(
        path: "/api/landing-data",
        summary: "Fetch all categorized news, banners, and tickers for homepage rendering",
        tags: ["Landing"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Landing page grouped data bundle",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "featuredLead", type: "object"),
                        new OA\Property(property: "topSecondaryLeads", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "exclusiveNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "politicsNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "businessNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "sportsNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "entertainmentNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "featureNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "technologyNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "worldNews", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "opinions", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "banners", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "breakingNews", type: "array", items: new OA\Items(type: "string"))
                    ]
                )
            )
        ]
    )]
    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->get();
        $banners = Banner::where('is_active', true)->orderBy('created_at', 'desc')->get();

        $filterByCat = function ($keywords) use ($articles) {
            return $articles->filter(function ($art) use ($keywords) {
                $cat = mb_strtolower($art->category ?? '');
                foreach ($keywords as $kw) {
                    if (str_contains($cat, mb_strtolower($kw))) return true;
                }
                return false;
            })->values();
        };

        $featuredLead = $articles->firstWhere('is_featured', true) ?: $articles->first();
        $secondary = $articles->where('id', '!=', $featuredLead ? $featuredLead->id : null)->take(4)->values();

        $defaultBreakingNews = [
            'काठमाडौँ उपत्यकामा वायु प्रदूषण नियन्त्रणका लागि नयाँ कार्ययोजना सार्वजनिक',
            'नेपाल स्टक एक्सचेन्ज (नेप्से) परिसूचकमा आज उच्च अंकको वृद्धि, लगानीकर्ता उत्साहित',
            'नेपाल र भारतबीच सीमा सुरक्षा तथा व्यापार सहजीकरणसम्बन्धी द्विपक्षीय वार्ता सम्पन्न',
            'पर्यटन बोर्डद्वारा नेपाल भ्रमण वर्षका लागि नयाँ अन्तर्राष्ट्रिय अभियान घोषणा'
        ];
        $breakingNews = Cache::get('sunstar_breaking_news', $defaultBreakingNews);

        // Extract latest 5 news for ताजा समाचार (Timeline)
        $timelineFeed = $articles->take(5)->map(function ($a) {
            return [
                'id' => (string) $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'time' => $a->time ?: 'भर्खरै',
                'source' => $a->source ?: 'सनस्टार न्युज',
                'category' => $a->category ?: 'ताजा खबर',
                'image' => $a->image ?: '/assets/sunstar-logo.jpg',
                'updated_at' => $a->updated_at ? $a->updated_at->toISOString() : null,
                'created_at' => $a->created_at ? $a->created_at->toISOString() : null,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'featuredLead' => $featuredLead,
            'topSecondaryLeads' => $secondary,
            'exclusiveNews' => $filterByCat(['exclusive', 'विशेष']),
            'politicsNews' => $filterByCat(['politics', 'राजनीति']),
            'businessNews' => $filterByCat(['business', 'अर्थतन्त्र', 'अर्थ', 'वाणिज्य']),
            'sportsNews' => $filterByCat(['sports', 'खेलकुद']),
            'entertainmentNews' => $filterByCat(['entertainment', 'मनोरञ्जन', 'मनोरन्जन']),
            'featureNews' => $filterByCat(['feature', 'फिचर']),
            'technologyNews' => $filterByCat(['technology', 'tech', 'प्रविधि']),
            'worldNews' => $filterByCat(['world', 'विश्व']),
            'opinions' => $filterByCat(['opinion', 'विचार', 'विश्लेषण']),
            'timelineFeed' => $timelineFeed,
            'latestTimeline' => $timelineFeed,
            'tajaSamachar' => $timelineFeed,
            'banners' => $banners,
            'breakingNews' => $breakingNews,
        ]);
    }
}