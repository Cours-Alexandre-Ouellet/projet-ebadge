<?php

namespace App\Http\Controllers;

use App\Models\TeacherCode;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class TeacherCodeController extends Controller
{

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
        return response()->json([
            'message' => 'Code deleted'
        ]);
    }
}
