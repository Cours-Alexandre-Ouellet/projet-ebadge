<?php

namespace App\Http\Requests\Badge;

use Illuminate\Foundation\Http\FormRequest;

class CreateBadgeRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string',
            'description' => 'required|string',
            'imagePath' => 'string',
            'image' => 'image',
            'color' => 'required|string|min:6|max:8',
        ];
    }
}
