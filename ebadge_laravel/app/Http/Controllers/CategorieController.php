<?php

namespace App\Http\Controllers;

// use App\Http\Requests\Badge\BadgeUdpateRequest;
use App\Http\Requests\Badge\CreateCategorieRequest;
use App\Models\Categorie;
use App\Models\CategorieBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller pour les badges
 */
class BadgeController extends Controller
{
    /**
     * la liste de tous les badges avec le pourcentage de possession
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
        $badge = new Badge();
        $badge->title = $request->title;
        $badge->description = $request->description;
        $badge->color = $request->color;
        //insertion de l'image dans le dossier public avec un nom original
        if($request->hasFile('image')) {
            $path = $request->file('image')->storeAs('public/badges', $request->file('image')->getClientOriginalName());
            $badge->imagePath = asset(Storage::url($path));
        } else {
            $badge->imagePath = $request->imagePath;
        }
        $badge->save();
        return response()->json($badge);
    }

    /**
     * Affiche le badge avec l'id donné
     *
     * @param  \App\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:badges,id'
        ]);
        $badge = Badge::find($request->id);
        return response()->json($badge);
    }

    /**
     * Met à jour le badge avec l'id donné
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function update(BadgeUdpateRequest $request)
    {
        $badge = Badge::updateOrCreate(
            ['id' => $request->id],
            [
                'title' => $request->title,
                'description' => $request->description,
                'color' => $request->color,
                'imagePath' => $request->imagePath
            ]
        );

        return response()->json($badge);
    }

    /**
     * Supprime le badge avec l'id donné
     *
     * @param  \App\Badge  $badge
     * @return \Illuminate\Http\JsonResponse le id du badge supprimé
     */
    public function destroy($id)
    {
        $badge = Badge::find($id);

        UserBadge::where('badge_id', $badge->id)->delete();

        $badge->delete();
        return response()->json($badge);
    }
}
