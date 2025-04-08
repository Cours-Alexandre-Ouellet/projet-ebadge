<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Role;

Route::group([
    'prefix' => 'teacher-code',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ALL_ADMINS,
    ],
], function () {
    Route::get('/', [App\Http\Controllers\TeacherCodeController::class, 'index']);
    Route::post('/', [App\Http\Controllers\TeacherCodeController::class, 'create']);
    Route::put('/', [App\Http\Controllers\TeacherCodeController::class, 'assign']);
    Route::delete('/', [App\Http\Controllers\TeacherCodeController::class, 'destroy']);
});


Route::group([
    'prefix' => 'badge',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT . ',' . Role::ETUDIANT,
    ],
], function () {
    Route::get('/', [App\Http\Controllers\BadgeController::class, 'index']);

    Route::group([
        'middleware' => [
            'auth:api',
            'roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT,
        ],
    ], function () {
        Route::get('/category/names', [App\Http\Controllers\BadgeController::class, 'getAllBadgesWithCategory']);
        Route::get('/category/name/{id}', [App\Http\Controllers\BadgeController::class, 'getBadgeCategory']);
        Route::post('/', [App\Http\Controllers\BadgeController::class, 'create']);
        Route::post('/image', [App\Http\Controllers\BadgeController::class, 'updateImage']);
        Route::put('/', [App\Http\Controllers\BadgeController::class, 'update']);
        Route::put('/activation', [App\Http\Controllers\BadgeController::class, 'activation']);
        Route::delete('/{id}', [App\Http\Controllers\BadgeController::class, 'destroy']);
    });
});

Route::group([
    'prefix' => 'category',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT,
    ],
], function () {
    Route::get('/', [App\Http\Controllers\CategoryController::class, 'index']);
    Route::post('/', [App\Http\Controllers\CategoryController::class, 'create'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::put('/', [App\Http\Controllers\CategoryController::class, 'update'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post('/assign-badge', [App\Http\Controllers\CategoryController::class, 'assignBadge'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::post('/remove-badge', [App\Http\Controllers\CategoryController::class, 'removeBadge'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::delete('/{id}', [App\Http\Controllers\CategoryController::class, 'destroy'])->middleware('roles:' . Role::ALL_ADMINS);

    Route::get("/{id}/badges", [App\Http\Controllers\CategoryController::class, "getCategoryBadges"]);
    Route::get("/{id}/badges-left", [App\Http\Controllers\CategoryController::class, "getCategoryBadgeLeft"]);
});


Route::group([
    'prefix' => 'user',
    'middleware' => [
        'auth:api',
    ],
], function () {
    Route::get('/', [App\Http\Controllers\UserController::class, 'index']);
    Route::put('/modify-password', [App\Http\Controllers\UserController::class, 'modifyPassword']);
    Route::post('/assign-badge', [App\Http\Controllers\UserController::class, 'assignBadge'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::post('/remove-badge', [App\Http\Controllers\UserController::class, 'removeBadge'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::post('/assign-badge', [App\Http\Controllers\UserController::class, 'assignBadge'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::post('/remove-badge', [App\Http\Controllers\UserController::class, 'removeBadge'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::get("/my-badges", [App\Http\Controllers\UserController::class, "getMyBadges"]);
    Route::get('/{id}', [App\Http\Controllers\UserController::class, 'show'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::post('/edit-background', [App\Http\Controllers\UserController::class, 'editBackground']);
    Route::post('/edit-avatar', [App\Http\Controllers\UserController::class, 'editAvatar']);
    Route::post('/edit-privacy', [App\Http\Controllers\UserController::class, 'editPrivacy']);

    Route::get("/{id}", [App\Http\Controllers\UserController::class, "getUser"]);
    Route::get("/{id}/badges", [App\Http\Controllers\UserController::class, "getUserBadges"]);
    Route::get("/{id}/badgesFavoris", [App\Http\Controllers\UserController::class, "getUserBadgesFavoris"]);
    Route::get("/{id}/badgesNonFavoris", [App\Http\Controllers\UserController::class, "getUserBadgesNonFavoris"]);
    Route::get("/{id}/badges-left", [App\Http\Controllers\UserController::class, "getUserBadgeLeft"]);
    Route::get("/role/{id}", [App\Http\Controllers\UserController::class, 'getAllByRole'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::delete("/admin/{id}", [App\Http\Controllers\UserController::class, 'deleteAdmin'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post('/assign-admin', [App\Http\Controllers\UserController::class, 'assignAdmin'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post("/assign-admin-contact", [App\Http\Controllers\UserController::class, 'assignAdminContact'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post("/remove-admin", [App\Http\Controllers\UserController::class, 'removeAdmin'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post("/admin/{id}/change-password", [App\Http\Controllers\UserController::class, 'changeAdminPassword'])->middleware('roles:' . Role::ADMIN);
});


Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login']);
    
    Route::post('signup', [AuthController::class, 'signup']);

    Route::group([
        'middleware' => 'auth:api'
    ], function () {
        Route::get('logout', [AuthController::class, 'logout']);
        Route::get('current_user', [AuthController::class, 'currentUser']);
    });
});


//add route stats
Route::group([
    'prefix' => 'stats',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT . ',' . Role::ETUDIANT,
    ],
], function () {
    Route::get('/leaderboard', [App\Http\Controllers\StatsController::class, 'Leaderboard']);
    Route::get('/leaderboard/{startDate}/{endDate}', [App\Http\Controllers\StatsController::class, 'LeaderboardBySession']);
    Route::get('/leaderboard/{category}', [App\Http\Controllers\StatsController::class, 'LeaderboardByCategory']);
});

Route::group([
    'prefix' => 'organisation',
], function () {
    Route::get('/', [App\Http\Controllers\OrganisationController::class, 'index']);
    Route::delete('/', [App\Http\Controllers\OrganisationController::class, 'delete'])->middleware('auth:api', 'roles:' . Role::ALL_ADMINS);
    Route::post('/', [App\Http\Controllers\OrganisationController::class, 'create'])->middleware('auth:api', 'roles:' . Role::ALL_ADMINS);
});

Route::group([
    'prefix' => 'program',
], function () {
    Route::get('/', [App\Http\Controllers\ProgramController::class, 'index']);
    Route::delete('/', [App\Http\Controllers\ProgramController::class, 'delete'])->middleware('auth:api', 'roles:' . Role::ALL_ADMINS);
    Route::post('/', [App\Http\Controllers\ProgramController::class, 'create'])->middleware('auth:api', 'roles:' . Role::ALL_ADMINS);
});

Route::group([
    'prefix' => 'contact',
], function () {
    Route::get('/', [ContactController::class, 'index']);
});