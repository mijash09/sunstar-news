<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return response()->json([
        'status' => 'Sunstar News API Active',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Direct media file serving fallback without depending on cPanel symlinks
Route::get('/storage/uploads/{filename}', function ($filename) {
    $path = public_path('uploads/' . $filename);
    if (!file_exists($path)) {
        $path = storage_path('app/public/uploads/' . $filename);
    }
    if (file_exists($path)) {
        return Response::file($path);
    }
    abort(404);
})->where('filename', '.*');

Route::get('/uploads/{filename}', function ($filename) {
    $path = public_path('uploads/' . $filename);
    if (!file_exists($path)) {
        $path = storage_path('app/public/uploads/' . $filename);
    }
    if (file_exists($path)) {
        return Response::file($path);
    }
    abort(404);
})->where('filename', '.*');
