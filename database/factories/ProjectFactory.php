<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Ambil User acak yang sudah ada. Jika kosong, buat baru.
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),

            // Ambil Category acak yang sudah ada (lomba/bisnis/project). Jika kosong, buat baru.
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),

            'name' => fake()->sentence(4),
            'description' => fake()->paragraph(3),

        ];
    }
}
