<?php

namespace Tests\Feature;

use App\Models\Badge;
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

    private $user;
    private $teacher;
    private $admin;
    private $badge;
    private $teacherToken;

    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->admin = User::factory()->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();


        $this->teacher = User::factory()->create();
        $this->teacher->role_id = Role::Teacher()->id;
        $this->teacher->save();

        $this->badge = Badge::factory()->create();
        $this->badge->save();

        $token = $this->teacher->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->teacherToken = $token->accessToken;
    }

    /**
     * Créer un badge sans certain champs obligatoire
     */
    public function testCreateBadgeWithoutRequiredFields(): void
    {
        $response = $this->post(
            '/api/badge',
            [
                'title' => $this->badge->title,
                'description' => $this->badge->description,
            ],
            ['Authorization' => 'Bearer ' . $this->teacherToken],
        );

        $response->assertStatus(422);
    }

    /**
     * Créer un badge avec tous les champs obligatoires
     */
    public function testCreateBadgeWithRequiredFields(): void
    {
        $response = $this->post('/api/badge', [
            'title' => $this->badge->title,
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
    }

    /**
     * ○Scénario 2 : Suppression d’un badge alors qu’il est lié à des étudiants
     */
    public function testDeleteBadge(): void
    {
        $response = $this->delete(
            '/api/badge/' . $this->badge->id,
            [],
            ['Authorization' => 'Bearer ' . $this->teacherToken]
        );

        $response->assertStatus(200);

        $this->assertDatabaseMissing('badge', [
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

        $response->assertStatus(422);


        //check if the badge has not been updated
        $this->assertDatabaseHas('badge', [
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
     * Modfiier un badge avec tous les champs obligatoires
     */
    public function testUpdateBadgeWithRequiredFields(): void
    {
        $response = $this->put('/api/badge', [
            "id" => $this->badge->id,
            "title" => $this->badge->title . "test",
            "description" => $this->badge->description,
            "imagePath" => $this->badge->imagePath,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);

        //check if the badge has been updated
        $this->assertDatabaseHas('badge', [
            'id' => $this->badge->id,
            'title' => $this->badge->title . "test",
        ]);
    }
}
