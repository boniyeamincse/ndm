<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
| Prefix:  /api/v1
| Auth:     Laravel Sanctum token (auth:sanctum middleware)
*/

Route::prefix('v1')->group(function () {

    // ── Auth ───────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {

        // Public — rate-limited (see RouteServiceProvider throttle config)
        Route::middleware('throttle:10,1')->group(function () {
            Route::post('/login',           [AuthController::class, 'login']);
            Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        });

        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        // Protected
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me',              [AuthController::class, 'me']);
            Route::post('/logout',         [AuthController::class, 'logout']);
            Route::post('/logout-all',     [AuthController::class, 'logoutAll']);
            Route::put('/change-password', [AuthController::class, 'changePassword']);
        });
    });

});
