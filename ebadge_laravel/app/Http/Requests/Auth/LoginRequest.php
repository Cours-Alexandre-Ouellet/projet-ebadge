<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête de connexion
 */
class LoginRequest extends FormRequest
{
    /**
     * les règles de validation
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ];
    }
}
