<?php
namespace App\Http\Controllers;
use App\Models\Adherent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MembreAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:adherents',
            'telephone' => 'nullable|string',
            'password' => 'required|min:6',
        ]);

        $data = $request->all();
        $data['password'] = Hash::make($request->password);
        $data['numero_adherent'] = 'MBR-' . (Adherent::count() + 1);

        $adherent = Adherent::create($data);
        return response()->json($adherent, 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $adherent = Adherent::where('email', $request->email)->first();

        if (!$adherent || !Hash::check($request->password, $adherent->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        if ($adherent->sanctionne) {
            return response()->json(['message' => 'Votre compte est suspendu. Contactez la bibliotheque.'], 403);
        }

        return response()->json([
            'adherent' => $adherent,
            'token' => 'membre_' . base64_encode($adherent->id . '_' . time()),
        ]);
    }

    public function mesEmprunts(Request $request)
    {
        $adherentId = $request->query('adherent_id');
        $adherent = Adherent::with('emprunts.livre')->findOrFail($adherentId);
        return response()->json($adherent->emprunts);
    }

    public function mesReservations(Request $request)
    {
        $adherentId = $request->query('adherent_id');
        $reservations = \App\Models\Reservation::with('livre')
            ->where('adherent_id', $adherentId)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($reservations);
    }
}