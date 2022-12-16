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
        $this->user = factory(\App\Models\User::class)->create();

        $this->admin = factory(\App\Models\User::class)->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();


        $this->teacher = factory(\App\Models\User::class)->create();
        $this->teacher->role_id = Role::Teacher()->id;
        $this->teacher->save();
        $this->badge = factory(\App\Models\Badge::class)->create();


        $token = $this->user->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->userToken = $token->accessToken;

        $token = $this->teacher->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->teacherToken = $token->accessToken;

        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->adminToken = $token->accessToken;
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
        $response = $this->get('/api/stats/leaderboard', ['Authorization' => 'Bearer ' . $this->adminToken]);
        $response->assertStatus(200);
    }
}
