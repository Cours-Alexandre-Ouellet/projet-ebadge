<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\CategoryUpdateRequest;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Models\Category;
use App\Models\CategoryBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller pour les catégories
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
        // foreach ($categories as $category) {
        //     $category->setPossessionPercentage();
        // }
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
     * Affiche la catégorie avec l'id donné
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:categories,id'
        ]);
        $category = Category::find($request->id);
        return response()->json($category);
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

        CategoryBadge::where('idCategory', $category->id)->delete();

        $category->delete();
        return response()->json($category);
    }
}
