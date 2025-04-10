<?php

namespace App\Http\Requests\Badge;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête de mise à jour du favoritisme d'un badge
 */
class BadgeUpdateFavoriteRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'badge_id' => 'required|exists:badge,id',
            'user_id' => 'required|exists:user,id',
            'favorite' => 'required|integer'
        ];
    }
}
