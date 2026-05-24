<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1. Change events.type enum to include all new types
        // First drop the existing enum constraint by changing to string, then re-add as enum
        Schema::table('events', function (Blueprint $table) {
            $table->string('type', 50)->default('other')->change();
            $table->string('category', 50)->nullable()->after('type')->comment('internship, full_time, part_time, contract, etc.');
        });

        // 2. Add phone to students table
        Schema::table('students', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('bio');
        });

        // 3. Add phone to alumni table
        Schema::table('alumni', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('bio');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->enum('type', ['webinar', 'workshop', 'meetup', 'other'])->default('other')->change();
        });
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
        Schema::table('alumni', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
    }
};
