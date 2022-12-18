<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Tests\TestCase;
class AuthTest extends TestCase
{

    public function setUp() : void
    {
        parent::setUp();

        $this->user = factory(\App\Models\User::class)->create();

        $token = $this->user->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addMinutes(30);
        $token->token->save();
        $this->userToken = $token->accessToken;

        $this->program = factory(\App\Models\Program::class)->create();
        $this->organisation = factory(\App\Models\Organisation::class)->create();
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

        $response2 = $this->post('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'wrongpassword'
        ]);

        $response2->assertStatus(401);
    }

    public function testUserCanRegister()
    {
        $user = factory(\App\Models\User::class)->make();

        $response = $this->post('/api/auth/signup', [
            "username" => $user->username,
            "email" => $user->email,
            "password" =>  $user->password,
            "first_name" => $user->first_name,
            "last_name" =>  $user->last_name,
            "organisation_id" => $this->organisation->id,
            "program_id" => $this->program->id,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'user',
            'access_token',
        ]);

        $response2 = $this->post('/api/auth/signup', [
            "email" => $user->email,
            "password" =>  $user->password,
            "first_name" => $user->first_name,
            "last_name" =>  $user->last_name,
            "organisation_id" => $this->organisation->id,
            "program_id" => $this->program->id,
        ]);

        $response2->assertStatus(422);
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
