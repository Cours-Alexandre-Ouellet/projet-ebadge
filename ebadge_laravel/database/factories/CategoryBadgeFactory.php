<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

namespace Database\Factories;

use App\Models\Badge;
use App\Models\Category;
use App\Models\CategoryBadge;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryBadgeFactory extends Factory{
    

    protected $model = CategoryBadge::class;

    /**
     * fonction qui génère des données aléatoire pour un Badge
     * 
     * @author Vincent Houle
     * @return CategoryBadge avec des données aléatoire
     */    
    public function definition(): array
    {
        return [
            'badge_id' => Badge::factory(),
            'category_id' => Category::factory()
        ];
    }
}