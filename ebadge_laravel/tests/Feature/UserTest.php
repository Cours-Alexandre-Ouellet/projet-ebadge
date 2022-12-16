<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Artisan;
use PDO;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Get users return 200
     */
    public function testGetUsers()
    {
        $response = $this->get('/api/user');

        $response->assertStatus(200);
    }



    /**
     * Doit retourner une erreur lorsqu'on essais d'assigner un badge
     * à un enseignant
     */
    public function testAssignBadgeToTeacher()
    {
        $response = $this->post('/api/user/assign-badge', [
            'badge_id' => $this->badge->id,
            'user_id' => $this->user->id
        ]);

        //print response data
        $response->dump();

        $response->assertStatus(400);
    }

    /**
     * Ajouter un badge à un étudiant doit retourner un code 200
     */
    public function testAssignBadgeToStudent()
    {
        $response = $this->post('/api/user/assign-badge', [
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
        $response = $this->post('/api/user/assign-badge', [
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
        $response = $this->post('/api/user/remove-badge', [
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
        $response = $this->post('/api/user/remove-badge', [
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
