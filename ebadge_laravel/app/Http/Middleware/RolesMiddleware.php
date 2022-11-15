<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Support\Facades\Log;

class RolesMiddleware
{
    /**
     * Handle an incoming request.
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
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
