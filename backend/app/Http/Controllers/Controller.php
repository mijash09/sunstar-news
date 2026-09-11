<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Sunstar News API Documentation (सनस्टार न्युज)",
    description: "Complete RESTful & Real-Time API for Sunstar News Portal: Articles, Live NEPSE & Rashifal Scrapers, Media Uploads/Downloads, Advertisement Banners, Dashboard Stats & Staff Management.",
    contact: new OA\Contact(name: "Sunstar Tech Team", email: "sitaram@sunstarnews.com")
)]
#[OA\Server(url: "http://127.0.0.1:8000", description: "Laravel Backend API Server")]
#[OA\Server(url: "http://localhost:3001", description: "Next.js Frontend Proxy Server")]
abstract class Controller
{
    //
}
