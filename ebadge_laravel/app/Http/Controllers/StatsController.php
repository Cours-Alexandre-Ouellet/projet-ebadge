<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Role;
use DateTime;

/**
 * Contrôleur pour les statistiques
 */
class StatsController extends Controller
{
    /**
     * Obtient le classement des utilisateurs ayant le profil public
     *
     * @return JsonResponse la liste des utilisateurs avec le nombre de badges
     */
    public function leaderboard()
    {
        $users =  User::where('role_id', '=', Role::Student()->id)->where('privacy', '=', 0)->withCount('badges')->orderBy('badges_count', 'desc')->get();
        return response()->json($users);
    }

    /**
     * Obtient le classement des utilisateurs ayant le profil public pour une session
     *
     * @param string $startDate
     * @param string $endDate
     * @return JsonResponse la liste des utilisateurs avec le nombre de badges
     */
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
