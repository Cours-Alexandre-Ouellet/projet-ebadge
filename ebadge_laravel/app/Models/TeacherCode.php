<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class TeacherCode extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'teacher_code';

    public $timestamps = false;

    public function generateCode()
    {
        $code = Str::random(6);
        $this->code = $code;
        $this->save();
        return $code;
    }
}
