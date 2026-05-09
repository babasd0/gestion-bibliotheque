<?php
namespace App\Http\Controllers;
use App\Models\Livre;
use Illuminate\Http\Request;
class LivreController extends Controller
{
    public function index()
    {
        return response()->json(Livre::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string',
            'auteur' => 'required|string',
            'genre' => 'nullable|string',
            'isbn' => 'nullable|string|unique:livres',
            'stock' => 'integer|min:0',
        ]);
        $livre = Livre::create($request->all());
        return response()->json($livre, 201);
    }

    public function show(string $id)
    {
        $livre = Livre::findOrFail($id);
        return response()->json($livre);
    }

    public function update(Request $request, string $id)
    {
        $livre = Livre::findOrFail($id);
        $livre->update($request->all());
        return response()->json($livre);
    }

    public function destroy(string $id)
    {
        Livre::findOrFail($id)->delete();
        return response()->json(['message' => 'Livre supprimé']);
    }
}