<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\Role;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    private $user;

    private $password;


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
        $this->password = $this->user->password;
        $this->user->password = Hash::make($this->user->password);

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
     * Vérifie qu’un professeur peut être promu administrateur avec succès.
     * @author Elyas Benyssad
     */
    public function testPromoteTeacherToAdmin()
    {
        $newTeacher = User::factory()->create(['role_id' => Role::Teacher()->id]);

        $response = $this->postJson('/api/user/assign-admin', [
            'user_id' => $newTeacher->id
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('user', [
            'id' => $newTeacher->id,
            'role_id' => Role::Admin()->id
        ]);
    }

    /**
     * Vérifie qu’un professeur peut être supprimé correctement par un administrateur.
     * @author Elyas Benyssad
     */
    public function testDeleteTeacher()
    {
        $teacherToDelete = User::factory()->create(['role_id' => Role::Teacher()->id]);

        $response = $this->delete('/api/user/' . $teacherToDelete->id, [], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('user', [
            'id' => $teacherToDelete->id
        ]);
    }

    /**
     * Vérifie qu’un utilisateur actif peut être désactivé via le toggle.
     * @author Elyas Benyssad
     */
    public function testDeactivateUser()
    {
        $activeUser = User::factory()->create(['active' => 1]);

        $response = $this->post('/api/user/' . $activeUser->id . '/toggle-active', [], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('user', [
            'id' => $activeUser->id,
            'active' => 0
        ]);
    }

    /**
     * Vérifie que la promotion d’un utilisateur inexistant échoue proprement.
     * @author Elyas Benyssad
     */
    public function testPromoteNonexistentUserFails()
    {
        $response = $this->postJson('/api/user/assign-admin', [
            'user_id' => 999999, // ID invalide
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(422);
    }

    /**
     * Vérifie qu’un professeur ne peut pas promouvoir un autre utilisateur en administrateur.
     * @author Elyas Benyssad
     */
    public function testTeacherCannotPromoteToAdmin()
    {
        $anotherTeacher = User::factory()->create(['role_id' => Role::Teacher()->id]);

        $response = $this->postJson('/api/user/assign-admin', [
            'user_id' => $anotherTeacher->id,
        ], [
            'Authorization' => 'Bearer ' . $this->teacherToken,
        ]);

        $response->assertStatus(401); 
    }

    /**
     * Vérifie que la tentative de suppression d’un utilisateur inexistant retourne bien une erreur 404.
     * @author Elyas Benyssad
     */
    public function testDeleteNonexistentUser()
    {
        $response = $this->delete('/api/user/999999', [], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(404);
    }

    /**
     * Vérifie que le toggle de l'état actif d’un utilisateur fonctionne même si l’utilisateur est déjà inactif.
     * @author Elyas Benyssad
     */
    public function testDeactivateAlreadyInactiveUser()
    {
        $inactiveUser = User::factory()->create(['active' => 0]);

        $response = $this->post('/api/user/' . $inactiveUser->id . '/toggle-active', [], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200); 
        $this->assertDatabaseHas('user', [
            'id' => $inactiveUser->id,
            'active' => 1
        ]);
    }

}
