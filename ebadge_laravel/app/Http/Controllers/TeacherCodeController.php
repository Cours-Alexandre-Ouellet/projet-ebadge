<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeacherCode\TeacherCodeAssignRequest;
use App\Models\Role;
use App\Models\TeacherCode;
use Illuminate\Http\Request;
use User;

class TeacherCodeController extends Controller
{
    /**
     * Retourne la liste de tous les codes enseignants
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['teacher_codes' => TeacherCode::all()]);
    }

    /**
     * Créer un code d'enseignant
     *
     * @return JsonResponse le code créé
     */
    public function create()
    {
        $code = new TeacherCode();
        $code->generateCode();
        return response()->json([
            'code' => $code->code
        ]);
    }

    /**
     * Assign un utilisateur à un code d'enseignant
     *
     * @return \Illuminate\Http\Response
     */
    public function assign(TeacherCodeAssignRequest $request)
    {
        $userId = $request->get('user_id');
        $user = User::find($userId);
        $teacherCodeId = $request->get('teacher_code_id');

        $code = TeacherCode::where('id', $teacherCodeId)->first();
        $code->user_id = $user->id;
        $code->save();

        $user->role_id = Role::Teacher()->id;
        $user->save();

        return response()->json(['message' => 'Code assigned']);
    }

    /**
     * Supprime un code d'enseignant
     *
     * @return JsonResponse un message de confirmation
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'code' => 'required|exists:teacher_code,code'
        ]);

        $code = TeacherCode::where('code', $request->code)->first();
        $code->delete();

        $user = User::where('id', $code->user_id)->first();
        $user->role_id = Role::Student()->id;
        $user->save();

        return response()->json([
            'message' => 'Code deleted'
        ]);
    }
}
