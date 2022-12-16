<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

/**
 * Classe représentant un code d'enseignant
 * Les codes d'enseignant sont générés par l'administrateur et utilisés par les enseignants pour s'inscrire
 */
class TeacherCode extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'teacher_code';

    public $timestamps = false;

    /**
     * Génère un code d'enseignant aléatoire de 6 caractères et le sauvegarde dans la base de données
     * @return string le code
     */
    public function generateCode()
    {
        $code = Str::random(6);
        $this->code = $code;
        $this->save();
        return $code;
    }
}
