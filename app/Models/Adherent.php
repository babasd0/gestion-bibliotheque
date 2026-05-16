<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adherent extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'numero_adherent',
        'sanctionne',
        'motif_sanction',
    ];

    protected $hidden = ['password'];

    public function emprunts()
    {
        return $this->hasMany(Emprunt::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}