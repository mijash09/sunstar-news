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
        Schema::create('articles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->nullable()->index();
            $table->string('category')->default('मुख्य समाचार')->index();
            $table->json('categories')->nullable();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->text('image')->nullable();
            $table->json('images')->nullable();
            $table->string('author')->default('सनस्टार संवाददाता');
            $table->string('source')->default('SunstarNews.com');
            $table->string('time')->default('भर्खरै');
            $table->string('views')->default('१.२ के');
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(12);
            $table->integer('shares_count')->default(0);
            $table->json('comments_list')->nullable();
            $table->integer('comments_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_exclusive')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
