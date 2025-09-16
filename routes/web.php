<?php

use App\Http\Controllers\AppliedProjectContorller;
use App\Http\Controllers\ProjectContorller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Main/Page');
})->name('main-page');

Route::middleware('auth')->group(
    function () {
        Route::get('/projects', [ProjectContorller::class, 'index']);
        Route::get('/projects/create', [ProjectContorller::class, 'create']);
        Route::get('/poejects/{id}', [ProjectContorller::class, 'show']);
        Route::post('/projects', [ProjectContorller::class, 'store']);
        Route::get('/projects/{id}/edit', [ProjectContorller::class, 'edit']);
        Route::put('/projects/{id}', [ProjectContorller::class, 'update']);

        Route::get('/applied-projects', [AppliedProjectContorller::class, 'index']);
    }
);



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/auth.php';
