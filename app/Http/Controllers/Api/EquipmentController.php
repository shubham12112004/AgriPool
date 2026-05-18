<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        return response()->json([]);
    }

    public function store(Request $request)
    {
        return response()->json(['created' => true], 201);
    }

    public function show($id)
    {
        return response()->json(['id' => $id]);
    }

    public function update(Request $request, $id)
    {
        return response()->json(['updated' => true]);
    }

    public function destroy($id)
    {
        return response()->json(['deleted' => true]);
    }
}
