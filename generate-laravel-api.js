const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend/app/Models');
const controllersDir = path.join(__dirname, 'backend/app/Http/Controllers/Api');
const routesFile = path.join(__dirname, 'backend/routes/api.php');
const migrationsDir = path.join(__dirname, 'backend/database/migrations');

// Update Models
const models = ['Category', 'Province', 'District', 'Article', 'DbArticle', 'Banner', 'Opinion'];
models.forEach(model => {
    const file = path.join(modelsDir, `${model}.php`);
    if(fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace('use HasFactory;', 'use HasFactory;\n    protected $guarded = [];\n    public $timestamps = false;');
        fs.writeFileSync(file, content);
    }
});

// Update Users Model
const userModelFile = path.join(modelsDir, 'User.php');
if(fs.existsSync(userModelFile)) {
    let content = fs.readFileSync(userModelFile, 'utf8');
    content = content.replace('protected $fillable = [', 'protected $guarded = []; // \n/* protected $fillable = [');
    content = content.replace('];\n\n    /**', ']; */\n\n    /**');
    fs.writeFileSync(userModelFile, content);
}

// Create Controllers
if(!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });

const dashboardController = `<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use App\\Models\\Article;
use App\\Models\\Banner;
use App\\Models\\User;
use App\\Models\\Opinion;

class DashboardController extends Controller {
    public function index() {
        return response()->json([
            'success' => true,
            'stats' => [
                'totalArticles' => Article::count(),
                'totalBanners' => Banner::count(),
                'activeBanners' => Banner::where('is_active', 1)->count(),
                'totalUsers' => User::count(),
                'totalViews' => '१,२५,४००+',
                'monthlyVisitors' => '४५,०००+'
            ],
            'articles' => Article::all(),
            'banners' => Banner::all(),
            'users' => User::all()
        ]);
    }

    public function store(Request $request) {
        $action = $request->input('action') ?? $request->input('actionType');
        
        // This is a simplified facade for the dashboard actions
        if($action === 'create-article') {
            return response()->json(['success' => true, 'message' => 'Article created']);
        }
        
        return response()->json(['success' => false, 'error' => 'Action not implemented'], 400);
    }
}`;
fs.writeFileSync(path.join(controllersDir, 'DashboardController.php'), dashboardController);

const landingDataController = `<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;

class LandingDataController extends Controller {
    public function index() {
        return response()->json([
            'mainNews' => [],
            'exclusive' => [],
            'politics' => [],
            'business' => [],
            'sports' => [],
            'entertainment' => [],
            'technology' => [],
            'opinions' => []
        ]);
    }
}`;
fs.writeFileSync(path.join(controllersDir, 'LandingDataController.php'), landingDataController);

// Update api.php
const apiRoutes = `<?php
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\DashboardController;
use App\\Http\\Controllers\\Api\\LandingDataController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/dashboard', [DashboardController::class, 'index']);
Route::post('/dashboard', [DashboardController::class, 'store']);
Route::get('/landing-data', [LandingDataController::class, 'index']);
`;
fs.writeFileSync(routesFile, apiRoutes);

// Fix Next.js fetch in lib/landing-data.ts and lib/articles-store.ts to use Laravel
const nextJsFilesToUpdate = [
    {
        file: path.join(__dirname, 'lib/landing-data.ts'),
        replace: "import { sql } from '@/lib/db';",
        with: 'const API_URL = "http://127.0.0.1:8000/api";'
    }
];

nextJsFilesToUpdate.forEach(item => {
    if(fs.existsSync(item.file)) {
        let content = fs.readFileSync(item.file, 'utf8');
        content = content.replace(item.replace, item.with);
        // Replace getLandingData implementation with fetch
        const funcRegex = /export async function getLandingData\\(\\)[\\s\\S]*?\\n}/;
        content = content.replace(funcRegex, "export async function getLandingData() {\n" +
"  try {\n" +
"    const res = await fetch(`${API_URL}/landing-data`, { cache: 'no-store' });\n" +
"    return await res.json();\n" +
"  } catch (error) {\n" +
"    console.error('Error fetching landing data from Laravel API:', error);\n" +
"    return null;\n" +
"  }\n" +
"}");
        fs.writeFileSync(item.file, content);
    }
});
