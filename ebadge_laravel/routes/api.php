<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Role;

Route::group([
    'prefix' => 'teacher-code',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ADMIN,
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
        'roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT . ',' . Role::ETUDIANT,
    ],
], function () {
    Route::get('/', [App\Http\Controllers\BadgeController::class, 'index']);

    Route::group([
        'middleware' => [
            'auth:api',
            'roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT,
        ],
    ], function () {
        Route::post('/', [App\Http\Controllers\BadgeController::class, 'create']);
        Route::put('/', [App\Http\Controllers\BadgeController::class, 'update']);
        Route::delete('/{id}', [App\Http\Controllers\BadgeController::class, 'destroy']);
    });
});

Route::group([
    'prefix' => 'category',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT,
    ],
], function () {
    Route::get('/', [App\Http\Controllers\CategoryController::class, 'index']);
    Route::post('/', [App\Http\Controllers\CategoryController::class, 'create']);
    Route::put('/', [App\Http\Controllers\CategoryController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\CategoryController::class, 'destroy']);
});


Route::group([
    'prefix' => 'user',
    'middleware' => [
        'auth:api',
    ],
], function () {
    Route::get('/', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/assign-badge', [App\Http\Controllers\UserController::class, 'assignBadge'])->middleware('roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT);
    Route::post('/remove-badge', [App\Http\Controllers\UserController::class, 'removeBadge'])->middleware('roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT);
    Route::get("/my-badges", [App\Http\Controllers\UserController::class, "getMyBadges"]);
    Route::get('/{id}', [App\Http\Controllers\UserController::class, 'show'])->middleware('roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT);
    Route::post('/edit-background', [App\Http\Controllers\UserController::class, 'editBackground']);
    Route::post('/edit-avatar', [App\Http\Controllers\UserController::class, 'editAvatar']);
    Route::post('/edit-privacy', [App\Http\Controllers\UserController::class, 'editPrivacy']);

    Route::get("/{id}/badges", [App\Http\Controllers\UserController::class, "getUserBadges"]);
    Route::get("/{id}/badges-left", [App\Http\Controllers\UserController::class, "getUserBadgeLeft"]);
    Route::get("/role/{id}", [App\Http\Controllers\UserController::class, 'getAllByRole'])->middleware('roles:' . Role::ADMIN);
    Route::delete("/admin/{id}", [App\Http\Controllers\UserController::class, 'deleteAdmin'])->middleware('roles:' . Role::ADMIN);
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
        Route::get('current_user', [AuthController::class, 'current_user']);
    });
});


//add route stats
Route::group([
    'prefix' => 'stats',
    'middleware' => [
        'auth:api',
        'roles:' . Role::ADMIN . ',' . Role::ENSEIGNANT . ',' . Role::ETUDIANT,
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
    Route::delete('/', [App\Http\Controllers\OrganisationController::class, 'delete'])->middleware('auth:api', 'roles:' . Role::ADMIN);
    Route::post('/', [App\Http\Controllers\OrganisationController::class, 'create'])->middleware('auth:api', 'roles:' . Role::ADMIN);
});

Route::group([
    'prefix' => 'program',
], function () {
    Route::get('/', [App\Http\Controllers\ProgramController::class, 'index']);
    Route::delete('/', [App\Http\Controllers\ProgramController::class, 'delete'])->middleware('auth:api', 'roles:' . Role::ADMIN);
    Route::post('/', [App\Http\Controllers\ProgramController::class, 'create'])->middleware('auth:api', 'roles:' . Role::ADMIN);
});
