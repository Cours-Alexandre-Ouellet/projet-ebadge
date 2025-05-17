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
            'id' => 'required|exists:category,id',
            'name' => 'sometimes|required|string|max:255',
            'color' => ['sometimes', 'required', function ($attribute, $value, $fail) {
                if (!preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $value)) {
                    $fail('Le format de la couleur est invalide. Utilisez le format hexadécimal (#RGB ou #RRGGBB).');
                }
            }],
        ];
    }
}
