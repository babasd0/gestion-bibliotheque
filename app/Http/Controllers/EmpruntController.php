<?php
namespace App\Http\Controllers;
use App\Models\Emprunt;
use App\Models\Livre;
use App\Models\Adherent;
use Illuminate\Http\Request;

class EmpruntController extends Controller
{
    public function index()
    {
        $empruntsEnCours = Emprunt::where('statut', 'en_cours')
            ->whereNotNull('date_retour_prevue')
            ->where('date_retour_prevue', '<', now()->toDateString())
            ->get();

        foreach ($empruntsEnCours as $emprunt) {
            $emprunt->update(['statut' => 'en_retard']);
        }

        return Emprunt::with('livre', 'adherent')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'livre_id' => 'required|exists:livres,id',
            'adherent_id' => 'required|exists:adherents,id',
            'date_emprunt' => 'required|date',
            'date_retour_prevue' => 'nullable|date',
        ]);

        $livre = Livre::findOrFail($request->livre_id);
        $adherent = Adherent::findOrFail($request->adherent_id);

        if ($livre->stock <= 0) {
            return response()->json(['message' => 'Livre non disponible'], 400);
        }

        if ($adherent->sanctionne) {
            return response()->json(['message' => 'Cet adherent est sanctionne et ne peut pas emprunter.'], 400);
        }

        $emprunt = Emprunt::create([
            'livre_id' => $request->livre_id,
            'adherent_id' => $request->adherent_id,
            'date_emprunt' => $request->date_emprunt,
            'date_retour_prevue' => $request->date_retour_prevue,
            'statut' => 'en_cours',
        ]);

        $livre->decrement('stock');

        return response()->json($emprunt->load('livre', 'adherent'), 201);
    }

    public function update(Request $request, $id)
    {
        $emprunt = Emprunt::findOrFail($id);

        if ($request->statut === 'retourne' && $emprunt->statut !== 'retourne') {
            $livre = Livre::findOrFail($emprunt->livre_id);
            $livre->increment('stock');
        }

        $emprunt->update($request->all());

        return response()->json($emprunt->load('livre', 'adherent'));
    }

    public function destroy($id)
    {
        $emprunt = Emprunt::findOrFail($id);

        if ($emprunt->statut === 'en_cours' || $emprunt->statut === 'en_retard') {
            $livre = Livre::findOrFail($emprunt->livre_id);
            $livre->increment('stock');
        }

        $emprunt->delete();
        return response()->json(['message' => 'Emprunt supprime']);
    }

    public function parAdherent($adherentId)
    {
        return Emprunt::with('livre', 'adherent')
            ->where('adherent_id', $adherentId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}