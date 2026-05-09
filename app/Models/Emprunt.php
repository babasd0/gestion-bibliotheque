<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Emprunt extends Model
{
    protected $fillable = [
        'livre_id',
        'adherent_id',
        'date_emprunt',
        'date_retour',
        'statut',
    ];

    protected $casts = [
        'date_emprunt' => 'date',
        'date_retour' => 'date',
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