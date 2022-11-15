<?php

namespace App\Http\Middleware;

use Closure;

class JsonMiddleware
{
    /**
     * Ajoute le header Accept: application/json
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $request->headers->set("Accept", "application/json");

        return $next($request);
    }
}
