<?php
namespace App\Http\Controllers;
use App\Models\Adherent;
use Illuminate\Http\Request;

class AdherentController extends Controller
{
    public function index()
    {
        return Adherent::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:adherents',
            'telephone' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['numero_adherent'] = 'MBR-' . (Adherent::count() + 1);

        $adherent = Adherent::create($data);
        return response()->json($adherent, 201);
    }

    public function show($id)
    {
        return Adherent::with('emprunts.livre')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $adherent = Adherent::findOrFail($id);
        $adherent->update($request->all());
        return response()->json($adherent);
    }

    public function destroy($id)
    {
        Adherent::findOrFail($id)->delete();
        return response()->json(['message' => 'Adherent supprime']);
    }

    public function sanctionner(Request $request, $id)
    {
        $adherent = Adherent::findOrFail($id);
        $adherent->update([
            'sanctionne' => true,
            'motif_sanction' => $request->motif_sanction,
        ]);
        return response()->json($adherent);
    }

    public function lever_sanction($id)
    {
        $adherent = Adherent::findOrFail($id);
        $adherent->update([
            'sanctionne' => false,
            'motif_sanction' => null,
        ]);
        return response()->json($adherent);
    }
}