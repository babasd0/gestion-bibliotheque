<?php
namespace App\Http\Controllers;
use App\Models\Emprunt;
use App\Models\Livre;
use Illuminate\Http\Request;
class EmpruntController extends Controller
{
    public function index()
    {
        return response()->json(
            Emprunt::with(['livre', 'adherent'])->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'livre_id' => 'required|exists:livres,id',
            'adherent_id' => 'required|exists:adherents,id',
            'date_emprunt' => 'required|date',
        ]);

        $livre = Livre::findOrFail($request->livre_id);
        if ($livre->stock < 1) {
            return response()->json(['message' => 'Livre non disponible'], 400);
        }

        $livre->decrement('stock');
        $emprunt = Emprunt::create([
            'livre_id' => $request->livre_id,
            'adherent_id' => $request->adherent_id,
            'date_emprunt' => $request->date_emprunt,
            'statut' => 'en_cours',
        ]);
        return response()->json($emprunt, 201);
    }

    public function show(string $id)
    {
        $emprunt = Emprunt::with(['livre', 'adherent'])->findOrFail($id);
        return response()->json($emprunt);
    }

    public function update(Request $request, string $id)
    {
        $emprunt = Emprunt::findOrFail($id);
        if ($request->statut === 'retourne' && $emprunt->statut !== 'retourne') {
            Livre::findOrFail($emprunt->livre_id)->increment('stock');
        }
        $emprunt->update($request->all());
        return response()->json($emprunt);
    }

    public function destroy(string $id)
    {
        Emprunt::findOrFail($id)->delete();
        return response()->json(['message' => 'Emprunt supprimé']);
    }
}