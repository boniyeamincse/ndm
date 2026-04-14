<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ChangePasswordRequest;
use App\Http\Requests\Api\V1\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\ResetPasswordRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    // ─── Public Endpoints ─────────────────────────────────────────────────────

    /**
     * POST /api/v1/auth/login
     * Authenticate via email+password or phone+password.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request);

        return $this->success(
            data: [
                'token' => $result['token'],
                'user'  => new UserResource($result['user']),
            ],
            message: 'Login successful.',
            status: 200,
        );
    }

    /**
     * POST /api/v1/auth/forgot-password
     * Send a password reset link. Response is intentionally generic.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->forgotPassword($request->email);

        // Always return the same response to prevent email enumeration.
        return $this->success(
            message: 'If an account with that email exists, a password reset link has been sent.',
        );
    }

    /**
     * POST /api/v1/auth/reset-password
     * Consume reset token and set new password.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $this->authService->resetPassword($request->validated());

        return $this->success(message: 'Password has been reset successfully. Please log in again.');
    }

    // ─── Protected Endpoints ───────────────────────────────────────────────────

    /**
     * GET /api/v1/auth/me
     * Return the authenticated user's profile with roles and permissions.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            data: new UserResource($request->user()),
            message: 'User profile retrieved.',
        );
    }

    /**
     * POST /api/v1/auth/logout
     * Revoke the current access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(message: 'Logged out successfully.');
    }

    /**
     * POST /api/v1/auth/logout-all
     * Revoke all access tokens (logout from all devices).
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutAll($request->user());

        return $this->success(message: 'Logged out from all devices successfully.');
    }

    /**
     * PUT /api/v1/auth/change-password
     * Change the authenticated user's password.
     * All tokens are revoked after change — client must re-login.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword($request->user(), $request);

        return $this->success(message: 'Password changed successfully. Please log in again.');
    }
}
