<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Role;
use DateTime;

class StatsController extends Controller
{
    public function leaderboard()
    {
        $users =  User::where('role_id', '=', Role::Student()->id)->where('privacy', '=', 0)->withCount('badges')->orderBy('badges_count', 'desc')->get();
        return response()->json($users);
    }
    public function leaderboardBySession(string $startDate, string $endDate)
    {
        $sessionStartDate = new DateTime($startDate);
        $sessionEndDate = new DateTime($endDate);
        $users =  User::where('role_id', '=', Role::Student()->id)->where('privacy', '=', 0)->withCount(['badges' => function ($query) use ($sessionStartDate, $sessionEndDate) {
            $query->whereBetween('user_badge.created_at', [$sessionStartDate, $sessionEndDate]);
        }])->orderBy('badges_count', 'desc')->get();
        return response()->json($users);
    }
}
