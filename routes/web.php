<?php

use App\Http\Controllers\AppliedProjectContorller;
use App\Http\Controllers\ApplyController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProjectContorller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Routes user



Route::middleware('auth')->group(function () {
    Route::get('/applied-positions', [ApplyController::class, 'index'])->name('applied-positions');
    Route::post('/apply-position/{id}', [ApplyController::class, 'store'])->name('apply-positions');
    Route::delete('/applied-position/{id}', [ApplyController::class, 'destroy'])->name('destroy-apply');
    Route::put('/approve/{id}', [ApplyController::class, 'approve'])->name('approve');
    Route::put('/reject/{id}', [ApplyController::class, 'reject'])->name('reject');

    Route::delete('/delete-apply/{id}', [ApplyController::class, 'delete'])->name('delete-apply');
    Route::get('/my-projects', [ProjectContorller::class, 'index'])->name('my-projects');
    Route::get('/projects/add', [ProjectContorller::class, 'create'])->name('create-projects');
    Route::post('/projects', [ProjectContorller::class, 'store'])->name('store-projects');
    Route::get('/projects/{id}/edit', [ProjectContorller::class, 'edit'])->name('edit-projects');
    Route::put('/projects/{id}', [ProjectContorller::class, 'update'])->name('update-projects');
    Route::delete('/projects/{id}', [ProjectContorller::class, 'destroy'])->name('destroy-projects');

    Route::post('positions', [PositionController::class, 'store'])->name('store-positions');
    Route::put('positions/{id}', [PositionController::class, 'update'])->name('update-positions');
    Route::delete('positions/{id}', [PositionController::class, 'destroy'])->name('destroy-positions');
});


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/projects/{id}', [ProjectContorller::class, 'show'])->name('projects-show');  //beda tampilan antara my project dengan project lainnya


// Route::middleware('auth')->group(
//     function () {
//         Route::get('/projects', [ProjectContorller::class, 'index']);
//         Route::get('/projects/create', [ProjectContorller::class, 'create']);
//         Route::get('/poejects/{id}', [ProjectContorller::class, 'show']);
//         Route::post('/projects', [ProjectContorller::class, 'store']);
//         Route::get('/projects/{id}/edit', [ProjectContorller::class, 'edit']);
//         Route::put('/projects/{id}', [ProjectContorller::class, 'update']);

//         Route::get('/applied-projects', [AppliedProjectContorller::class, 'index']);
//     }
// );



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/auth.php';
