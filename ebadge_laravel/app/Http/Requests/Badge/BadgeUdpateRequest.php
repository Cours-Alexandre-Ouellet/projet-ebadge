<?php

namespace App\Http\Requests\Badge;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête de mise à jour d'un badge
 */
class BadgeUpdateRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'required|exists:badge,id',
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:255',
            'imagePath' => 'required|string|max:2048',
            'color' => 'required|string|min:6|max:6',
        ];
    }
}
