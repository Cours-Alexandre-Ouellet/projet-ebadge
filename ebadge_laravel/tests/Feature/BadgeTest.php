<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;


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
        $this->badge = factory(\App\Models\Badge::class)->create();
    }

    /**
     * Créer un badge sans certain champs obligatoire
     */
    public function testCreateBadgeWithoutRequiredFields() : void
    {
        $response = $this->post('/api/badge/create', [
            'title' => $this->badge->title,
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
            'color' => $this->badge->color,
        ]);

        $response->assertStatus(302);
    }

    /**
     * ○Scénario 2 : Suppression d’un badge alors qu’il est lié à des étudiants
     */
    public function testDeleteBadgeLinkedToStudents(): void
    {
        $response = $this->post('/api/badge/delete', [
            'id' => $this->badge->id,
        ]);

        $response->assertStatus(302);
    }

    /**
     * ○Scénario 3 : Modification d’un badge sans certains champs obligatoires
     */
    public function testUpdateBadgeWithoutRequiredFields(): void
    {
        $response = $this->post('/api/badge/update', [
            'id' => $this->badge->id,
            'title' => $this->badge->title,
            'description' => $this->badge->description,
            'imagePath' => $this->badge->imagePath,
            'color' => $this->badge->color,
        ]);

        $response->assertStatus(302);
    }

    /**
     * ○Scénario 4 : Récupérer un badge retourne bien tous les champs visibles du badge
     */
    public function testGetBadge()
    {
        $response = $this->get('/api/badge/get', [
            'id' => $this->badge->id,
        ]);

        $response->assertStatus(200);
    }
}
