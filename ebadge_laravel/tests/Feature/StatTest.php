<?php

namespace Tests\Feature;


use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use App\Models\User;
use App\Models\Category;
use App\Models\Badge;
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

    /**
     * Affichage du classement des étudiants par catégorie
     * @author: Elyas Benyssad
     */
    public function testLeaderboardByCategory()
    {
        // Crée une catégorie
        $category = Category::factory()->create();

        // Crée des badges et les lie à la catégorie via la table pivot
        $badges = \App\Models\Badge::factory()->count(3)->create();
        $badges->each(function ($badge) use ($category) {
            $badge->categories()->attach($category->id);
        });

        // Attribue les badges à chaque étudiant
        $badges->each(function ($badge) {
            $this->students->each(function ($student) use ($badge) {
                $student->badges()->attach($badge->id);
            });
        });

        // Appel API
        $response = $this->get('/api/stats/leaderboard/' . $category->id, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        // Vérifie la réponse
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id', 'first_name', 'last_name', 'badges_count']
        ]);
    }
    /**
     * Affichage du classement des étudiants par catégorie avec une catégorie invalide
     *  @author: Elyas Benyssad
     */

    public function testLeaderboardByCategoryWithInvalidCategory()
    {
        $invalidCategoryId = 999999; 

        $response = $this->get('/api/stats/leaderboard/' . $invalidCategoryId, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200); // API renvoie un tableau vide, pas une erreur
        $this->assertEmpty($response->json());
    }

    /**
     * Affichage du classement des étudiants par catégorie avec des étudiants inéligibles
     * @author: Elyas Benyssad
     */
    public function testLeaderboardByCategoryWithNoEligibleStudents()
    {
        // Rendre tous les étudiants inéligibles
        $this->students->each(function ($student) {
            $student->update(['privacy' => 1, 'active' => 0]);
        });

        $category = Category::factory()->create();

        $badge = Badge::factory()->create();
        $badge->categories()->attach($category->id);

        // Pas de badges assignés (même si valides)

        $response = $this->get('/api/stats/leaderboard/' . $category->id, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);
        $this->assertEmpty($response->json());
    }
    /**
     * Affichage du classement des étudiants par catégorie sans authentification
     *  @author: Elyas Benyssad
     */
    public function testLeaderboardByCategoryUnauthenticated()
    {
        $category = Category::factory()->create();

        $response = $this->get('/api/stats/leaderboard/' . $category->id);
        
        $response->assertStatus(401); // Non autorisé
    }

}
