<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Objet représentant une requête de mise à jour d'une catégorie
 */
class CategoryUpdateRequest extends FormRequest
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
            'name' => 'required|string|max:45',
            'color' => 'required|string|max:7',
        ];
    }
}
