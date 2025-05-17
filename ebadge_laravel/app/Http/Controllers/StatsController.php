<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Category;
use App\Models\CategoryBadge;
use Illuminate\Http\Request;
use App\Models\Role;
use DateTime;
use Illuminate\Support\Facades\DB;


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

    /**
     * Retourne le nombre total de badges attribués à des utilisateurs
     * Source : table pivot user_badge
     */
    public function totalAssignedBadges()
    {
        $count = DB::table('user_badge')->count();
        return response()->json(['assigned' => $count]);
    }

    /**
     * Retourne le nombre moyen de badges attribués par étudiant
     * - Compte les lignes de la table pivot user_badge
     * - Compte les utilisateurs avec role_id = 4 (étudiants)
     * - Divise les deux valeurs pour obtenir la moyenne
     */
    public function averageBadgesPerStudent()
    {
        $studentCount = User::where('role_id', 4)->count();
        $totalBadgesAssigned = DB::table('user_badge')->count();

        // Évite la division par zéro
        $average = $studentCount > 0 ? $totalBadgesAssigned / $studentCount : 0;

        return response()->json(['average' => round($average, 2)]);
    }

    /**
     * Retourne le badge le plus et le moins attribué
     * - Groupe les entrées de user_badge par badge_id
     * - Trie par nombre d’assignations
     */
    public function mostAndLeastAssignedBadges()
    {
        $results = DB::table('user_badge')
            ->select('badge_id', DB::raw('COUNT(*) as count'))
            ->groupBy('badge_id')
            ->orderByDesc('count')
            ->get();

        // Badge le plus attribué
        $max = $results->first();

        // Badge le moins attribué (avec au moins une attribution)
        $min = $results->sortBy('count')->first();

        return response()->json([
            'most' => $max,
            'least' => $min
        ]);
    }
    /**
     * Retourne le dernier badge attribué (chronologiquement)
     * - Trie la table user_badge selon created_at
     */
    public function lastAssignedBadge()
    {
        $record = DB::table('user_badge')
            ->latest('created_at')
            ->first();

        return response()->json($record);
    }

    /**
     * Retourne la répartition des badges par catégorie
     * @return \Illuminate\Http\JsonResponse
     */
    public function badgeDistributionByCategory()
    {
        $badges = CategoryBadge::with('category:id,name')->get();
    
        // Regroupe les badges par nom de catégorie (ou 'Inconnue' si la relation est absente)
        $grouped = $badges->groupBy(fn($item) => $item->category->name ?? 'Inconnue');
    
        // Transforme chaque groupe en objet { name, count }
        $distribution = $grouped->map(function ($group, $name) {
            return [
                'name' => $name,
                'count' => $group->count(),
            ];
        })->values(); // Réindexe proprement le tableau
    
        return response()->json($distribution);
    }

    /**
     * Retourne les 5 meilleurs élèves par catégorie de badge
     * (ex-aequo inclus), selon le nombre de badges obtenus dans chaque catégorie.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function TopByCategory()
    {
        // Récupération brute des données
        $results = DB::table('user_badge as ub')
            ->join('badge as b', 'ub.badge_id', '=', 'b.id')
            ->join('category_badge as cb', 'b.id', '=', 'cb.badge_id')
            ->join('category as c', 'cb.category_id', '=', 'c.id')
            ->join('user as u', 'ub.user_id', '=', 'u.id')
            ->where('u.role_id', Role::Student()->id)  // uniquement les étudiants
            ->where('u.privacy', 0)                    // profil public uniquement
            ->where('u.active', 1)                     // utilisateur actif
            ->select(
                'ub.user_id',
                'c.name as category',
                DB::raw('COUNT(*) as count'),
                'u.first_name',
                'u.last_name',
                'u.avatarImagePath'
            )
            ->groupBy('ub.user_id', 'c.name', 'u.first_name', 'u.last_name', 'u.avatarImagePath')
            ->get();

        // Organisation des données par catégorie
        $grouped = [];

        foreach ($results as $row) {
            $grouped[$row->category][] = [
                'user' => [
                    'id' => $row->user_id,
                    'first_name' => $row->first_name,
                    'last_name' => $row->last_name,
                    'avatarImagePath' => $row->avatarImagePath,
                ],
                'count' => $row->count,
            ];
        }

        // Tri des utilisateurs par catégorie et gestion des rangs avec ex-aequo
        $final = [];

        foreach ($grouped as $category => $users) {
            // Tri décroissant par nombre de badges
            usort($users, fn($a, $b) => $b['count'] <=> $a['count']);

            $ranked = [];
            $currentRank = 1;
            $previousCount = null;
            $sameRankCount = 0;

            foreach ($users as $index => $entry) {
                // Si le nombre est égal au précédent, conserver le même rang
                if ($previousCount !== null && $entry['count'] === $previousCount) {
                    $rank = $currentRank;
                    $sameRankCount++;
                } else {
                    $currentRank = $index + 1;
                    $rank = $currentRank;
                    $sameRankCount = 1;
                }

                // Ajout des infos à l'entrée
                $entry['category'] = $category;
                $entry['rank'] = $rank;

                $ranked[] = $entry;
                $previousCount = $entry['count'];

                // Si on dépasse la 5e position (hors ex-aequo), on arrête
                if ($rank > 5) break;
            }

            // Fusion dans la réponse finale
            $final = array_merge($final, $ranked);
        }

        // Envoi de la réponse
        return response()->json($final);
    }

}
