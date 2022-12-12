<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function leaderboard()
    {
        $users =  User::withCount('badges')->orderBy('badges_count', 'desc')->get();
        return response()->json($users);
    }
}
