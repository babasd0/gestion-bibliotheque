<?php
namespace App\Http\Controllers;
use App\Models\Adherent;
use Illuminate\Http\Request;
class AdherentController extends Controller
{
    public function index()
    {
        return response()->json(Adherent::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:adherents',
            'telephone' => 'nullable|string',
        ]);
        $adherent = Adherent::create($request->all());
        return response()->json($adherent, 201);
    }

    public function show(string $id)
    {
        $adherent = Adherent::findOrFail($id);
        return response()->json($adherent);
    }

    public function update(Request $request, string $id)
    {
        $adherent = Adherent::findOrFail($id);
        $adherent->update($request->all());
        return response()->json($adherent);
    }

    public function destroy(string $id)
    {
        Adherent::findOrFail($id)->delete();
        return response()->json(['message' => 'Adhérent supprimé']);
    }
}