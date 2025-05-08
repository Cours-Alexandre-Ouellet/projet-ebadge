<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\Role;
use Carbon\Carbon;
use App\Models\User;


class CategoryTest extends TestCase
{
    use DatabaseTransactions;

    private $user;
    private $teacher;
    private $admin;
    private $category;
    private $student;
    private $badge;
    private $teacherToken;

    /**
     * SETUP
     */
    public function setUp(): void
    {
        parent::setUp();
        /*
        $this->user = User::factory()->create();

        $this->admin = User::factory()->create();
        $this->admin->role_id = Role::Admin()->id;
        $this->admin->save();

        $this->teacher = User::factory()->create();
        $this->teacher->role_id = Role::Teacher()->id;
        $this->teacher->save();

        $this->student = User::factory()->create();
        $this->student->role_id = Role::Student()->id;

        $this->category = Category::factory()->create();

        $this->badge = Badge::factory()->create();

        $token = $this->teacher->createToken('Personal Access Token');
        $token->token->expires_at = Carbon::now()->addWeeks(1);
        $token->token->save();
        $token->expires_at = now()->addMinutes(30);
        $this->teacherToken = $token->accessToken;
        */
    }

   
}
