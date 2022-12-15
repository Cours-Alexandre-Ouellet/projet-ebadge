<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use App\Models\User;

class ProgramController extends Controller
{
    public function index()
    {
        return Program::all();
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $program = Program::create([
            'name' => $request->name,
        ]);

        return response()->json($program, 201);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:program,id|not_in:0'
        ]);

        $program = Program::find($request->id);

        $users = User::where('program_id', $program->id)->get();
        foreach ($users as $user) {
            $user->program_id = 0;
            $user->save();
        }

        $program->delete();


        return response()->json([
            'deleted' => $program->id
        ], 200);
    }
}
