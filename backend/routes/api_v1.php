<?php

use App\Http\Controllers\AdminMemberController;
use App\Http\Controllers\AdminCommitteeController;
use App\Http\Controllers\AdminCommitteeMemberAssignmentController;
use App\Http\Controllers\AdminCommitteeTypeController;
use App\Http\Controllers\AdminPositionController;
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

        // ── Module 03: Member Management ──────────────────────────────────
        Route::get('/members-summary',               [AdminMemberController::class, 'summary']);

        Route::prefix('members')->group(function () {
            Route::get('/',                          [AdminMemberController::class, 'index']);
            Route::get('/{member}',                  [AdminMemberController::class, 'show']);
            Route::put('/{member}',                  [AdminMemberController::class, 'update']);
            Route::patch('/{member}/status',         [AdminMemberController::class, 'updateStatus']);
            Route::delete('/{member}',               [AdminMemberController::class, 'destroy']);
            Route::put('/{member}/restore',          [AdminMemberController::class, 'restore']);
        });

        // ── Module 04: Committee Type Management ──────────────────────────
        Route::prefix('committee-types')->group(function () {
            Route::get('/',                          [AdminCommitteeTypeController::class, 'index']);
            Route::post('/',                         [AdminCommitteeTypeController::class, 'store']);
            Route::get('/{committeeType}',           [AdminCommitteeTypeController::class, 'show']);
            Route::put('/{committeeType}',           [AdminCommitteeTypeController::class, 'update']);
            Route::delete('/{committeeType}',        [AdminCommitteeTypeController::class, 'destroy']);
            Route::put('/{committeeType}/restore',   [AdminCommitteeTypeController::class, 'restore']);
        });

        // ── Module 04: Committee Management ───────────────────────────────
        Route::get('/committees-summary',            [AdminCommitteeController::class, 'summary']);
        Route::get('/committees-tree',               [AdminCommitteeController::class, 'tree']);

        Route::prefix('committees')->group(function () {
            Route::get('/',                          [AdminCommitteeController::class, 'index']);
            Route::post('/',                         [AdminCommitteeController::class, 'store']);
            Route::get('/{committee}',               [AdminCommitteeController::class, 'show']);
            Route::put('/{committee}',               [AdminCommitteeController::class, 'update']);
            Route::patch('/{committee}/status',      [AdminCommitteeController::class, 'updateStatus']);
            Route::delete('/{committee}',            [AdminCommitteeController::class, 'destroy']);
            Route::put('/{committee}/restore',       [AdminCommitteeController::class, 'restore']);
        });

        // ── Module 05: Position / Designation Management ─────────────────
        Route::get('/positions-summary',             [AdminPositionController::class, 'summary']);

        Route::prefix('positions')->group(function () {
            Route::get('/',                          [AdminPositionController::class, 'index']);
            Route::post('/',                         [AdminPositionController::class, 'store']);
            Route::get('/{position}',                [AdminPositionController::class, 'show']);
            Route::put('/{position}',                [AdminPositionController::class, 'update']);
            Route::patch('/{position}/status',       [AdminPositionController::class, 'updateStatus']);
            Route::delete('/{position}',             [AdminPositionController::class, 'destroy']);
            Route::put('/{position}/restore',        [AdminPositionController::class, 'restore']);
        });

        // ── Module 06: Committee Member Assignment ───────────────────────
        Route::get('/committee-member-assignments-summary', [AdminCommitteeMemberAssignmentController::class, 'summary']);

        Route::prefix('committee-member-assignments')->group(function () {
            Route::get('/',                          [AdminCommitteeMemberAssignmentController::class, 'index']);
            Route::post('/',                         [AdminCommitteeMemberAssignmentController::class, 'store']);
            Route::get('/{assignment}',              [AdminCommitteeMemberAssignmentController::class, 'show']);
            Route::put('/{assignment}',              [AdminCommitteeMemberAssignmentController::class, 'update']);
            Route::patch('/{assignment}/status',     [AdminCommitteeMemberAssignmentController::class, 'updateStatus']);
            Route::post('/{assignment}/transfer',    [AdminCommitteeMemberAssignmentController::class, 'transfer']);
            Route::delete('/{assignment}',           [AdminCommitteeMemberAssignmentController::class, 'destroy']);
            Route::put('/{assignment}/restore',      [AdminCommitteeMemberAssignmentController::class, 'restore']);
        });

        Route::get('/committees/{committeeId}/members', [AdminCommitteeMemberAssignmentController::class, 'committeeMembers']);
        Route::get('/committees/{committeeId}/office-bearers', [AdminCommitteeMemberAssignmentController::class, 'committeeOfficeBearers']);
        Route::get('/members/{memberId}/committee-assignments', [AdminCommitteeMemberAssignmentController::class, 'memberAssignments']);

    });

});

