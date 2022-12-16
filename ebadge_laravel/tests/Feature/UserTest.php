<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use PDO;

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
        $this->badge = factory(\App\Models\Badge::class)->create();

        $this->token = $this->user->createToken('Personal Access Token')->accessToken;
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
        $response = $this->get('/api/user/my-badges', ['Authorization' => 'Bearer ' . $this->token]);
        $response->assertStatus(200);
        $response->assertJsonFragment($this->badge->toArray());
    }
}
