<?php

namespace App\Http\Controllers;

use App\Http\Requests\Badge\CategorieUdpateRequest;
use App\Http\Requests\Badge\CreateCategorieRequest;
use App\Models\Categorie;
use App\Models\CategorieBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller pour les catégories
 */
class CategorieController extends Controller
{
    /**
     * La liste de toutes les catégories
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Categorie::all();
        // foreach ($categories as $categorie) {
        //     $categorie->setPossessionPercentage();
        // }
        return response()->json(['categories' => $categories]);
    }

    /**
     * Création d'une nouvelle catégorie
     *
     * @return \Illuminate\Http\JsonResponse la catégorie créée
     */
    public function create(CreateCategorieRequest $request)
    {
        $categorie = new Categorie();
        $categorie->nom = $request->nom;
        $categorie->save();
        return response()->json($categorie);
    }

    /**
     * Affiche la catégorie avec l'id donné
     *
     * @param  \App\Categorie  $categorie
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:categories,id'
        ]);
        $categorie = Categorie::find($request->id);
        return response()->json($categorie);
    }

    /**
     * Met à jour la catégorie avec l'id donné
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function update(CategorieUdpateRequest $request)
    {
        $categorie = Categorie::updateOrCreate(
            ['id' => $request->id],
            [
                'nom' => $request->nom,
            ]
        );

        return response()->json($categorie);
    }

    /**
     * Supprime la catégorie avec l'id donné
     *
     * @param  \App\Categorie  $categorie
     * @return \Illuminate\Http\JsonResponse le id de la catégorie supprimée
     */
    public function destroy($id)
    {
        $categorie = Categorie::find($id);

        CategorieBadge::where('idCategorie', $categorie->id)->delete();

        $categorie->delete();
        return response()->json($categorie);
    }
}
