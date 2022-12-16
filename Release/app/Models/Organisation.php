<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Classe représentant une organisation
 * Par exemple : un cégep, une école, un collège, etc.
 */
class Organisation extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'organisation';

    protected $fillable = [
        'name',
    ];
}
