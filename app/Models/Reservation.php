<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'livre_id',
        'adherent_id',
        'date_reservation',
        'date_retour_souhaitee',
        'statut',
        'motif_refus',
    ];

    public function livre()
    {
        return $this->belongsTo(Livre::class);
    }

    public function adherent()
    {
        return $this->belongsTo(Adherent::class);
    }
}