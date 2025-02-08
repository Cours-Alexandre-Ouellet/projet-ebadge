<?php

namespace Tests\Feature;

use App\Models\Badge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;


class StatTest extends TestCase
{

    private $admin;
    private $students;
    private $badges;
    private $adminToken;

    public function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create();
        $this->students = User::factory()->count(5)->create();

        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();


        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addMinutes(30);
        $token->token->save();
        $this->adminToken = $token->accessToken;


        $this->badges = Badge::factory()->count(5)->create();
        $this->badges->each(function ($badge) {
            $badge->save();

            $this->students->each(function ($student) use ($badge) {
                $student->badges()->attach($badge->id);
                $student->save();
            });
        });
    }

    /**
     * Scénario 1 : Affichage du classement des étudiants
     */
    public function testLeaderboard(){
        $response = $this->get('/api/stats/leaderboard', ['Authorization' => 'Bearer ' . $this->adminToken]);
        $response->assertStatus(200);
    }
}
