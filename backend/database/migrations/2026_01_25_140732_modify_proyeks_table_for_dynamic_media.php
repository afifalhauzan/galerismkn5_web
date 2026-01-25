<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proyeks', function (Blueprint $table) {
            // Make tautan_proyek nullable to support dynamic media types
            $table->string('tautan_proyek')->nullable()->change();
            
            // Make youtube_url nullable (if it isn't already)
            $table->string('youtube_url')->nullable()->change();
            
            // Add media_type field for dynamic media support
            $table->enum('media_type', ['link', 'youtube', 'image'])->default('link')->after('deskripsi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proyeks', function (Blueprint $table) {
            // Remove media_type field
            $table->dropColumn('media_type');
            
            // Revert tautan_proyek to NOT NULL (commented out to prevent data loss)
            // $table->string('tautan_proyek')->nullable(false)->change();
        });
    }
};
