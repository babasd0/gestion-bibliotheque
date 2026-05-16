<?php
namespace App\Http\Controllers;
use App\Models\Reservation;
use App\Models\Livre;
use App\Models\Adherent;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return Reservation::with('livre', 'adherent')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'livre_id' => 'required|exists:livres,id',
            'adherent_id' => 'required|exists:adherents,id',
            'date_reservation' => 'required|date',
        ]);

        $adherent = Adherent::findOrFail($request->adherent_id);

        if ($adherent->sanctionne) {
            return response()->json(['message' => 'Cet adherent est sanctionne et ne peut pas faire de reservation.'], 400);
        }

        $existe = Reservation::where('livre_id', $request->livre_id)
            ->where('adherent_id', $request->adherent_id)
            ->where('statut', 'en_attente')
            ->first();

        if ($existe) {
            return response()->json(['message' => 'Une reservation en attente existe deja pour ce livre et cet adherent.'], 400);
        }

        $reservation = Reservation::create([
            'livre_id' => $request->livre_id,
            'adherent_id' => $request->adherent_id,
            'date_reservation' => $request->date_reservation,
            'statut' => 'en_attente',
        ]);

        return response()->json($reservation->load('livre', 'adherent'), 201);
    }

    public function valider($id)
    {
        $reservation = Reservation::findOrFail($id);
        $livre = Livre::findOrFail($reservation->livre_id);

        if ($livre->stock <= 0) {
            return response()->json(['message' => 'Livre non disponible'], 400);
        }

        $reservation->update(['statut' => 'validee']);
        return response()->json($reservation->load('livre', 'adherent'));
    }

    public function refuser(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update([
            'statut' => 'refusee',
            'motif_refus' => $request->motif_refus,
        ]);
        return response()->json($reservation->load('livre', 'adherent'));
    }

    public function destroy($id)
    {
        Reservation::findOrFail($id)->delete();
        return response()->json(['message' => 'Reservation supprimee']);
    }
}