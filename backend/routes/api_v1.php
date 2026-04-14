<?php

use App\Http\Controllers\Api\V1\AdminMembershipApplicationController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MembershipApplicationController;
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

        // Public — rate-limited
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

    // ── Module 02: Public Membership Application ───────────────────────────
    Route::prefix('membership')->group(function () {
        // throttle: 5 submissions per minute per IP to prevent spam
        Route::middleware('throttle:5,1')->group(function () {
            Route::post('/apply', [MembershipApplicationController::class, 'apply']);
        });
    });

    // ── Module 02: Admin Membership Application Management ─────────────────
    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {

        Route::prefix('membership-applications')->group(function () {
            Route::get('/',                          [AdminMembershipApplicationController::class, 'index']);
            Route::get('/{id}',                      [AdminMembershipApplicationController::class, 'show']);
            Route::put('/{id}/review',               [AdminMembershipApplicationController::class, 'review']);
            Route::put('/{id}/approve',              [AdminMembershipApplicationController::class, 'approve']);
            Route::put('/{id}/reject',               [AdminMembershipApplicationController::class, 'reject']);
            Route::put('/{id}/hold',                 [AdminMembershipApplicationController::class, 'hold']);
            Route::delete('/{id}',                   [AdminMembershipApplicationController::class, 'destroy']);
            Route::put('/{id}/restore',              [AdminMembershipApplicationController::class, 'restore']);
        });

    });

});

