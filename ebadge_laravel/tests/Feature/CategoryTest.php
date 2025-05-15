<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use Carbon\Carbon;
use App\Models\User;


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

        $this->category = Category::factory()->create();

        $this->badge = Badge::factory()->create();

        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->adminToken = $token->accessToken;
        
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
}
