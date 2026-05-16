<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LivreController;
use App\Http\Controllers\AdherentController;
use App\Http\Controllers\EmpruntController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MembreAuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/membre/register', [MembreAuthController::class, 'register']);
Route::post('/membre/login', [MembreAuthController::class, 'login']);
Route::get('/membre/emprunts', [MembreAuthController::class, 'mesEmprunts']);
Route::get('/membre/reservations', [MembreAuthController::class, 'mesReservations']);
Route::get('/catalogue', [LivreController::class, 'index']);
Route::post('/membre/reservations', [ReservationController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('livres', LivreController::class);
    Route::apiResource('adherents', AdherentController::class);
    Route::apiResource('emprunts', EmpruntController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::get('/emprunts/adherent/{id}', [EmpruntController::class, 'parAdherent']);
    Route::post('/adherents/{id}/sanctionner', [AdherentController::class, 'sanctionner']);
    Route::post('/adherents/{id}/lever-sanction', [AdherentController::class, 'lever_sanction']);
    Route::post('/reservations/{id}/valider', [ReservationController::class, 'valider']);
    Route::post('/reservations/{id}/refuser', [ReservationController::class, 'refuser']);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});