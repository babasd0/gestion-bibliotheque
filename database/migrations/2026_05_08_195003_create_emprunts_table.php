<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emprunts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('livre_id')->constrained('livres')->onDelete('cascade');
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->date('date_emprunt');
            $table->date('date_retour')->nullable();
            $table->enum('statut', ['en_cours', 'retourne', 'en_retard'])->default('en_cours');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('emprunts');
    }
};