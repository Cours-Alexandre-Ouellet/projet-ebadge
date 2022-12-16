<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StatTest extends TestCase
{
    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->user = factory(\App\Models\User::class)->create();
        $this->badge = factory(\App\Models\Badge::class)->create();

        $this->roleStudent = factory(\App\Models\Role::class)->create([
            'name' => 'Étudiant',
        ]);

        $this->student = factory(\App\Models\User::class)->create(
            [
                'role_id' => $this->roleStudent->id,
                'is_private' => false,
            ]
        );
    }

    /**
     * ○Scénario 1 : Affichage du classement des étudiants
     */
    public function testLeaderboard(){
        $response = $this->get('/api/stats/leaderboard');
        $response->assertStatus(200);
    }
    /**
     * Le leader board n'affiche pas les étudiant qui sont privé
     */
    public function testLeaderboardPrivate(){
        $response = $this->get('/api/stats/leaderboard');
        $response->assertStatus(200);

        // verifie que l'usager
    }

}
