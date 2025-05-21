<?php

namespace App\Models;

use Database\Factories\OrganisationFactory as FactoriesOrganisationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * Classe représentant une organisation
 * Par exemple : un cégep, une école, un collège, etc.
 */
class Organisation extends Model
{    
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'organisation';

    protected $fillable = [
        'name',
    ];

    /**
     * Créer une nouvelle instance à la factory
     */
    protected static function newFactory()
    {
        return FactoriesOrganisationFactory::new();
    }
}
