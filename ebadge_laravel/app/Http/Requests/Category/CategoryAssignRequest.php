<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête d'assignation d'un badge à une catégorie
 */
class CategoryAssignRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'badge_id' => 'nullable|exists:badge,id',
            'category_id' => 'nullable|exists:category,id',
        ];
    }
}
