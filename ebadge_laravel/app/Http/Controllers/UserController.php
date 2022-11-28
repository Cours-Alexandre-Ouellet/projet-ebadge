<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        // return all user as json
        return response()->json($users);
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

    public function editBackground(Request $request)
    {
        $request->validate([
            'background' => 'image',
            'backgroundUrl' => 'url'
        ]);

        if($request->hasFile('background')) {
            $path = $request->file('background')->storeAs('public/backgrounds', $request->file('background')->getClientOriginalName());
            $backgroundUrl = Storage::url($path);
        } else {
            $backgroundUrl = $request->backgroundUrl;
        }

        $path = $request->file('background')->storeAs('public/background', $request->file('image')->getClientOriginalName());

        $user = $request->user();
        $user->background = $backgroundUrl;
        $user->save();
        return response()->json([
            'message' => 'Background changed'
        ]);
    }

    public function editAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'image',
            'avatarUrl' => 'url'
        ]);

        if($request->hasFile('avatar')) {
            $path = $request->file('avatar')->storeAs('public/avatars', $request->file('avatar')->getClientOriginalName());
            $avatarUrl = Storage::url($path);
        } else {
            $avatarUrl = $request->avatarUrl;
        }

        $user = $request->user();
        $user->avatar = $avatarUrl;
        $user->save();
        return response()->json([
            'message' => 'Avatar changed'
        ]);
    }
}
