<?php

namespace App\Http\Controllers;

use App\Models\TeacherCode;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class TeacherCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
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
     * Remove the specified resource from storage.
     *
     * @param  \App\TeacherCode  $teacherCode
     * @return \Illuminate\Http\Response
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
