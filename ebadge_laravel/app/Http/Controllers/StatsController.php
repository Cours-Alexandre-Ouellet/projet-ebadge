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
     * Enleve les informations sensibles ou inutiles des données 
     */
    private function CleanUp(array $user): array
    {
        unset($user['email'], $user['password'], $user['avatarImagePath'], $user['backgroundImagePath'], $user['organisation_id'], $user['program_id'], $user['created_at'], $user['updated_at']);
        return $user;
    }
    /**
     * Obtient le classement des utilisateurs ayant le profil public
     *
     * @return JsonResponse la liste des utilisateurs avec le nombre de badges
     */
    public function leaderboard()
    {
        $users = User::where('role_id', '=', Role::Student()->id)
        ->where('privacy', '=', 0)
        ->where('active', '=', 1)
        ->withCount('badges')
        ->orderBy('badges_count', 'desc')->get();
        $users = array_map([$this, 'CleanUp'], $users->toArray() ?? []);
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
        $users = User::where('role_id', '=', Role::Student()->id)
        ->where('privacy', '=', 0)
        ->where('active', '=', 1)
        ->withCount([
            'badges' => function ($query) use ($sessionStartDate, $sessionEndDate) {
                $query->whereBetween('user_badge.created_at', [$sessionStartDate, $sessionEndDate]);
            }
        ])->orderBy('badges_count', 'desc')->get();
        $users = array_map([$this, 'CleanUp'], $users->toArray());
        return response()->json($users);
    }

    public function leaderboardByCategory(string $categoryId)
    {
        $users = User::where('role_id', Role::Student()->id)
            ->where('privacy', 0)
            ->where('active', 1)
            ->withCount([
                'badges as badges_count' => function ($query) use ($categoryId) {
                    $query->whereHas('categories', function ($q) use ($categoryId) {
                        $q->where('category.id', $categoryId);
                    });
                }
            ])
            ->orderByDesc('badges_count')
            ->get();

        $users = array_map([$this, 'CleanUp'], $users->toArray());

        return response()->json($users);
    }

}
