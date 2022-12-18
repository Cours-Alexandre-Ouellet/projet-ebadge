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
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:255',
            'imagePath' => 'string|max:2048',
            'image' => 'image',
            'color' => 'required|string|min:6|max:8',
        ];
    }
}
