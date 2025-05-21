<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Symfony\Component\ErrorHandler\Debug;

class BadgeTest extends TestCase
{
    use DatabaseTransactions;

    private $user;
    private $teacher;
    private $category;
    private $student;
    private $badge;
    private $teacherToken;
    private $userToken;

    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->create();
        $this->teacher->role_id = Role::Teacher()->id;
        $this->teacher->save();

        
        $this->user = User::factory()->create();
        $this->user->role_id = Role::Student()->id;
        $this->user->save();

        $token = $this->user->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->userToken = $token->accessToken;


        $this->category = Category::factory()->create();
        $this->category->save();

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
            'title' => $this->badge->title . "creer",
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
            'category_id' => $this->category->id,
            'category_name' => $this->category->name,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
        
        // Si le badge a été modifié
        $this->assertDatabaseHas('badge', [
            'title' => $this->badge->title . "creer",
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
        ]);


        $idTemp = Badge::where(['title' => $this->badge->title . "creer", 'description' => $this->badge->description])->first()->id;

        // Si le lien avec le badge et la catégorie existe
        $this->assertDatabaseHas('category_badge', [
            'badge_id' => $idTemp,
            'category_id' =>$this->category->id
        ]);
    }

    /**
     * Créer un badge en tant qu'étudiant
     */
    public function testCreateBadgeWrongRole(): void
    {
        $response = $this->post('/api/badge', [
            'title' => $this->badge->title . "creer",
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
            'category_id' => $this->category->id,
            'category_name' => $this->category->name,
        ], ['Authorization' => 'Bearer ' . $this->userToken]);

        // Utilisateur non autorisé
        $response->assertStatus(403);
        
    }

    /**
     * Modification d’un badge sans certains champs obligatoires
     */
    public function testUpdateBadgeWithoutRequiredFields(): void
    {
        $response = $this->post('/api/badge/image', [
            "id" => $this->badge->id,
            'title' => $this->badge->title . "test",
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(422);
        
        // Si le badge n'a pas été modifié.
        $this->assertDatabaseHas('badge', [
            'id' => $this->badge->id,
            'title' => $this->badge->title,
        ]);
    }

    /**
     * Modfiier un badge avec tous les champs obligatoires
     */
    public function testUpdateBadgeWithRequiredFields(): void
    {
        $response = $this->post('/api/badge/image', [
            "id" => $this->badge->id,
            "title" => $this->badge->title . "test",
            "description" => $this->badge->description,
            "imagePath" => $this->badge->imagePath,
            "category_id" => 0,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);

        // Si le badge a été modifié.
        $this->assertDatabaseHas('badge', [
            'title' => $this->badge->title . "test",
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
        ]);

        // Si le lien entre le badge et la catégorie n'existe plus
        $this->assertDatabaseMissing('category_badge', [
            "badge_id" => $this->badge->id,
            'category_id' =>$this->category->id
        ]);
    }

    /**
     * Récupérer un badge retourne bien tous les champs visibles du badge
     */
    public function testGetBadge(): void
    {
        $response = $this->get('/api/badge', ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
    }

    /**
     * Récupérer tous les badges avec les catégories
     */
    public function testGetBadgesWithCategory(): void
    {
        $response = $this->get('/api/badge/category/names', ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
    }

    /**
     * Suppression d’un badge alors qu’il est lié à des étudiants
     */
    public function testDeleteBadge(): void
    {
        $response = $this->delete(
            '/api/badge/' . $this->badge->id,
            ['Authorization' => 'Bearer ' . $this->teacherToken]
        );

        $response->assertStatus(200);

        // Si le badge a été supprimé.
        $this->assertDatabaseMissing('badge', [
            'id' => $this->badge->id,
        ]);
    }
}
