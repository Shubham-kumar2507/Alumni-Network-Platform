<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('alumni', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company')->nullable();
            $table->string('job_role')->nullable();
            $table->string('industry')->nullable();
            $table->unsignedTinyInteger('experience_years')->default(0);
            $table->text('bio')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github')->nullable();
            $table->boolean('is_mentor')->default(false);
            $table->year('graduation_year')->nullable();
            $table->string('college')->nullable();
            $table->string('branch')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alumni');
    }
};
