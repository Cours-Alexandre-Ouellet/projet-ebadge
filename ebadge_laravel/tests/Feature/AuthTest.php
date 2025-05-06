<?php

namespace Tests\Feature;

use App\Models\Organisation;
use App\Models\Program;
use App\Models\User;
use Carbon\Carbon;
use Laravel\Passport\Bridge\AccessToken;
use Tests\TestCase;
class AuthTest extends TestCase
{

    private $user;
    private $userToken;
    private $program;
    private $organisation;

    public function setUp() : void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $token = $this->user->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addMinutes(30);
        $token->token->save();
        $this->userToken = $token->accessToken;

        $this->program = Program::factory()->create();
        $this->organisation = Organisation::factory()->create();
    }

    public function testUserCanLogin()
    {
        $response = $this->post('/api/auth/login', [
            'email' => $this->user->email,
            'password' => $this->user->password
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
        $user = User::factory()->make();

        $response = $this->post('/api/auth/signup', [
            "username" => $user->username,
            "email" => $user->email,
            "password" =>  $user->password,
            "first_name" => $user->first_name,
            "last_name" =>  $user->last_name
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
        $response->assertJsonFragment([
            'id' => $this->user->id,
            'first_name' => $this->user->first_name,
            'last_name' => $this->user->last_name,
            'username' => $this->user->username,
            'role_id' => $this->user->role_id,
            'privacy' => $this->user->privacy,
            'avatarImagePath' => $this->user->avatarImagePath,
            'backgroundImagePath' => $this->user->backgroundImagePath,
        ]);
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
