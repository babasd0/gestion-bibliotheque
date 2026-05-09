<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LivreController;
use App\Http\Controllers\AdherentController;
use App\Http\Controllers\EmpruntController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('livres', LivreController::class);
    Route::apiResource('adherents', AdherentController::class);
    Route::apiResource('emprunts', EmpruntController::class);
});