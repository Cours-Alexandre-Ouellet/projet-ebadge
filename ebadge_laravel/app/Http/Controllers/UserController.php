<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Role;
use App\Models\Badge;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
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
                    // retourne tous les élèves de tous les groupes
                    $users = User::all();
                    return response()->json(['users' => $users]);
                    break;
                case Role::ENSEIGNANT:
                    // retourne tous les eleve du meme groupe que l'utilisateur
                    $users = User::where('program_id', $currentUser->program_id)->get();
                    return response()->json(['users' => $users]);
                    break;
                default:
                    return response()->json(['error' => 'Unauthorized'], 401);
                    break;
            }
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function show(int $id)
    {
        $user = User::find($id);
        $user->badges = UserBadge::where('user_id', $id)->get();
        return response()->json($user);
    }

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
        $user = User::find($id);

        if ($user == null) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $badges = $user->badges;

        foreach ($user->badges as $badge) {
            $badge->setPossessionPercentage();
        }

        return response()->json([
            'badges' => $badges
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
        $missingBadges = Badge::whereNotIn('id', $badges->pluck('id'))->get();
        return response()->json([
            'badges' => $missingBadges
        ]);
    }

    public function editBackground(Request $request)
    {
        $request->validate([
            'background' => 'image',
            'backgroundUrl' => 'url|max:2048'
        ]);

        if($request->hasFile('background')) {
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

    public function editAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'image',
            'avatarUrl' => 'url|max:2048'
        ]);

        if($request->hasFile('avatar')) {
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

    public function editPrivacy(Request $request)
    {
        $request->validate([
            'privacy' => 'required|boolean'
        ]);

        $user = $request->user();
        $user->privacy = $request->privacy;
        $user->save();
        return response()->json([
            'message' => 'Privacy changed',
            'privacy' => $user->privacy
        ]);
    }

    public function getMyBadges(Request $request)
    {
        return $this->getUserBadges($request->user()->id);
    }
}
