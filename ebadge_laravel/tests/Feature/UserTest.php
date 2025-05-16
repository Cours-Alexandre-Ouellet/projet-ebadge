<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\Role;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Carbon\Carbon;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    private $user;

    private $otherUser;

    private $admin;
    private $teacher;
    private $badge;
    private $badge2;
    private $badge3;
    private $badge4;
    private $userToken;
    private $teacherToken;
    private $adminToken;


    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->user->role_id = Role::Student()->id;

        $this->otherUser = User::factory()->create();
        $this->otherUser->role_id = Role::Student()->id;

        $this->admin = User::factory()->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();

        $this->teacher = User::factory()->create();
        $this->teacher->role_id = Role::Teacher()->id;
        $this->teacher->save();
        $this->badge = Badge::factory()->create();
        $this->badge2 = Badge::factory()->create();
        $this->badge3 = Badge::factory()->create();
        $this->badge4 = Badge::factory()->create();

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

        $this->user->save();
        $this->otherUser->save();
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
        $this->user->badges()->attach(Badge::all());
        $this->user->badges()->detach($this->badge->id);
        $response = $this->get('/api/user/' . $this->user->id . '/badges-left', ['Authorization' => 'Bearer ' . $this->teacherToken]);
        $response->assertStatus(200);
        $response->assertJsonFragment($this->badge->toArray());
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
    /**
     * Teste si un utilisateur peut se visiter
     * @return void
     */
    public function testUserVisitItself(){
        $response = $this->get('/api/user/' . $this->user->id, ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response->assertJsonFragment([
                'id' => $this->user->id,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'role_id' => $this->user->role_id,
                'username' => $this->user->username,
                'privacy' => $this->user->privacy,
                'avatarImagePath' => $this->user->avatarImagePath,
                'backgroundImagePath' => $this->user->backgroundImagePath,
        ]);
    }

    /**
     * Teste si un utilisateur peut en visiter un autre
     * @return void
     */
    public function testUserVisitUser(){
        $response = $this->get('/api/user/' . $this->otherUser->id, ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response->assertJsonFragment([
                'id' => $this->otherUser->id,
                'first_name' => $this->otherUser->first_name,
                'last_name' => $this->otherUser->last_name,
                'role_id' => $this->otherUser->role_id,
                'username' => $this->otherUser->username,
                'privacy' => $this->otherUser->privacy,
                'avatarImagePath' => $this->otherUser->avatarImagePath,
                'backgroundImagePath' => $this->otherUser->backgroundImagePath,
        ]);
    }

    /**
     * Test si un utilisateur écoura a visiter un utilisateur inexistant
     * @return void
     */
    public function testUserVisitInexistant(){
        $response = $this->get('/api/user/' . -1, ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(404);
    }

    /**
     * Vérifie qu'un utilisateur peut ajouter un badge a ses favories
     * @return void
     */
    public function testAddFavoriteBadge(){
        $this->user->badges()->attach($this->badge->id);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
    }

    /**
     * Vérifie que l'ajout d'un badge épinglé fonctionne
     * @return void
     */
    public function testAddBadFavoriteBadge(){
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>-1,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(422);
    }

    /**
     * Vérifie que l'épinglage d'un badge déja épingle ne cause pas d'erreurs
     * @return void
     */
    public function testAddFavoriteBadgeTwice(){
        $this->user->badges()->attach($this->badge->id);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
    }

    /**
     * Vérifie qu'enlever un badge épinglé fonctionne
     * @return void
     */
    public function testRemoveFavoriteBadge(){
        $this->user->badges()->attach($this->badge->id);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>0], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
    }

    /**
     * Vérifie qu'enlever un badge pas épinglé ne causera pas d'erreurs
     * @return void
     */
    public function testRemoveFavoriteBadgeTwice(){
        $this->user->badges()->attach($this->badge->id);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>0], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>0], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
    }

    /**
     * Vérifie qu'épingler plusieurs badge ne cause pas d'erreurs
     * @return void
     */
    public function testAddThreeFavoriteBadge(){
        $this->user->badges()->attach($this->badge->id);
        $this->user->badges()->attach($this->badge2->id);
        $this->user->badges()->attach($this->badge3->id);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge2->id,'user_id' => $this->user->id, 'favorite'=>0], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge3->id,'user_id' => $this->user->id, 'favorite'=>0], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
    }
    /**
     * Vérifie qu'épingler trop de badges lance une erreur
     * @return void
     */
    public function testAddFourFavoriteBadge(){
        $this->user->badges()->attach($this->badge->id);
        $this->user->badges()->attach($this->badge2->id);
        $this->user->badges()->attach($this->badge3->id);
        $this->user->badges()->attach($this->badge4->id);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge2->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge3->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(200);
        $response = $this->put('/api/user/changeFavoriteBadge',['badge_id' =>$this->badge4->id,'user_id' => $this->user->id, 'favorite'=>1], ['Authorization' => 'Bearer ' . $this->userToken]);
        $response->assertStatus(404);
    }

}
