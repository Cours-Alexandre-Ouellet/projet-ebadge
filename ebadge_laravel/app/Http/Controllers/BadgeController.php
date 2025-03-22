<?php

namespace App\Http\Controllers;

use App\Http\Requests\Badge\BadgeUpdateImageRequest;
use App\Http\Requests\Badge\BadgeUpdateRequest;
use App\Http\Requests\Badge\CreateBadgeRequest;
use App\Models\Badge;
use App\Models\Category;
use App\Models\CategoryBadge;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Mockery\Undefined;
use PHPUnit\Framework\Constraint\Count;
use Symfony\Component\ErrorHandler\Debug;

use function Psy\debug;

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
        $badges = Badge::all();
        foreach ($badges as $badge) {
            $badge->setPossessionPercentage();
        }
        return response()->json(['badges' => $badges]);
    }

    /**
     * Création d'un nouveau badge
     *
     * @param  \Illuminate\Http\Request  La requête de création de badge
     * @return \Illuminate\Http\JsonResponse le badge créé
     */
    public function create(CreateBadgeRequest $request)
    {
        $badge = new Badge();
        $badge->title = $request->title;
        $badge->description = $request->description;
        $badge->color = $request->color; // à retirer
        $badge->teacher_id = $request->user()->id;

        //insertion de l'image dans le dossier public avec un nom original
        if ($request->hasFile('image')) {
            $path = $request->file('image')->storeAs('public/badges', $request->file('image')->getClientOriginalName());
            $badge->imagePath = asset(Storage::url($path));
        } else $badge->imagePath = $request->imagePath;


        $badge->save();
        if ($request->category_id != 0) {
            $categoryBadge = new CategoryBadge();
            $categoryBadge->badge_id = $badge->id;
            $categoryBadge->category_id = $request->category_id;
            $categoryBadge->save();
            $badge->category = $request->category_name;
        }


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
            'id' => 'required|exists:badge,id'
        ]);
        $badge = Badge::find($request->id);
        return response()->json($badge);
    }

    /**
     * Met à jour le badge avec l'id donné du badge (Déprécié)
     * 
     * @param  \Illuminate\Http\Request  La requête de modification de badge
     * @return \Illuminate\Http\Response Le badge modifié en JSON
     */
    public function update(BadgeUpdateRequest $request)
    {
        $badge = new Badge();
        $badge = Badge::updateOrCreate(
            ['id' => $request->id],
            [
                'title' => $request->title,
                'description' => $request->description,
                'color' => $request->color, // à supprimer
                'imagePath' => $request->imagePath
            ]
        );

        return response()->json($badge);
    }

    /**
     * Met à jour le badge avec l'id donné du badge
     * Version qui accepte les images et fichiers
     * 
     * @param  \Illuminate\Http\Request  La requête de modification de badge avec image
     * @return \Illuminate\Http\Response Le badge modifié en JSON
     * @author Vincent Houle
     */
    public function updateImage(BadgeUpdateImageRequest $request)
    {
        //----- Gerer l'image -----
        $imagePath = null;
        $oldBadge = Badge::find($request->id);

        // Va supprimer l'ancienne image dans le serveur si elle est différente
        if ($oldBadge->imagePath != $request->imagePath)
            BadgeController::destroyOldImage($oldBadge);

        // Insertion de l'image dans le dossier public avec un nom original
        if ($request->hasFile('image')) {
            $path = $request->file('image')->storeAs('public/badges', $request->file('image')->getClientOriginalName());
            $imagePath = asset(Storage::url($path));
        } else
            $imagePath = $request->imagePath; // Si la requête n'a pas de fichier image

        //----- Modification du badge -----
        $badge = Badge::updateOrCreate(
            ['id' => $request->id],
            [
                'title' => $request->title,
                'description' => $request->description,
                'color' => $request->color, // à supprimer
                'imagePath' => $imagePath
            ]
        );

        //----- Gerer la catégorie -----
        $categoryBadge = CategoryBadge::where('badge_id', $request->id)->get();

        if ($request->category_id) {

            // Modification du lien entre badge et catégorie
            if (count($categoryBadge) != 0) {
                CategoryBadge::updateOrCreate(
                    ['id' => $categoryBadge[0]->id],
                    [
                        'badge_id' => $request->id,
                        'category_id' => $request->category_id
                    ]
                );
            }
            // Création du lien entre badge et catégorie
            else {
                Log::debug("Create");
                $categoryBadge = new CategoryBadge();
                $categoryBadge->category_id = $request->category_id;
                $categoryBadge->badge_id = $request->id;
                $categoryBadge->save();
            }
            $badge->{"category"} = $request->category_name;

        }
        // suppression du lien entre badge et catégorie
        else if (count($categoryBadge) != 0) {
            $categoryBadge[0]->delete();
        }
        Log::debug($badge);
        Log::debug($request);

        return response()->json($badge);
    }




    /**
     * Supprime l'ancienne image de badge dans le serveur
     * 
     * @param Badge le badge
     * @return Bool si l'image a été supprimer ou si l'image n'est pas à supprimer.
     * @author Vincent Houle
     */
    private function destroyOldImage($badge)
    {
        // nombre de badge avec la même image
        $badges = Badge::where('imagePath', '=', $badge->imagePath);
        $port = $_SERVER['SERVER_PORT'];
        $url = $_ENV['APP_URL'];
        // Supprimer l'image seulement si elle est dans un seul badge
        if ($badges->count() < 2) {
            $nameImage = str_replace($url . ":" . $port . "/storage", '', $badge->imagePath);
            // le 8000 sera à supprimer si il est en ligne
            if (Storage::disk('public')->exists($nameImage)) {
                return Storage::disk('public')->delete($nameImage);
            }
        }

        return true;
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

        // Va supprimer l'ancienne image dans le serveur
        BadgeController::destroyOldImage($badge);

        // Supprime les relations avec les catégories
        $badge->categories()->detach();

        UserBadge::where('badge_id', $badge->id)->delete();

        $badge->delete();
        return response()->json(['message' => 'Badge ' . $badge . ' supprimé']);
    }

    /**
     * Va chercher la catégory d'un badge
     * 
     * @param id id du badge
     * @return \Illuminate\Http\JsonResponse une catégorie
     * @author Vincent Houle
     */
    public function getBadgeCategory($id)
    {

        $categoryId = CategoryBadge::where('badge_id', $id)->get();
        $category = null;
        if (count($categoryId) != 0)
            $category = Category::find($categoryId[0]->category_id);
        return response()->json($category);
    }

    /**
     * Va chercher tous les badges avec leur nom de catégorie
     * 
     * @return \Illuminate\Http\JsonResponse les badges avec leur catégorie
     * @author Vincent Houle
     */
    public function getAllBadgesWithCategory()
    {
        $badges = Badge::leftJoin('category_badge', 'category_badge.badge_id', '=', 'badge.id')
            ->leftJoin('category', 'category.id', '=', 'category_badge.category_id')
            ->select(['badge.*', 'category.name AS category'])
            ->get();

        return response()->json($badges);
    }
}
