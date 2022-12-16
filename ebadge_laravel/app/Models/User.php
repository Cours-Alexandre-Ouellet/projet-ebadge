<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

/**
 * Classe représentant un utilisateur
 */
class User extends Authenticatable
{
    use HasApiTokens; //Pour l'authentification par token


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user';

    public $timestamps = true;

    /**
     * Obtiens le nom du role de l'utilisateur
     *
     * @return string Le nom du role
     */
    public function getRoleName()
    {
        $role = Role::where('id', $this->role_id)->first();

        if ($role != null) {
            return $role->name;
        }
        return "";
    }

    /**
     * Détermine si l'utilisateur a un role donné
     *
     * @param string $role Le role à vérifier
     *
     * @return true si l'utilisateur a le role donné, false sinon
     */
    public function hasRole(string $role)
    {
        return $this->getRoleName() == $role;
    }

    /**
     * Relation entre l'utilisateur et ses badges
     *
     * @return BelongsToMany les badges de l'utilisateur
     */
    public function badges()
    {
        return $this->belongsToMany('App\Models\Badge', 'user_badge', 'user_id', 'badge_id')->withTimestamps();
    }

    public static function factory()
    {
        $faker = \Faker\Factory::create('fr_FR');
        $passwordEncrypt = Hash::make($faker->password());
        return User::create([
            'first_name' => $faker->firstName(),
            'last_name' => $faker->lastName(),
            'email' => $faker->email(),
            'password' => $passwordEncrypt,
            'role_id' => Role::Student()->id,
            'program_id' => Program::all()->random(),
            'privacy' => 0,
            'created_at' => $faker->dateTimeBetween('-1 years', 'now'),
            'updated_at' => $faker->dateTimeBetween('-1 years', 'now'),
        ]);
    }
}
