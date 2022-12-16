<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Carbon;
use App\Models\Role;
use App\Models\Program;
class ProgramTest extends TestCase
{
    public function setUp() : void
    {
        parent::setUp();

        $this->program = factory(\App\Models\Program::class)->create();

        $this->admin = factory(\App\Models\User::class)->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();

        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addMinutes(30);
        $token->token->save();
        $this->adminToken = $token->accessToken;
    }

    public function testIndexPrograms()
    {
        $response = $this->get('/api/program');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'created_at',
                'updated_at',
            ],
        ]);

        $response->assertJsonFragment([
            'id' => $this->program->id,
            'name' => $this->program->name,
        ]);
    }

    public function testCreateProgram()
    {
        $response = $this->post(
            '/api/program',
            ['name' => 'Test Program'],
            ['Authorization' => 'Bearer ' . $this->adminToken]
        );

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'name' => 'Test Program',
        ]);

        $response->assertJsonStructure([
            'id',
            'name',
            'created_at',
            'updated_at',
        ]);

        $this->assertDatabaseHas('program', ['name' => 'Test Program']);
        Program::where('name', 'Test Program')->delete();
    }

    public function testCreateProgramWithoutToken()
    {
        $response = $this->post(
            '/api/program',
            ['name' => 'Test Program']
        );

        $response->assertStatus(401);
    }

    public function testDeleteProgram()
    {
        $program = factory(\App\Models\Program::class)->create();

        $response = $this->delete(
            '/api/program',
            ['id' => $program->id],
            ['Authorization' => 'Bearer ' . $this->adminToken]
        );

        $response->assertStatus(200);
        $this->assertDatabaseMissing('program', ['id' => $program->id]);
    }
}
