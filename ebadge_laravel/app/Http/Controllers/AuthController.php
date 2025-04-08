<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\SignupRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Organisation;
use App\Models\Program;
use App\Models\Role;
use App\Models\TeacherCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Laravel\Passport\PersonalAccessTokenResult;

/**
 * Controller pour l'authentification
 */
class AuthController extends Controller
{
    /**
     * Enregistre un nouvel utilisateur
     * Si le code d'enseignant est fourni, l'utilisateur est créé comme enseignant
     * Sinon, l'utilisateur est créé comme élève
     *
     * @param SignupRequest $request
     * @return JsonResponse le nouvel utilisateur et le token d'authentification
     */
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

            $user->role_id = Role::Teacher()->id;
            $user->save();
        }

        $acessToken = $this->createToken($user);

        return response()->json(['user' => $user, 'access_token' => $acessToken->accessToken], 201);
    }

    /**
     * Connecte un utilisateur et créé un token d'authentification
     *
     * @param LoginRequest $request
     * @return JsonResponse le token d'authentification
     */
    public function login(LoginRequest $request)
    {
        $credentials = request(['email', 'password']);
        if (!Auth::attempt($credentials))
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        $user = $request->user();
        $tokenResult = $this->createToken($user);
        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'username' => $user->username,
            'role' => Role::where('id', $user->role_id)->first()->name,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString()
        ]);
    }

    /**
     * Obtiens les informations de l'utilisateur connecté
     *
     * @param Request $request
     * @return JsonResponse les informations de l'utilisateur connecté
     */
    public function currentUser(Request $request)
    {
        $user = $request->user();
        $user->program_name = Program::where('id', $user->program_id)->first()->name;
        $user->role_name = Role::where('id', $user->role_id)->first()->name;
        $user->organisation_name = Organisation::where('id', $user->organisation_id)->first()->name;

        return response()->json([
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'username' => $user->username,
            'role_id' => $user->role_id,
            'privacy' => $user->privacy,
            'avatarImagePath' => $user->avatarImagePath,
            'backgroundImagePath' => $user->backgroundImagePath,
        ]);
    }

    /**
     * Déconnecte l'utilisateur connecté
     *
     * @param Request $request
     * @return JsonResponse un message de succès
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Créer un nouvel utilisateur
     * @param SignupRequest $request
     * @return User|null
     */
    private function createUser(SignupRequest $request): User
    {
        $user = new User();
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->role_id = Role::where('name', Role::ETUDIANT)->first()->id;
        $user->organisation_id = 0; // TODO: Possiblement annihiler complètement
        $user->program_id = 0; // TODO: Possiblement annihiler complètement
        return $user->save() ? $user : null;
    }

    /**
     * Créer un token d'authentification pour l'utilisateur donné
     *
     * @param User $user
     * @return PersonalAccessTokenResult
     */
    private function createToken(User $user): PersonalAccessTokenResult
    {
        $token = $user->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        return $token;
    }
}
