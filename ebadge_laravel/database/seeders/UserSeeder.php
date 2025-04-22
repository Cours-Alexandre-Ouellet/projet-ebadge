<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user')->insert([
            [
                'first_name' => 'Etudiant',
                'last_name' => 'Test',
                'username' => 'EtudiantTest',
                'email' => 'etudiant@test.com',
                'password' => Hash::make('etudiant'), 
                'role_id' => Role::Student()->id, 
                'privacy' => 0,
                'active' => 1,
                'avatarImagePath' => null,
                'backgroundImagePath' => null,
                'organisation_id' => 0, 
                'program_id' => 0, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'first_name' => 'Professeur',
                'last_name' => 'Test',
                'username' => 'ProfesseurTest',
                'email' => 'professeur@test.com',
                'password' => Hash::make('professeur'), 
                'role_id' => Role::Teacher()->id, 
                'privacy' => 0,
                'active' => 1,
                'avatarImagePath' => null,
                'backgroundImagePath' => null,
                'organisation_id' => 0, 
                'program_id' => 0, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'first_name' => 'Admin',
                'last_name' => 'Test',
                'username' => 'AdminTest',
                'email' => 'admin@test.com',
                'password' => Hash::make('admin'), 
                'role_id' => Role::AdminContact()->id, 
                'privacy' => 0,
                'active' => 1,
                'avatarImagePath' => null,
                'backgroundImagePath' => null,
                'organisation_id' => 0, 
                'program_id' => 0, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
