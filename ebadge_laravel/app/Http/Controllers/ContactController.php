<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;

/**
 * Contrôleur du contact
 */
class ContactController extends Controller
{
    /**
     * Retourne le contact administrateur du site web
     *
     * @return \Illuminate\Http\JsonResponse Le JSON de l'utilisateur
     */
    public function index()
    {
        $user = User::where('role_id', Role::AdminContact()->id)->first();

        return response()->json(empty($user) ? null : $user);
    }
}
