<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Models\User;
class OrganisationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Organisation::all();
    }

    /**
     * Supprime un organisation en fonction de son id
     *
     * @param Request $request
     * @return reponse json où deleted est le id de l'organisation supprimé
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
