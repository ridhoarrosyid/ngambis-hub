<?php

namespace Database\Factories;

use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAppliedList>
 */
class UserAppliedListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Ambil ID User secara acak dari yang sudah ada
            // Fallback: jika tabel user kosong, buat user baru
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),

            // Ambil ID Position secara acak dari yang sudah ada
            'position_id' => Position::inRandomOrder()->first()->id ?? Position::factory(),

            // Status lamaran random
            'status' => fake()->randomElement(['applied', 'accepted', 'rejected']),
        ];
    }
}
