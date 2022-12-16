<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Models\User;

/**
 * Contrôleur pour les organisations
 */
class OrganisationController extends Controller
{

    /**
     * liste les organisations
     *
     * @return void
     */
    public function index()
    {
        return Organisation::all();
    }

    /**
     * suppression d'une organisation
     *
     * @param Request $request
     * @return JsonResponse le id de l'organisation supprimée
     */
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:organisation,id'
        ]);
        $organisation = Organisation::find($request->id);

        $users = User::where('organisation_id', $organisation->id)->get();
        foreach ($users as $user) {
            $user->organisation_id = 0;
        }

        $organisation->delete();
        return response()->json(['deleted' => $organisation->id]);

    }

    /**
     * création d'une organisation
     *
     * @param Request $request
     * @return JsonResponse l'organisation modifiée
     */
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $organisation = Organisation::create([
            'name' => $request->name,
        ]);

        return response()->json($organisation, 201);
    }


}
