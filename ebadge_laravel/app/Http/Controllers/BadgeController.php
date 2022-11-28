<?php

namespace App\Http\Controllers;

use App\Http\Requests\Badge\BadgeUdpateRequest;
use App\Http\Requests\Badge\CreateBadgeRequest;
use App\Models\Badge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BadgeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $badges = Badge::all();
        return response()->json([
            'badges' => $badges
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(CreateBadgeRequest $request)
    {
        $badge = new Badge();
        $badge->title = $request->title;
        $badge->description = $request->description;
        $badge->color = $request->color;
        //insertion de l'image dans le dossier public avec un nom original
        $path = $request->file('image')->storeAs('public/badges', $request->file('image')->getClientOriginalName());
        $badge->imagePath = Storage::url($path);

        $badge->save();
        return response()->json($badge);
    }

    /**
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
     *
     * @param  \App\Badge  $badge
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:badges,id'
        ]);
        $badge = Badge::find($request->id);
        $badge->delete();
        return response()->json($badge);
    }
}
