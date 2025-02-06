<?php

namespace App\Http\Requests\Categorie;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategorieRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nom' => 'required|string|max:45',
        ];
    }
}
