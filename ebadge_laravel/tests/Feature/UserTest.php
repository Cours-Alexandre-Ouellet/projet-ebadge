<?php

namespace Tests\Feature;

use App\Models\Role;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Carbon\Carbon;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = factory(\App\Models\User::class)->create();

        $this->admin = factory(\App\Models\User::class)->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();


        $this->teacher = factory(\App\Models\User::class)->create();
        $this->teacher->role_id = Role::Teacher()->id;
        $this->teacher->save();
        $this->badge = factory(\App\Models\Badge::class)->create();


        $token = $this->user->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->userToken = $token->accessToken;

        $token = $this->teacher->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->teacherToken = $token->accessToken;

        $token = $this->admin->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->adminToken = $token->accessToken;
    }


    public function testUserCreate()
    {
        $user = User::where('id', $this->user->id)->get();
        $this->assertNotNull($user);
    }

    public function testUserCanAttachBadge()
    {
        $this->user->badges()->attach($this->badge->id);
        $this->assertTrue($this->user->badges->contains($this->badge));
    }

    public function testUserCanDetachBadge()
    {
        $this->user->badges()->attach($this->badge->id);
        $this->user->badges()->detach($this->badge->id);
        $this->assertFalse($this->user->badges->contains($this->badge));
    }

    public function testUserCanGetMyBadges()
    {
        $this->user->badges()->attach($this->badge->id);
        $response = $this->get('/api/user/my-badges', ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response->assertJsonFragment($this->badge->toArray());
    }

    public function testUserCanEditAvatarUrl()
    {
        $imageUrl = 'https://picsum.photos/200/300';
        $response = $this->post('/api/user/edit-avatar', ['avatarUrl' => $imageUrl], ['Authorization' => 'Bearer ' . $this->userToken]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['url' => $imageUrl]);
    }

    public function testUserCanEditBackgroundUrl()
    {
        $backgroundUrl = 'https://picsum.photos/1920/1080';

        $response = $this->post(
            '/api/user/edit-background',
            ['backgroundUrl' => $backgroundUrl],
            ['Authorization' => 'Bearer ' . $this->userToken]
        );

        $response->assertStatus(200);
        $response->assertJsonFragment(['url' => $backgroundUrl]);
    }

    public function testUserAssignBadge()
    {
        $response = $this->post('/api/user/assign-badge',
        ['user_id' => $this->user->id, 'badge_id' => $this->badge->id],
        ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Badge assigned']);

        $userBadges = $this->user->badges()->get();
        $this->assertTrue($userBadges->contains($this->badge));
    }

    public function testUserRemoveBadge()
    {
        $this->user->badges()->attach($this->badge->id);

        $response = $this->post('/api/user/remove-badge',
        ['user_id' => $this->user->id, 'badge_id' => $this->badge->id],
        ['Authorization' => 'Bearer ' . $this->teacherToken]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['message' => 'Badge removed']);

        $userBadges = $this->user->badges()->get();
        $this->assertFalse($userBadges->contains($this->badge));
    }


    public function testGetUserBadges()
    {
        $this->user->badges()->attach($this->badge->id);
        $response = $this->get('/api/user/' . $this->user->id . '/badges', ['Authorization' => 'Bearer ' . $this->teacherToken]);
        $response->assertStatus(200);
        $response->assertJsonFragment($this->badge->toArray());
    }

    public function testGetUserBadgesLeft()
    {
        $this->user->badges()->attach($this->badge->id);
        $response = $this->get('/api/user/' . $this->user->id . '/badges-left', ['Authorization' => 'Bearer ' . $this->teacherToken]);
        $response->assertStatus(200);
        $response->assertJsonMissing($this->badge->toArray());
    }

    public function testEditPrivacy()
    {
        $response = $this->post('/api/user/edit-privacy', ['privacy' => 1], ['Authorization' => 'Bearer ' . $this->userToken]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['privacy' => 1]);

        $user = User::where('id', $this->user->id)->first();
        $this->assertEquals($user->privacy, 1);

        $response = $this->post('/api/user/edit-privacy', ['privacy' => 0], ['Authorization' => 'Bearer ' . $this->userToken]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['privacy' => 0]);

        $user = User::where('id', $this->user->id)->first();
        $this->assertEquals($user->privacy, 0);
    }

    public function testIndexUsers()
    {
        $response = $this->get('/api/user', ['Authorization' => 'Bearer ' . $this->adminToken]);
        $response->assertStatus(200);
    }
}
