<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AlumniController;
use App\Http\Controllers\Api\ConnectionController;
use App\Http\Controllers\Api\MentorController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// ─── Public Auth Routes ──────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Public events & alumni listing
Route::get('/events',        [EventController::class, 'index']);
Route::get('/events/{id}',   [EventController::class, 'show']);
Route::get('/alumni',        [AlumniController::class, 'index']);
Route::get('/alumni/{id}',   [AlumniController::class, 'show']);
Route::get('/skills',        [ProfileController::class, 'allSkills']);

// ─── Authenticated Routes ─────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Profile
    Route::get('/profile/student',  [ProfileController::class, 'getStudent']);
    Route::put('/profile/student',  [ProfileController::class, 'updateStudent']);
    Route::get('/profile/alumni',   [ProfileController::class, 'getAlumni']);
    Route::put('/profile/alumni',   [ProfileController::class, 'updateAlumni']);
    Route::post('/profile/avatar',  [ProfileController::class, 'uploadAvatar']);
    Route::post('/profile/resume',  [ProfileController::class, 'uploadResume']);
    Route::post('/profile/skills',  [ProfileController::class, 'syncSkills']);

    // Connections - REST style matching frontend
    Route::get('/connections',                    [ConnectionController::class, 'myConnections']);
    Route::post('/connections',                   [ConnectionController::class, 'send']);
    Route::patch('/connections/{id}/accept',      [ConnectionController::class, 'accept']);
    Route::patch('/connections/{id}/reject',      [ConnectionController::class, 'reject']);
    Route::delete('/connections/{id}/cancel',     [ConnectionController::class, 'cancel']);     // cancel pending
    Route::delete('/connections/{id}',            [ConnectionController::class, 'disconnect']); // remove accepted

    // Mentorship
    Route::get('/mentors',                     [MentorController::class, 'myRequests']);
    Route::post('/mentors',                    [MentorController::class, 'send']);
    Route::get('/mentors/mentees',             [MentorController::class, 'mentees']);
    Route::patch('/mentors/{id}/accept',       [MentorController::class, 'accept']);
    Route::patch('/mentors/{id}/reject',       [MentorController::class, 'reject']);
    Route::delete('/mentors/{id}/withdraw',    [MentorController::class, 'withdraw']);     // student cancels
    Route::delete('/mentors/{id}/remove',      [MentorController::class, 'removeMentee']); // alumni ends

    // Referrals
    Route::get('/referrals',                [ReferralController::class, 'myReferrals']);
    Route::post('/referrals',               [ReferralController::class, 'send']);
    Route::patch('/referrals/{id}/accept',  [ReferralController::class, 'accept']);
    Route::patch('/referrals/{id}/reject',  [ReferralController::class, 'reject']);

    // Messaging (polling-based)
    Route::get('/messages/chats',               [MessageController::class, 'chats']);
    Route::post('/messages/start',              [MessageController::class, 'getOrCreateChat']);
    Route::get('/messages/{chatId}',            [MessageController::class, 'messages']);
    Route::post('/messages/{chatId}',           [MessageController::class, 'send']);

    // Events (alumni only for create/update/delete)
    Route::middleware('role:alumni,admin')->group(function () {
        Route::post('/events',         [EventController::class, 'store']);
        Route::put('/events/{id}',     [EventController::class, 'update']);
        Route::delete('/events/{id}',  [EventController::class, 'destroy']);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats',             [AdminController::class, 'stats']);
        Route::get('/users',             [AdminController::class, 'users']);
        Route::patch('/users/{id}/toggle', [AdminController::class, 'toggleUser']);
        Route::delete('/users/{id}',     [AdminController::class, 'deleteUser']);
        Route::get('/events',            [AdminController::class, 'events']);
    });
});
