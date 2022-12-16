<?php

namespace App\Http\Requests\Badge;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête de mise à jour d'un badge
 */
class BadgeUdpateRequest extends FormRequest
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
            'title' => 'required|string|unique:badge,title',
            'description' => 'required|string',
            'imagePath' => 'required|string',
            'color' => 'required|string|min:6|max:6',
        ];
    }
}
