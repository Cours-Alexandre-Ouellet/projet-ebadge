<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use Carbon\Carbon;
use App\Models\User;


class BadgeTest extends TestCase
{
    use DatabaseTransactions;

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
        $this->badge->save();


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
     * Créer un badge sans certain champs obligatoire
     */
    public function testCreateBadgeWithoutRequiredFields(): void
    {
        $response = $this->post('/api/badge/create', ['Authorization' => 'Bearer ' . $this->teacherToken], [
            'title' => $this->badge->title,
            'description' => $this->badge->description,
        ]);

        $response->assertStatus(405);
    }

    /**
     * Créer un badge avec tous les champs obligatoires
     */
    public function testCreateBadgeWithRequiredFields(): void
    {
        $response = $this->post('/api/badge/create', [
            'title' => $this->badge->title,
            'description' => $this->badge->description,
            'image' => $this->badge->image,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
    }

    /**
     * ○Scénario 2 : Suppression d’un badge alors qu’il est lié à des étudiants
     */
    public function testDeleteBadge(): void
    {
        $response = $this->delete('/api/badge/' . $this->badge->id, ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('badges', [
            'id' => $this->badge->id,
        ]);
    }


    /**
     * ○Scénario 3 : Modification d’un badge sans certains champs obligatoires
     */
    public function testUpdateBadgeWithoutRequiredFields(): void
    {
        $response = $this->post('/api/badge', [
            "id" => $this->badge->id,
            "title" => $this->badge->title . "Test",
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(405);


        //check if the badge has not been updated
        $this->assertDatabaseHas('badges', [
            'id' => $this->badge->id,
            'title' => $this->badge->title,
        ]);
    }

    /**
     * ○Scénario 4 : Récupérer un badge retourne bien tous les champs visibles du badge
     */
    public function testGetBadge()
    {
        $response = $this->get('/api/badge', ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
    }

    /**
     * Il est impossible de récuperer tous les bagdes sans être connecté
     */
    public function testGetAllBadgesWithoutToken()
    {
        $response = $this->get('/api/badge');

        $response->assertStatus(401);

        $response->assertJson([
            'message' => 'Unauthenticated.',
        ]);
    }

    /**
     * Modfiier un badge avec tous les champs obligatoires
     */
    public function testUpdateBadgeWithRequiredFields(): void
    {
        $response = $this->post('/api/badge', [
            "id" => $this->badge->id,
            "title" => $this->badge->title . "test",
            "description" => $this->badge->description,
            "image" => $this->badge->image,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);

        //check if the badge has been updated
        $this->assertDatabaseHas('badges', [
            'id' => $this->badge->id,
            'title' => $this->badge->title . "test",
        ]);
    }
}
