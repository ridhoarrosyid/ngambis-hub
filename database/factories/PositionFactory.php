<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Position>
 */
class PositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Ambil Project acak yang sudah ada. Jika kosong, buat baru.
            'project_id' => Project::inRandomOrder()->first()->id ?? Project::factory(),

            'name' => fake()->jobTitle(),
            'responsibility' => fake()->paragraph(),
        ];
    }
}
