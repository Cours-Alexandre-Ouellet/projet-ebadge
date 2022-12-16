<?php

namespace App\Http\Requests\Badge;

use Illuminate\Foundation\Http\FormRequest;

class BadgeUdpateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'required|exists:badge,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'imagePath' => 'required|string',
            'color' => 'required|string|min:6|max:6',
        ];
    }
}
