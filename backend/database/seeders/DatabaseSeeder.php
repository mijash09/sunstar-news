<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        \App\Models\User::firstOrCreate(
            ['email' => 'sitaram@sunstarnews.com'],
            [
                'name' => 'Sitaram',
                'username' => 'sitaram',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'admin@sunstarnews.com'],
            [
                'name' => 'सनस्टार व्यवस्थापक (Admin)',
                'username' => 'admin',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'editor@sunstarnews.com'],
            [
                'name' => 'सनस्टार सम्पादक',
                'username' => 'editor',
                'password' => bcrypt('password'),
                'role' => 'EDITOR',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            ]
        );

        // 2. Banners
        \App\Models\Banner::firstOrCreate(
            ['id' => 'banner-top-1'],
            [
                'title' => 'सनस्टार मुख्य विज्ञापन ब्यानर',
                'image_url' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
                'target_url' => 'https://sunstarnews.com',
                'position' => 'header-top',
                'is_active' => true,
                'clicks_count' => 140,
            ]
        );

        \App\Models\Banner::firstOrCreate(
            ['id' => 'banner-sidebar-1'],
            [
                'title' => 'साइडबार विज्ञापन ब्यानर',
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                'target_url' => 'https://sunstarnews.com',
                'position' => 'sidebar',
                'is_active' => true,
                'clicks_count' => 88,
            ]
        );

        // 3. Sample Articles
        $sampleArticles = [
            [
                'id' => 'art-lead-1',
                'title' => 'अर्थतन्त्रमा नयाँ सुधारको संकेत: सेयर बजारमा ऐतिहासिक वृद्धि, लगानीकर्ता उत्साहित',
                'slug' => 'economic-reform-share-market-nepse-growth',
                'category' => 'अर्थतन्त्र',
                'categories' => ['अर्थतन्त्र', 'मुख्य खबर'],
                'summary' => 'नेपालको सेयर बजार नेप्से परिसूचकमा आज उच्च अंकको वृद्धि भएको छ। लगानीकर्ताहरूमा नयाँ उत्साह देखिएको छ।',
                'content' => "काठमाडौँ — नेपाल स्टक एक्सचेन्ज (नेप्से) परिसूचकमा आज ऐतिहासिक सुधार देखिएको छ। मौद्रिक नीतिको समीक्षा र बजारमा तरलता सहज भएसँगै दैनिक कारोबार रकमले नयाँ कीर्तिमान कायम गरेको छ।\n\nविशेषज्ञहरूका अनुसार उत्पादनमूलक क्षेत्र, ऊर्जा तथा बैंकिङ उपसमूहमा उच्च आकर्षण देखिएको छ। बजार विश्लेषकहरूले दीर्घकालीन लगानीका लागि यो उपयुक्त अवसर भएको बताएका छन्।",
                'image' => 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80'
                ],
                'author' => 'सनस्टार आर्थिक ब्युरो',
                'source' => 'SunstarNews.com',
                'time' => '१० मिनेट अघि',
                'views' => '५.४ के',
                'views_count' => 5400,
                'likes_count' => 124,
                'shares_count' => 45,
                'comments_count' => 2,
                'comments_list' => [
                    [
                        'id' => 'c-1',
                        'name' => 'हरिप्रसाद दाहाल',
                        'avatar' => '👨‍💼',
                        'time' => '५ मिनेट अघि',
                        'text' => 'नेप्सेको सुधारले साना लगानीकर्तालाई ठूलो राहत मिलेको छ।',
                        'likes' => 8,
                        'approved' => true
                    ]
                ],
                'is_published' => true,
                'is_featured' => true,
            ],
            [
                'id' => 'art-lead-2',
                'title' => 'नेपालको पर्यटन क्षेत्रमा नयाँ आयाम: आन्तरिक तथा बाह्य पर्यटकको आवागमन तीव्र',
                'slug' => 'tourism-growth-nepal-2026',
                'category' => 'विशेष',
                'categories' => ['विशेष', 'पर्यटन'],
                'summary' => 'नेपाल पर्यटन बोर्डका अनुसार वसन्त ऋतुको आगमनसँगै हिमालय क्षेत्र र पर्यटकीय गन्तव्यहरूमा पर्यटकको भीड बढेको छ।',
                'content' => "पोखरा तथा अन्नपूर्ण पदमार्ग क्षेत्रमा स्वदेशी तथा विदेशी पर्यटकहरूको बाक्लो उपस्थिति देखिएको छ। होटल व्यवसायीहरूले शतप्रतिशत बुकिङ भएको जानकारी दिएका छन्।",
                'image' => 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
                'images' => ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'],
                'author' => 'सनस्टार संवाददाता',
                'source' => 'SunstarNews.com',
                'time' => '३० मिनेट अघि',
                'views' => '३.८ के',
                'views_count' => 3800,
                'likes_count' => 89,
                'shares_count' => 22,
                'comments_count' => 1,
                'comments_list' => [
                    [
                        'id' => 'c-2',
                        'name' => 'सीता शर्मा',
                        'avatar' => '👩',
                        'time' => '१५ मिनेट अघि',
                        'text' => 'नेपालको प्राकृतिक सुन्दरता अद्वितीय छ। पर्यटन प्रवर्द्धन अझै तीव्र हुनुपर्छ।',
                        'likes' => 5,
                        'approved' => true
                    ]
                ],
                'is_published' => true,
                'is_featured' => false,
            ],
            [
                'id' => 'art-lead-3',
                'title' => 'कृत्रिम बौद्धिकता (AI) र प्रविधिको विकास: नेपाली युवाहरूद्वारा नयाँ सफ्टवेयर सार्वजनिक',
                'slug' => 'ai-technology-innovation-nepal',
                'category' => 'प्रविधि',
                'categories' => ['प्रविधि', 'नयाँ प्रविधि'],
                'summary' => 'नेपाली युवा इन्जिनियरहरूको टोलीले स्थानीय भाषा प्रशोधन (NLP) गर्ने अत्याधुनिक AI मोडल विकास गरेका छन्।',
                'content' => "काठमाडौँमा आयोजित एक प्रविधि सम्मेलनमा नेपाली भाषालाई प्रविधीमैत्री बनाउने नयाँ एआई प्रणाली प्रदर्शन गरिएको छ। यसले सरकारी तथा गैरसरकारी कार्यालयहरूमा कार्यसम्पादन द्रुत बनाउने विश्वास गरिएको छ।",
                'image' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
                'images' => ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80'],
                'author' => 'प्रविधि ब्युरो',
                'source' => 'SunstarNews.com',
                'time' => '१ घण्टा अघि',
                'views' => '६.१ के',
                'views_count' => 6100,
                'likes_count' => 210,
                'shares_count' => 74,
                'comments_count' => 0,
                'comments_list' => [],
                'is_published' => true,
                'is_featured' => false,
            ]
        ];

        foreach ($sampleArticles as $art) {
            \App\Models\Article::updateOrCreate(['id' => $art['id']], $art);
        }
    }
}
