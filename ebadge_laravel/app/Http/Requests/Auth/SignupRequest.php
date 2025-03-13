<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


/**
 * Objet représentant une requête d'inscription
 */
class SignupRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|string|unique:user,username|max:50',
            'email' => 'required|string|email|unique:user,email|max:125',
            'password' => 'required|string|max:60',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'teacher_code' => [
                'string',
                Rule::exists('teacher_code', 'code')->where(function ($query) {
                    $query->whereNull('user_id');
                })
            ],
        ];
    }
}
