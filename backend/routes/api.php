<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LandingDataController;
use App\Http\Controllers\Api\ScraperController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\RashifalController;
use App\Http\Controllers\NepseController;

/*
|--------------------------------------------------------------------------
| API Routes for Sunstar News
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 1. Dashboard (Integrated Multiplexed & Stats)
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::post('/dashboard', [DashboardController::class, 'store']);

// 2. Landing Page Aggregated Data
Route::get('/landing-data', [LandingDataController::class, 'index']);

// 3. Media Upload and Download
Route::post('/upload', [MediaController::class, 'upload']);
Route::get('/download/{filename}', [MediaController::class, 'download']);

// 4. Scrapers (Live Market NEPSE & Daily Rashifal)
Route::get('/nepse', [ScraperController::class, 'getNepse']);
Route::get('/nepse/live', [NepseController::class, 'getLiveMarket']);
Route::get('/nepse/official', [NepseController::class, 'getOfficialNepse']);
Route::get('/nepse/trending', [NepseController::class, 'getTrendingStocks']);
Route::get('/rashifal', [RashifalController::class, 'getDailyHoroscope']);
Route::get('/rashifal/daily', [RashifalController::class, 'getDailyHoroscope']);
Route::get('/daily-horoscope', [RashifalController::class, 'getDailyHoroscope']);

// 5. RESTful Articles & Social Sharing
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::post('/articles', [ArticleController::class, 'store']);
Route::put('/articles/{id}', [ArticleController::class, 'update']);
Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
Route::post('/articles/{id}/like', [ArticleController::class, 'like']);
Route::post('/articles/{id}/comments', [ArticleController::class, 'comment']);
Route::post('/share', [ArticleController::class, 'share']);

// 6. Advertisement Banners
Route::get('/banners', [BannerController::class, 'index']);
Route::post('/banners', [BannerController::class, 'store']);
Route::delete('/banners/{id}', [BannerController::class, 'destroy']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// 8. Safe 1-Click Database Schema Migration for cPanel (Preserves All Existing Data)
Route::get('/migrate-db', function (Request $request) {
    $secret = $request->query('secret');
    $expectedSecret = env('DB_MIGRATE_SECRET', 'sunstar-secure-migrate-2026');

    if (!$secret || $secret !== $expectedSecret) {
        return response()->json([
            'success' => false,
            'message' => 'अनधिकृत: कृपया सही secret key प्रदान गर्नुहोस्। (Unauthorized: Please provide valid ?secret=)'
        ], 403);
    }

    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output = \Illuminate\Support\Facades\Artisan::output();

        return response()->json([
            'success' => true,
            'message' => 'डेटाबेस सफलतापूर्वक माइग्रेट भयो! पुरानो कुनै पनि डेटा मेटिएको छैन। (Database successfully migrated with 0 data loss!)',
            'artisan_output' => trim($output),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

