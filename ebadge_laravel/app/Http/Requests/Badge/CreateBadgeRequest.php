<?php

namespace App\Http\Requests\Badge;

use Illuminate\Foundation\Http\FormRequest;

class CreateBadgeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string|unique:badge,title',
            'description' => 'required|string',
            'image' => 'required|image',
            'color' => 'required|string|min:6|max:6',
        ];
    }
}
