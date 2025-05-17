<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Support\Facades\Log;

/**
 * Middleware pour vérifier les rôles
 */
class RolesMiddleware
{
    /**
     * Vérifie si l'utilisateur a le rôle requis
     * Si l'utilisateur n'est pas connecté, on renvoie une erreur 500
     * Si l'utilisateur n'a pas le rôle requis, on renvoie une erreur 403
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if(!$user) {
            return response()->json([
                'message' => 'An error occurred'
            ], 500);
        }

        $role = Role::where('id', $user->role_id)->first();
        if ($role) {
            if (in_array($role->name, $roles)) {
                return $next($request);
            }
        }
        return response()->json(['message' => 'Unauthorized'], 403);

    }
}
