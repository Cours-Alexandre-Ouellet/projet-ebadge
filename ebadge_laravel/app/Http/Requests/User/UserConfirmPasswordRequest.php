<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UserConfirmPasswordRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            "id" => 'required|exists:user,id',
            "oldPassword" => 'required|string',
            "newPassword" => 'required|string|max:60|min:6'
        ];
    }
}
