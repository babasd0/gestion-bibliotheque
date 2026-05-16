<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('adherents', function (Blueprint $table) {
            $table->string('numero_adherent')->unique()->nullable()->after('telephone');
            $table->boolean('sanctionne')->default(false)->after('numero_adherent');
            $table->text('motif_sanction')->nullable()->after('sanctionne');
        });
    }

    public function down(): void
    {
        Schema::table('adherents', function (Blueprint $table) {
            $table->dropColumn(['numero_adherent', 'sanctionne', 'motif_sanction']);
        });
    }
};