<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use Carbon\Carbon;


class StatTest extends TestCase
{
    use RefreshDatabase;
    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->admin = factory(\App\Models\User::class)->create();
        $this->students = factory(\App\Models\User::class, 5)->create();
        $this->students->each(function ($student) {
            $student->save();
        });


        $this->roleAdmin = factory(\App\Models\Role::class)->create();
        $this->roleAdmin->name = 'Administrateur';
        $this->roleAdmin->save();

        $this->roleStudent = factory(\App\Models\Role::class)->create();
        $this->roleStudent->name = 'Étudiant';
        $this->roleStudent->save();

        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();


        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->adminToken = $token->accessToken;


        $this->badges = factory(\App\Models\Badge::class, 5)->create();
        $this->badges->each(function ($badge) {
            $badge->save();

            $this->students->each(function ($student) use ($badge) {
                $student->badges()->attach($badge->id);
                $student->save();
            });
        });
    }

    /**
     * ○Scénario 1 : Affichage du classement des étudiants
     */
    public function testLeaderboard(){
        $response = $this->get('/api/stats/leaderboard', ['Authorization' => 'Bearer ' . $this->adminToken]);
        $response->assertStatus(200);
    }
    /**
     * Le leader board n'affiche pas les étudiant qui sont privé
     */
    public function testLeaderboardPrivate(){

        $this->students->each(function ($student) {
            $student->privacy = 0;
            $student->save();
        });

        $response = $this->get('/api/stats/leaderboard', ['Authorization' => 'Bearer ' . $this->adminToken]);
        $response->assertStatus(200);
    }

    /**
     * Le leader board n'affiche pas les étudiant qui sont pas privée
     */
    public function testLeaderboardPublic(){

        $this->students->each(function ($student) {
            $student->privacy = 1;
            $student->save();
        });

        $response = $this->get('/api/stats/leaderboard', ['Authorization' => 'Bearer ' . $this->adminToken]);
        $response->assertStatus(200);
    }
}
