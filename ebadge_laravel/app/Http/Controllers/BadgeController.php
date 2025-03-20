<?php

namespace App\Http\Controllers;

use App\Http\Requests\Badge\BadgeActivationRequest;
use App\Http\Requests\Badge\BadgeUpdateImageRequest;
use App\Http\Requests\Badge\BadgeUpdateRequest;
use App\Http\Requests\Badge\CreateBadgeRequest;
use App\Models\Badge;
use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Mockery\Undefined;
use PHPUnit\Framework\Constraint\Count;

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
        $badge->teacher_id = $request->user()->id;
        //insertion de l'image dans le dossier public avec un nom original
        if ($request->hasFile('image')) {
            $path = $request->file('image')->storeAs('public/badges', $request->file('image')->getClientOriginalName());
            $badge->imagePath = asset(Storage::url($path));
        } else $badge->imagePath = $request->imagePath;


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
                'imagePath' => $request->imagePath,
            ]
        );

        return response()->json($badge);
    }

    /**
     * Met à jour l'activation d'un badge
     * 
     * @param  \Illuminate\Http\Request  La requête de modification de badge
     * @return \Illuminate\Http\Response Le badge modifié en JSON
     */
    public function activation(BadgeActivationRequest $request)
    {
        $badge = new Badge();
        Log::debug('erreur'.$request);
        $badge = Badge::updateOrCreate(
            ['id' => $request->id],
            [
                'activated' =>$request->activated
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
        $imagePath = null;
        $ancienBadge = Badge::find($request->id);

        //Va supprimer l'ancienne image dans le serveur si elle est différente
        if($ancienBadge->imagePath != $request->imagePath)
            BadgeController::destroyOldImage($ancienBadge);

        //insertion de l'image dans le dossier public avec un nom original
        if ($request->hasFile('image')) {
            $path = $request->file('image')->storeAs('public/badges', $request->file('image')->getClientOriginalName());
            $imagePath = asset(Storage::url($path));
        } else
            $imagePath = $request->imagePath; // Si la requête n'a pas de fichier image

        $badge = Badge::updateOrCreate(
            ['id' => $request->id],
            [
                'title' => $request->title,
                'description' => $request->description,
                'imagePath' => $imagePath
            ]
        );

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

        // Supprimer l'image seulement si elle est dans un seul badge
        if ($badges->count() < 2) {
            $nameImage = str_replace($_ENV['APP_URL'] . ":8000/storage", '', $badge->imagePath); // le 8000 sera à supprimer si il est en ligne
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

        //Va supprimer l'ancienne image dans le serveur
        BadgeController::destroyOldImage($badge);

        // Supprime les relations avec les catégories
        $badge->categories()->detach();

        UserBadge::where('badge_id', $badge->id)->delete();

        $badge->delete();
        return response()->json(['message' => 'Badge ' . $badge . ' supprimé']);
    }
}
