<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers;
use App\Http\Controllers\AuthController;

Route::group([
    'prefix' => 'teacher-code',
    'prefix' => 'users'
], function () {
    Route::post('/', [App\Http\Controllers\TeacherCodeController::class, 'create']);
    Route::delete('/', [App\Http\Controllers\TeacherCodeController::class, 'destroy']);
});


Route::group([
    'prefix' => 'badge',
], function () {
    Route::get('/', [App\Http\Controllers\BadgeController::class, 'index']);

    Route::group([
        'middleware' => [
            'auth:api',
            'roles:Administrateur,Enseigant',
        ],
    ], function () {
        Route::post('/', [App\Http\Controllers\BadgeController::class, 'create']);
        Route::put('/', [App\Http\Controllers\BadgeController::class, 'update']);
    });
});

Route::group([
    'prefix' => 'user',
    'middleware' => [
        'auth:api',
    ],
], function () {
    Route::get('/', [App\Http\Controllers\UserController::class, 'index'])->middleware('roles:Administrateur');
    Route::post('/assign-badge', [App\Http\Controllers\UserController::class, 'assignBadge'])->middleware('roles:Administrateur,Enseigant');
    Route::post('/remove-badge', [App\Http\Controllers\UserController::class, 'removeBadge'])->middleware('roles:Administrateur,Enseigant');
    Route::get('/{id}', [App\Http\Controllers\UserController::class, 'show'])->middleware('roles:Administrateur,Enseigant');
    Route::post('/edit-background', [App\Http\Controllers\UserController::class, 'editBackground']);
    Route::post('/edit-avatar', [App\Http\Controllers\UserController::class, 'editAvatar']);
});



Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('signup', [AuthController::class, 'signup']);

    Route::group([
      'middleware' => 'auth:api'
    ], function() {
        Route::get('logout', [AuthController::class, 'logout']);
        Route::get('current_user', [AuthController::class, 'current_user']);
    });
});
