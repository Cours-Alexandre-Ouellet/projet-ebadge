<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UserConfirmPasswordRequest;
use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Role;
use App\Models\Badge;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Badge\BadgeUpdateFavoriteRequest;

class UserController extends Controller
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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        if ($currentUser != null) {

            $role = $currentUser->getRoleName();

            switch ($role) {
                case Role::ADMIN:
                case Role::ADMIN_CONTACT:
                    // retourne tous les élèves de tous les groupes
                    $users = User::all();
                    $users = array_map([$this, 'CleanUp'], $users->toArray() ?? []);
                    return response()->json(['users' => $users]);
                case Role::ENSEIGNANT:
                    // retourne tous les eleve du meme groupe que l'utilisateur
                    $users = User::where('program_id', $currentUser->program_id)->get();
                    $users = array_map([$this, 'CleanUp'], $users->toArray() ?? []);
                    return response()->json(['users' => $users]);
                default:
                    return response()->json(['error' => 'Unauthorized'], 401);
            }
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Revoie tout les badges d'un utilisateur
     * 
     * @param $id l'id de l'utilisateur 
     * @return JsonResponse tout les badges de l'utilisateur
     */
    public function show(int $id)
    {
        $user = User::find($id);
        $user->badges = UserBadge::where('user_id', $id)->get();
        return response()->json($user);
    }

    /**
     * Assigne un badge à un utilisateur
     * 
     * @param $request 
     * @return JsonResponse un message de confirmation
     */
    public function assignBadge(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
            'badge_id' => 'required|exists:badge,id'
        ]);
        $user = User::find($request->user_id);
        $user->badges()->attach($request->badge_id);
        return response()->json([
            'message' => 'Badge assigned'
        ]);
    }

    /**
     * Enleve un badge à un utilisateur
     * 
     * @param $request 
     * @return JsonResponse un message de confirmation
     */
    public function removeBadge(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
            'badge_id' => 'required|exists:badge,id'
        ]);
        $user = User::find($request->user_id);
        $user->badges()->detach($request->badge_id);
        return response()->json([
            'message' => 'Badge removed'
        ]);
    }

    /**
     * Get all badges of a user
     */
    public function getUserBadges(int $id)
    {
        $badges = Badge::select('badge.*', 'c.color as category_color', 'c.name as category_name')
            ->leftJoin('category_badge as cb', 'cb.badge_id', '=', 'badge.id')
            ->leftJoin('category as c', 'c.id', '=', 'cb.category_id')
            ->join('user_badge','badge.id','=','user_badge.badge_id')
            ->where('user_badge.user_id', $id)
            ->get();

        if ($badges == null) {
            return response()->json(['error' => 'User not found'], 404);
        }


        return response()->json([
            'badges' => $badges
        ]);
    }

    /**
     * Obtient tous les badges favoris d'un utilisateur
     */
    public function getUserBadgesFavorite(int $id)
    {
        $badges = Badge::select('b.*', 'c.color as category_color', 'c.name as category_name', 'u.first_name as creator_name', 'u.last_name as creator_last_name')
        ->join('user_badge', 'user_badge.user_id','=','user.id')
        ->join('badge as b', 'b.id','=','user_badge.badge_id')
        ->leftJoin('category_badge as cb', 'cb.badge_id', '=', 'b.id')
        ->leftJoin('category as c', 'c.id', '=', 'cb.category_id')
        ->leftJoin('user as u', 'u.id', '=', 'b.teacher_id')
        ->from('user')
        ->where('user_badge.favorite','1')
        ->where('user.id', $id)
        ->get();

        if ($badges == null) {
            return response()->json(['error' => 'User not found'], 404);
        }



        foreach ($badges as $badge) {
            $badge->setPossessionPercentage();
        }

        return response()->json([
            'badges' => $badges
        ]);
    }

    /**
     * obtient tous les badges non favoris d'un utilisateur
     */
    public function getUserBadgesNonFavorite(int $id)
    {
        $badges = Badge::select('b.*')
            ->join('user_badge', 'user_badge.user_id', '=', 'user.id')
            ->join('badge as b', 'b.id', '=', 'user_badge.badge_id')
            ->from('user')
            ->where('user_badge.favorite', '0')
            ->where('user.id', $id)
            ->get();

        if ($badges == null) {
            return response()->json(['error' => 'User not found'], 404);
        }


        foreach ($badges as $badge) {
            $badge->setPossessionPercentage();

        }

        return response()->json([
            'badges' => $badges
        ]);
    }

    /**
     * Change le favoritisme d'un badge
     */
    public function changeFavoriteBadge(BadgeUpdateFavoriteRequest $request)
    {
        $userId = $request->get('user_id');
        $badgeId = $request->get('badge_id');
        $favorite = $request->get('favorite');
        if ($favorite == 1) {
            $count = UserBadge::where('user_id', $userId)->where('favorite', 1)->count();
            if ($count >= 3) {
                return response()->json(['error' => 'le nombre maximum de badges favoris à été atteint'], 404);
            }
        }
        $userBadge = UserBadge::where('user_id', $userId)->where('badge_id', $badgeId)->first();

        $userBadge->favorite = $favorite;
        $userBadge->save();

        return response()->json(['message' => 'favoritisme changé']);
    }


    /**
     * Récuperer une personne
     */
    public function getUser(int $id)
    {
        $user = User::find($id);

        if ($user == null) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role_id' => $user->role_id,
                'username' => $user->username,
                'privacy' => $user->privacy,
                'avatarImagePath' => $user->avatarImagePath,
                'backgroundImagePath' => $user->backgroundImagePath,
            ]
        ]);
    }

    /**
     * Get all missing badges of a user
     */
    public function getUserBadgeLeft(int $id)
    {
        $user = User::find($id);

        if ($user == null) {
            return response()->json(['error' => 'User not found'], 404);
        }
        //TODO: valider avec le group

        $badges = $user->badges;
        $missingBadges = Badge::select('badge.*', 'c.color as category_color', 'c.name as category_name')
        ->leftJoin('category_badge as cb', 'cb.badge_id', '=', 'badge.id')
        ->leftJoin('category as c', 'c.id', '=', 'cb.category_id')
        ->whereNotIn('badge.id', $badges->pluck('id'))
        ->get();
        return response()->json([
            'badges' => $missingBadges
        ]);
    }

    /**
     * Change le fond d'écran d'un utilisateur
     * 
     * @return JsonResponse un message de confirmation
     */
    public function editBackground(Request $request)
    {
        $request->validate([
            'background' => 'image',
            'backgroundUrl' => 'url|max:2048'
        ]);

        if ($request->hasFile('background')) {
            $path = $request->file('background')->storeAs('public/backgrounds', $request->file('background')->getClientOriginalName());
            $backgroundUrl = asset(Storage::url($path));
        } else {
            $backgroundUrl = $request->backgroundUrl;
        }


        $user = $request->user();
        $user->backgroundImagePath = $backgroundUrl;
        $user->save();
        return response()->json([
            'message' => 'Background changed',
            'url' => $backgroundUrl
        ]);
    }

    /**
     * Change l'avatar d'un utilisateur
     * 
     * @return JsonResponse un message de confirmation
     */
    public function editAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'image',
            'avatarUrl' => 'url|max:2048'
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->storeAs('public/avatars', $request->file('avatar')->getClientOriginalName());
            $avatarUrl = asset(Storage::url($path));
        } else {
            $avatarUrl = $request->avatarUrl;
        }

        $user = $request->user();
        $user->avatarImagePath = $avatarUrl;
        $user->save();
        return response()->json([
            'message' => 'Avatar changed',
            'url' => $avatarUrl
        ]);
    }

    /**
     * Change la variable privé d'un uilisateur
     * 
     * @return JsonResponse un message de confirmation
     */
    public function editPrivacy(Request $request)
    {
        $request->validate([
            'privacy' => 'required|boolean'
        ]);

        $user = $request->user();
        $role_name = Role::where('id', $user->role_id)->first()->name;

        if ($role_name != Role::ETUDIANT) {
            return response()->json([
                'message' => 'You are not a student',
                'role' => $user->role_name
            ]);
        }

        $user->privacy = $request->privacy;
        $user->save();
        return response()->json([
            'message' => 'Privacy changed',
            'privacy' => $user->privacy
        ]);
    }

    /**
     * Retourne tous les badges d'un utilisateur
     * 
     * @param $request 
     * @return JsonResponse tout les badges de l'utilisateur actif
     */
    public function getMyBadges(Request $request)
    {
        return $this->getUserBadges($request->user()->id);
    }

    /**
     * Retourne tous les badges d'un utilisateur
     * 
     * @param $request 
     * @return JsonResponse tout les badges de l'utilisateur actif
     */
    public function getMyNewBadges(Request $request)
    {
        $userBadges = UserBadge::where('user_id', $request->user()->id)->where('is_new', true)->get();
        return Badge::whereIn('id', $userBadges->pluck('badge_id'))->get();
    }

    /**
     * Notifie le système que l'utilisateur a vu certains badges
     * 
     * @param $request 
     * @return JsonResponse tout les badges de l'utilisateur actif
     */
    public function notifyHasSeenBadges(Request $request)
    {
        $request->validate([
            'ids' => 'required|array'
        ]);

        UserBadge::whereIn('badge_id', $request->ids)->where('user_id', $request->user()->id)->update([
            'is_new' => false
        ]);

        return response()->json(['message' => 'Les badges ont bien été marqués comme vus']);
    }

    /**
     * Retourne les utilisateurs ayant un role.
     * 
     * @param int $id Id du role
     * @return \Illuminate\Http\Response
     */
    public function getAllByRole(int $id)
    {
        $users = User::where('role_id', $id)->get();
        return response()->json(['users' => $users]);
    }

    /**
     * Supprime un utilisateur
     * 
     * @param int $id Id de l'utilisateur
     * @return \Illuminate\Http\Response
     */
    public function supprimerUser(int $id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    /**
     * Assigne le rôle d'admin à un utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function assignAdmin(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
        ]);

        $user = User::find($request->user_id);
        $adminRole = Role::Admin(); // Récupère l'objet Role correspondant à "Administrateur"

        if (!$adminRole) {
            return response()->json(['message' => 'Le rôle Administrateur est introuvable.'], 500);
        }

        if ($user->role_id == $adminRole->id) {
            return response()->json(['message' => 'Cet utilisateur est déjà administrateur.'], 400);
        }

        // Met à jour le rôle avec l'ID du rôle Administrateur
        $user->role_id = $adminRole->id;
        $user->save();

        return response()->json(['message' => 'Utilisateur promu administrateur.']);
    }

    /**
     * Assigne le rôle d'admin contact à un administrateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function assignAdminContact(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
        ]);

        $user = User::find($request->user_id);
        $adminContactRole = Role::AdminContact(); // Récupère l'objet Role correspondant à "Administrateur Contact"

        if (!$adminContactRole) {
            return response()->json(['message' => 'Le rôle Administrateur Contact est introuvable.'], 500);
        }

        if ($user->role_id == $adminContactRole->id) {
            return response()->json(['message' => 'Cet utilisateur est déjà une personne de contact administrateur.'], 400);
        }

        // Rétrograder l'ancien Administrateur Contact en simple Administrateur
        $ancienAdminContact = User::where('role_id', $adminContactRole->id)->first();

        if ($ancienAdminContact) {
            $ancienAdminContact->role_id = Role::Admin()->id;
            $ancienAdminContact->save();
        }

        // Met à jour le rôle avec l'ID du rôle Administrateur Contact
        $user->role_id = $adminContactRole->id;
        $user->save();

        return response()->json(['message' => 'Utilisateur promu administrateur.']);
    }

    public function removeAdmin(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
        ]);

        $user = User::find($request->user_id);
        $defaultRole = Role::where('name', 'Étudiant')->first(); // Par défaut, remet en étudiant

        if (!$defaultRole) {
            return response()->json(['message' => 'Le rôle Étudiant est introuvable.'], 500);
        }

        if ($user->role_id != Role::Admin()->id) {
            return response()->json(['message' => 'Cet utilisateur n\'est pas administrateur.'], 400);
        }

        $user->role_id = $defaultRole->id;
        $user->save();

        return response()->json(['message' => 'Administrateur rétrogradé avec succès.']);
    }

    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:6'
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }

    /**
     * Modification de mot de passe d'un utilisateur pour son propre compte
     * @param Request $request
     * @return Jsonresponse Réponse de l'état de réussite de la modification
     * @author Vincent Houle
     */
    public function modifyPassword(UserConfirmPasswordRequest $request)
    {

        $user = User::find($request->id);
        $password = $user->password;

        // Vérifie si l'ancien mot de passe est le bon
        if (Hash::check($request->oldPassword, $password)) {
            // Vérifie si le nouveau mot de passe est différent de l'ancien
            if (!Hash::check($request->newPassword, $password)) {

                $newPassword = Hash::make($request->newPassword);
                $user->password = $newPassword;
                $user->save();
                return response()->json(['sucess' => 'Votre mot de passe a été mis à jour.']);
            } else {
                return response()->json(['errorNewPassword' => 'Votre nouveau mot de passe est identique à votre ancien.']);
            }
        } else {
            return response()->json(['errorOldPassword' => 'Votre ancien mot de passe est incorrecte.']);
        }
    }

    /**
     * Renvoie tous les utilisateur ayant un certain status d'activation
     * @param Request $request
     */
    public function getUsersByActiveStatus($status)
    {
        $users = User::where('active', $status)->get();

        return response()->json(['users' => $users]);
    }

    /**
     * Change la valeur d'activation d'un compte
     * @param Request $request
     */
    public function toggleActiveStatus($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->active = $user->active ? 0 : 1;
        $user->save();

        return response()->json(['message' => 'Statut mis à jour avec succès.']);
    }

    
}
