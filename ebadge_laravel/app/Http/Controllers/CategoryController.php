<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\CategoryAssignRequest;
use App\Http\Requests\Category\CategoryUpdateRequest;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Models\Category;
use App\Models\CategoryBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Badge;

/**
 * Controller pour les catégories
 * 
 * @author: Alexandre del Fabbro - [alexandre.delfabbro@gmail.com]
 * D'après le code de projet-ebadge
 * Inspiré de OpenAi - ChatGPT - [Modèle massif de langage] - chatgpt.com - [Consulté le 20 mars 2025]
 */
class CategoryController extends Controller
{
    /**
     * La liste de toutes les catégories
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json(['categories' => $categories]);
    }

    /**
     * Création d'une nouvelle catégorie
     *
     * @return \Illuminate\Http\JsonResponse la catégorie créée
     */
    public function create(CreateCategoryRequest $request)
    {
        $category = new Category();
        $category->name = $request->name;
        $category->save();
        return response()->json($category);
    }

    /**
     * Assigne un badge à une catégorie
     */
    public function assignBadge(CategoryAssignRequest $request)
    {
        $badgeId = $request->get('badge_id');
        $categoryId = $request->get('category_id');

        $badge = CategoryBadge::where('badge_id', $badgeId)->where('category_id', $categoryId)->first();
        
        if ($badge == null) {
            $badge = new CategoryBadge();
            $badge->badge_id = $badgeId;
            $badge->category_id = $categoryId;
            $badge->save();
        }

        return response()->json(['message' => 'Badge assigned']);
    }
    
    /**
     * Enlève un badge d'une catégorie
     */
    public function removeBadge(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:category,id',
            'badge_id' => 'required|exists:badge,id'
        ]);

        $category = Category::find($request->category_id);
        $category->badges()->detach($request->badge_id);
        return response()->json([
            'message' => 'Badge removed'
        ]);
    }
    
    /**
     * Affiche la catégorie avec l'id donné
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:category,id'
        ]);
        $category = Category::find($request->id);
        return response()->json($category);
    }

    /**
     * Récupère les badges assignés à la catégorie avec l'id donné
     */
    public function getCategoryBadges($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        $badges = $category->badges;
        return response()->json([
            'badges' => $badges
        ]);
    }

    /**
     * Récupère les badges non assignés à la catégorie avec l'id donné
     */
    // public function getCategoryBadgeLeft(int $id)
    // {
    //     $category = Category::find($id);

    //     if ($category == null) {
    //         return response()->json(['error' => 'Category not found'], 404);
    //     }
    //     $badges = $category->badges;
    //     $missingBadges = Badge::whereNotIn('id', $badges->pluck('id'))->get();
    //     return response()->json([
    //         'badges' => $missingBadges
    //     ]);

    // }

    /**
     * Récupère les badges non assignés à une catégorie
     */
    public function getCategoryBadgeLeft()
    {
        $unassignedBadges = Badge::whereDoesntHave('categories')->get();
        return response()->json([
            'badges' => $unassignedBadges
        ]);
    }

    /**
     * Met à jour la catégorie avec l'id donné
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function update(CategoryUpdateRequest $request)
    {
        $category = Category::updateOrCreate(
            ['id' => $request->id],
            [
                'name' => $request->name,
            ]
        );

        return response()->json($category);
    }

    /**
     * Supprime la catégorie avec l'id donné
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\JsonResponse le id de la catégorie supprimée
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        CategoryBadge::where('category_id', $category->id)->delete();

        $category->delete();
        return response()->json($category);
    }
}
