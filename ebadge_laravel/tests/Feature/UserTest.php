<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models;

class UserTest extends TestCase
{
    public function __construct()
    {
        parent::__construct();
        $this->user =  \App\Models\User::factory()->create();
        $this->teacher = \App\Models\User::factory()->create([
            'role_id' => 2
        ]);

        $this->student = \App\Models\User::factory()->create([
            'role_id' => 3
        ]);

        $this->badge = \App\Models\Badge::factory()->create();
    }

    /**
     * Doit retourner une erreur lorsqu'on essais d'assigner un badge
     * à un enseignant
     */
    public function testAssignBadgeToTeacher()
    {
        $response = $this->post('/user/assign-badge', [
            'badge_id' => 1,
            'user_id' => 1
        ]);

        $response->assertStatus(400);
    }

    /**
     * Ajouter un badge à un étudiant doit retourner un code 200
     */
    public function testAssignBadgeToStudent()
    {
        $response = $this->post('/user/assign-badge', [
            'badge_id' => 1,
            'user_id' => 2
        ]);

        $response->assertStatus(200);
    }

    /**
     * Ajouter un badge inexistant à un étudiant doit retourner un code 400
     */
    public function testAssignNonExistingBadgeToStudent()
    {
        $response = $this->post('/user/assign-badge', [
            'badge_id' => 999,
            'user_id' => 2
        ]);

        $response->assertStatus(400);
    }

    /**
     * Retirer un badge à un étudiant doit retourner un code 200
     */
    public function testRemoveBadgeFromStudent()
    {
        $response = $this->post('/user/remove-badge', [
            'badge_id' => 1,
            'user_id' => 2
        ]);

        $response->assertStatus(200);
    }

    /**
     *  Retirer un badge à un étudiant qui ne l’a pas doit retourner un code 400
     */
    public function testRemoveNonExistingBadgeFromStudent()
    {
        $response = $this->post('/user/remove-badge', [
            'badge_id' => 999,
            'user_id' => 2
        ]);

        $response->assertStatus(400);
    }

    /**
     * Récupéré un usager retourne bien tous les champs visibles de l’usager
     *
     */
    public function testGetUser()
    {
        $response = $this->get('/api/users/2');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'name',
            'email',
            'role_id',
            'privacy',
            'badges'
        ]);
    }
}
