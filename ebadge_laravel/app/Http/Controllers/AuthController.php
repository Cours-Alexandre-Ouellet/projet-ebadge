<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\SignupRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Organisation;
use App\Models\Program;
use App\Models\Role;
use App\Models\TeacherCode;
use App\Models\User;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;


class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $user = $this->createUser($request);
        if (!$user) {
            return response()->json([
                'message' => 'Something went wrong'
            ], 500);
        }

        if ($request->teacher_code) {
            $code = TeacherCode::where('code', $request->teacher_code)->first();
            $code->user_id = $user->id;
            $code->save();

            $user->role_id = Role::where('name', Role::ENSEIGNANT)->first()->id;
            $user->save();
        }
        return response()->json($user, 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = request(['email', 'password']);
        if (!Auth::attempt($credentials))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        $user = $request->user();
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;
        if ($request->remember_me)
            $token->expires_at = Carbon::now()->addWeeks(1);
        $token->save();
        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'username' => $user->username,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString()
        ]);
    }

    public function current_user(Request $request)
    {
        $user = $request->user();
        $user->program_name = Program::where('id', $user->program_id)->first()->name;
        $user->role_name = Role::where('id', $user->role_id)->first()->name;
        $user->organisation_name = Organisation::where('id', $user->organisation_id)->first()->name;
        $user->badges = $user->badges()->get();
        //foreach badge, get the possession
        foreach ($user->badges as $badge) {
            $badge->calculatePossession();
        }
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    private function createUser(SignupRequest $request): User
    {
        $user = new User();
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->organisation_id = $request->organisation_id;
        $user->program_id = $request->program_id;
        $user->role_id = Role::where('name', Role::ETUDIANT)->first()->id;
        return $user->save() ? $user : null;
    }
}
