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
    Route::get('/{id}', [App\Http\Controllers\BadgeController::class, 'getBadgeById']);
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
    Route::get("/new-badges", [App\Http\Controllers\UserController::class, "getMyNewBadges"]);
    Route::put("/new-badges/seen", [App\Http\Controllers\UserController::class, "notifyHasSeenBadges"]);
    Route::get('/{id}', [App\Http\Controllers\UserController::class, 'show'])->middleware('roles:' . Role::ALL_ADMINS . ',' . Role::ENSEIGNANT);
    Route::post('/edit-background', [App\Http\Controllers\UserController::class, 'editBackground']);
    Route::post('/edit-avatar', [App\Http\Controllers\UserController::class, 'editAvatar']);
    Route::post('/edit-privacy', [App\Http\Controllers\UserController::class, 'editPrivacy']);

    Route::get("/{id}", [App\Http\Controllers\UserController::class, "getUser"]);
    Route::get("/{id}/badges", [App\Http\Controllers\UserController::class, "getUserBadges"]);
    Route::get("/{id}/favoriteBadges", [App\Http\Controllers\UserController::class, "getUserBadgesFavorite"]);
    Route::get("/{id}/notFavoriteBadges", [App\Http\Controllers\UserController::class, "getUserBadgesNonFavorite"]);
    Route::put("/changeFavoriteBadge", [App\Http\Controllers\UserController::class, "changeFavoriteBadge"]);
    Route::get("/{id}/badges-left", [App\Http\Controllers\UserController::class, "getUserBadgeLeft"]);
    Route::get("/role/{id}", [App\Http\Controllers\UserController::class, 'getAllByRole'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::delete("/{id}", [App\Http\Controllers\UserController::class, 'deleteUser'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post('/assign-admin', [App\Http\Controllers\UserController::class, 'assignAdmin'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post("/assign-admin-contact", [App\Http\Controllers\UserController::class, 'assignAdminContact'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post("/remove-admin", [App\Http\Controllers\UserController::class, 'removeAdmin'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post('/{id}/change-password', [App\Http\Controllers\UserController::class, 'changePassword'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::get('/active/{status}', [App\Http\Controllers\UserController::class, 'getUsersByActiveStatus'])->middleware('roles:' . Role::ALL_ADMINS. ',' . Role::ENSEIGNANT);
    Route::post('/{id}/toggle-active', [App\Http\Controllers\UserController::class, 'toggleActiveStatus'])->middleware('roles:' . Role::ALL_ADMINS);
    Route::post('/update-role', [App\Http\Controllers\UserController::class, 'updateRole'])->middleware('roles:' . Role::ALL_ADMINS);
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
    Route::get('/assigned-count', [App\Http\Controllers\StatsController::class, 'totalAssignedBadges']);
    Route::get('/average-badges', [App\Http\Controllers\StatsController::class, 'averageBadgesPerStudent']);
    Route::get('/top-bottom-badges', [App\Http\Controllers\StatsController::class, 'mostAndLeastAssignedBadges']);
    Route::get('/top-category', [App\Http\Controllers\StatsController::class, 'TopByCategory']);
    Route::get('/last-badge', [App\Http\Controllers\StatsController::class, 'lastAssignedBadge']); 
    Route::get('/distribution/badges', [App\Http\Controllers\StatsController::class, 'badgeDistributionByCategory']);
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