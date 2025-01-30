<?php

namespace Tests\Feature;

use App\Models\Organisation;
use App\Models\Program;
use Tests\TestCase;
use UserFactory;

class AuthTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->user = UserFactory::create();

        $token = $this->user->createToken('Personal Access Token');
        $token->token->expires_at = now()->addMinutes(30);
        $token->token->save();
        $this->userToken = $token->plainTextToken;

        $this->program = Program::factory()->create();
        $this->organisation = Organisation::factory()->create();
    }

    public function testUserCanLogin()
    {
        $response = $this->post('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'password'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token_type',
            'expires_at',
            'access_token',
            'username',
            'role',
        ]);
    }

    public function testUserCanRegister()
    {
        $user = factory(\App\Models\User::class)->make();

        $response = $this->post('/api/auth/signup', [
            "username" => $user->username,
            "email" => $user->email,
            "password" => $user->password,
            "first_name" => $user->first_name,
            "last_name" => $user->last_name,
            "organisation_id" => $this->organisation->id,
            "program_id" => $this->program->id,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'user',
            'access_token',
        ]);
    }

    public function testCurrentUser()
    {
        $response = $this->get('/api/auth/current_user', [
            'Authorization' => 'Bearer ' . $this->userToken,
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment($this->user->toArray());
    }

    public function testUserCanLogout()
    {
        $response = $this->get('/api/auth/logout', [
            'Authorization' => 'Bearer ' . $this->userToken,
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'message' => 'Successfully logged out'
        ]);

        $token = $this->user->token();
        $this->assertNull($token);
    }
}
