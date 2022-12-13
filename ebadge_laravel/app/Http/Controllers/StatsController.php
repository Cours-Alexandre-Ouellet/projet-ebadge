<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Role;

class StatsController extends Controller
{
    public function leaderboard()
    {
        $users =  User::where('role_id', '=', Role::Student()->id)->withCount('badges')->orderBy('badges_count', 'desc')->get();
        return response()->json($users);
    }
}
