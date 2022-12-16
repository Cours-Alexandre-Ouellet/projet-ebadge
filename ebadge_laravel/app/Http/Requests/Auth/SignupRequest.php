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
            'username' => 'required|string|unique:user,username',
            'email' => 'required|string|email|unique:user,email',
            'password' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'teacher_code' => [
                'string',
                Rule::exists('teacher_code', 'code')->where(function ($query) {
                    $query->whereNull('user_id');
                })
            ],
            'organisation_id' => [
                'required',
                'integer',
                Rule::exists('organisation', 'id')
            ],
            'program_id' => [
                'required',
                'integer',
                Rule::exists('program', 'id')
            ],
        ];
    }
}
