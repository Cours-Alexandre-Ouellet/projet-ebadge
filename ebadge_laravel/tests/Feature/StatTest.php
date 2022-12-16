<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StatTest extends TestCase
{
    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->user = factory(\App\Models\User::class)->create();
        $this->badge = factory(\App\Models\Badge::class)->create();
    }

    public function testLeaderboard(){
        $response = $this->get('/api/stats/leaderboard');
        $response->assertStatus(200);
    }

}
