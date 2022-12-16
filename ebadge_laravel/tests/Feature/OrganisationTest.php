<?php

namespace Tests\Feature;

use App\Models\Organisation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Role;
use Carbon\Carbon;

class OrganisationTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->organisation = factory(\App\Models\Organisation::class)->create();

        $this->admin = factory(\App\Models\User::class)->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();

        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addMinutes(30);
        $token->token->save();
        $this->adminToken = $token->accessToken;
    }

    public function testCreateOrganisation()
    {
        $response = $this->post(
            '/api/organisation',
            ['name' => 'Test Organisation'],
            ['Authorization' => 'Bearer ' . $this->adminToken]
        );

        $response->assertStatus(201);
        $this->assertDatabaseHas('organisation', ['name' => 'Test Organisation']);
        Organisation::where('name', 'Test Organisation')->delete();
    }

    public function testCreateOrganisationWithoutToken()
    {
        $response = $this->post(
            '/api/organisation',
            ['name' => 'Test Organisation']
        );

        $response->assertStatus(401);
    }

    public function testListOrganisation()
    {
        $response = $this->get('/api/organisation');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'created_at',
                'updated_at',
            ]
        ]);

        $response->assertJsonFragment([
            'id' => $this->organisation->id,
            'name' => $this->organisation->name,
        ]);
    }

    public function testDeleteOrganisation()
    {
        $org = factory(\App\Models\Organisation::class)->create();

        $response = $this->delete(
            '/api/organisation',
            ['id' => $org->id],
            ['Authorization' => 'Bearer ' . $this->adminToken]
        );

        $response->assertStatus(200);
        $this->assertDatabaseMissing('organisation', ['id' => $org->id]);
    }
}
