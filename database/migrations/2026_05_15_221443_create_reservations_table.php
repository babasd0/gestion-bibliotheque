<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('livre_id')->constrained('livres')->onDelete('cascade');
            $table->foreignId('adherent_id')->constrained('adherents')->onDelete('cascade');
            $table->date('date_reservation');
            $table->enum('statut', ['en_attente', 'validee', 'refusee', 'annulee'])->default('en_attente');
            $table->text('motif_refus')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};