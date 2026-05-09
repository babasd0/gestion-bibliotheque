<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Livre extends Model
{
    protected $fillable = [
        'titre',
        'auteur',
        'genre',
        'isbn',
        'stock',
    ];

    public function emprunts()
    {
        return $this->hasMany(Emprunt::class);
    }
}