<?php

namespace App\Http\Requests\TeacherCode;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête d'assignation d'un code enseignant
 */
class TeacherCodeAssignRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id' => 'nullable|exists:user,id',
            'teacher_code_id' => 'nullable|exists:teacher_code,id',
        ];
    }
}
