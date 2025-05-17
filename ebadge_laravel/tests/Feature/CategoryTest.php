<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use Carbon\Carbon;
use App\Models\User;

/**
 * Classe de test pour la gestion des catégories
 * 
 * @author: Alexandre del Fabbro
 * Code inspiré de projet E-Badge
 * Code inspiré de Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 16 mai 2025]
 */
class CategoryTest extends TestCase
{
    use DatabaseTransactions;

    private $user;
    private $teacher;
    private $admin;
    private $category;
    private $student;
    private $badge;
    private $adminToken;

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

        $this->student = User::factory()->create();
        $this->student->role_id = Role::Student()->id;
        $this->student->save();

        $this->category = Category::factory()->create();

        $this->badge = Badge::factory()->create();

        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->adminToken = $token->accessToken;

        $token = $this->teacher->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->teacherToken = $token->accessToken;

        $token = $this->student->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->studentToken = $token->accessToken;
        
    }

     /**
     * Créer une catégorie avec tous les champs obligatoires
     */
    public function testCreateCategoryWithRequiredFields(): void
    {
        $response = $this->post('/api/category', [
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);
        
        // Si la catégorie a été modifiée
        $this->assertDatabaseHas('category', [
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ]);


        $idTemp = Category::where(['name' => $this->category->name . "test", 'color' => $this->category->color])->first()->id;
    }

    /**
     * Créer une catégorie sans champ 'name' obligatoire
     */
    public function testCreateCategoryWithRequiredFieldsWithoutName(): void
    {
        $response = $this->post('/api/category', [
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(422);
    }

    /**
     * Créer une catégorie sans champ 'color' obligatoire
     */
    public function testCreateCategoryWithRequiredFieldsWithoutColor(): void
    {
        $response = $this->post('/api/category', [
            'name' => $this->category->name . "test",
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(422);
    }

    /**
     * Créer une catégorie sans champ 'name' et 'color' obligatoire
     */
    public function testCreateCategoryWithRequiredFieldsWithoutNameAndColor(): void
    {
        $response = $this->post('/api/category', [
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(422);
    }

    /**
     * Créer une catégorie avec un nom trop long
     */
    public function testCreateCategoryWithNameTooLong(): void
    {
        $response = $this->post('/api/category', [
            'name' => str_repeat('a', 256),
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(422);
    }

    /**
     * Créer une catégorie avec un nom à la limite de la longueur
     */
    public function testCreateCategoryWithNameAtLimit(): void
    {
        $response = $this->post('/api/category', [
            'name' => str_repeat('a', 255),
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);
    }

    /**
     * Créer une catégorie avec une couleur non valide
     */
    public function testCreateCategoryWithInvalidColor(): void
    {
        $response = $this->post('/api/category', [
            'name' => $this->category->name . "test",
            'color' => 'invalid-color',
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(422);
    }

    /**
     * Créer une catégorie avec un utilisateur enseignant
     */
    public function testCreateCategoryWithTeacherUser(): void
    {
        $response = $this->post('/api/category', [
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(403);
    }

    /**
     * Créer une catégorie avec un utilisateur étudiant
     */
    public function testCreateCategoryWithStudentUser(): void
    {
        $response = $this->post('/api/category', [
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->studentToken]);

        $response->assertStatus(403);
    }

    /**
     * Créer une catégorie avec un utilisateur non authentifié
     */
    public function testCreateCategoryWithNonAuthenticatedUser(): void
    {
        $response = $this->post('/api/category', [
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ]);

        $response->assertStatus(401);
    }

    /**
     * Récupérer toutes les catégories
     */
    public function testGetAllCategories(): void
    {
        $response = $this->get('/api/category', ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'categories' => [
                '*' => [
                    'id',
                    'name',
                    'color',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }

    /**
     * Récupérer les badges d'une catégorie
     */
    public function testGetCategoryBadges(): void
    {
        $response = $this->get('/api/category/' . $this->category->id . '/badges', ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'badges' => [
                '*' => [
                    'id',
                    'title',
                    'description',
                    'imagePath',
                    'created_at',
                    'updated_at',
                ],
            ],
        ]);
    }

    /**
     * Mettre à jour une catégorie avec tous les champs obligatoires
     */
    public function testUpdateCategoryWithRequiredFields(): void
    {
        $newName = "Categorie mise à jour" . time();
        $newColor = "#FF5733";

        $response = $this->put('/api/category', [
            'id' => $this->category->id,
            'name' => $newName,
            'color' => $newColor,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertJsonFragment([
            'id' => $this->category->id,
            'name' => $newName,
            'color' => $newColor,
        ]);

        // Si la catégorie a été modifiée
        $this->assertDatabaseHas('category', [
            'id' => $this->category->id,
            'name' => $newName,
            'color' => $newColor,
        ]);
    }

    /**
     * Mettre à jour le nom d'une catégorie
     */
    public function testUpdateCategoryName(): void
    {
        $response = $this->put('/api/category', [
            'id' => $this->category->id,
            'name' => $this->category->name . "test",
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);
        
        $response->assertJson([
            'id' => $this->category->id,
            'name' => $this->category->name . "test",
        ]);
        
        // Si la catégorie a été modifiée
        $this->assertDatabaseHas('category', [
            'id' => $this->category->id,
            'name' => $this->category->name . "test",
        ]);
    }

    /**
     * Mettre à jour la couleur d'une catégorie
     */
    public function testUpdateCategoryColor(): void
    {
        $response = $this->put('/api/category', [
            'id' => $this->category->id,
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertJson([
            'id' => $this->category->id,
            'color' => $this->category->color,
        ]);
        
        // Si la catégorie a été modifiée
        $this->assertDatabaseHas('category', [
            'id' => $this->category->id,
            'color' => $this->category->color,
        ]);
    }

    /**
     * Mettre à jour une catégorie inexistante
     */
    public function testUpdateCategoryWithNonExistentId(): void
    {
        $response = $this->put('/api/category', [
            'id' => 99999,
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(422);
    }

    /**
     * Mettre à jour une catégorie avec un utilisateur enseignant
     */
    public function testUpdateCategoryWithNonAdminUser(): void
    {
        $response = $this->put('/api/category', [
            'id' => $this->category->id,
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(403);
    }

    /**
     * Mettre à jour une catégorie avec un utilisateur étudiant
     */
    public function testUpdateCategoryWithStudentUser(): void
    {
        $response = $this->put('/api/category', [
            'id' => $this->category->id,
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ], ['Authorization' => 'Bearer ' . $this->studentToken]);

        $response->assertStatus(403);
    }

    /**
     * Mettre à jour une catégorie avec un utilisateur non authentifié
     */
    public function testUpdateCategoryWithNonAuthenticatedUser(): void
    {
        $response = $this->put('/api/category', [
            'id' => $this->category->id,
            'name' => $this->category->name . "test",
            'color' => $this->category->color,
        ]);

        $response->assertStatus(401);
    }

    /**
    * Associer un badge à une catégorie
    */
    public function testAssignBadgeToCategory(): void
    {
        $response = $this->post('/api/category/assign-badge', [
            'category_id' => $this->category->id,
            'badge_id' => $this->badge->id
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);
    
        $response->assertStatus(200);

        $this->assertDatabaseHas('category_badge', [
            'category_id' => $this->category->id,
            'badge_id' => $this->badge->id
        ]);
    }

    /**
     * Dissocier un badge d'une catégorie
     */
    public function testRemoveBadgeFromCategory(): void
    {
        $this->badge->categories()->attach($this->category->id);

        $response = $this->post('/api/category/remove-badge', [
            'category_id' => $this->category->id,
            'badge_id' => $this->badge->id
        ], ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('category_badge', [
            'category_id' => $this->category->id,
            'badge_id' => $this->badge->id
        ]);
    }

    /**
     * Supprimer une catégorie existante
     */
    public function testDeleteCategory(): void
    {
        $response = $this->delete('/api/category/' . $this->category->id, [], 
            ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('category', [
            'id' => $this->category->id,
        ]);
    }

    /**
     * Tester la suppression en cascade d'une catégorie avec des badges associés
     */
    public function testCategoryCascadeDeletion(): void
    {
        $badges = Badge::factory()->count(3)->create();
        foreach ($badges as $badge) {
            $badge->categories()->attach($this->category->id);
        }

        foreach ($badges as $badge) {
            $this->assertDatabaseHas('category_badge', [
                'category_id' => $this->category->id,
                'badge_id' => $badge->id
            ]);
        }

        $response = $this->delete('/api/category/' . $this->category->id, [], 
            ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('category', [
            'id' => $this->category->id,
        ]);

        foreach ($badges as $badge) {
            $this->assertDatabaseMissing('category_badge', [
                'category_id' => $this->category->id,
                'badge_id' => $badge->id
            ]);
        }

        foreach ($badges as $badge) {
            $this->assertDatabaseHas('badge', [
                'id' => $badge->id
            ]);
        }
    }

    /**
     * Supprimer une catégorie inexistante
     */
    public function testDeleteCategoryWithNonExistentId(): void
    {
        $response = $this->delete('/api/category/99999', [], 
            ['Authorization' => 'Bearer ' . $this->adminToken]);

        $response->assertStatus(404);
    }

    /**
     * Supprimer une catégorie sans autorisation
     */
    public function testDeleteCategoryWithNonAdminUser(): void
    {
        $response = $this->delete('/api/category/' . $this->category->id, [], 
            ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(403);
    }


}
