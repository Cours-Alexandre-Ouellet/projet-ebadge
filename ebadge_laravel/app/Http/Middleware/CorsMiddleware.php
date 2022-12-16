<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    /**
     * Ajoute les headers nécessaires pour permettre les requêtes cross-origin
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request)->header('Access-Control-Allow-Origin', '*')->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
