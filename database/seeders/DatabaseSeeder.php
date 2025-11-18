<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Position;
use App\Models\Project;
use App\Models\User;
use App\Models\UserAppliedList;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat User Utama (Untuk kamu login)
        User::factory()->create([
            'name' => 'Ridho',
            'email' => 'ridho@example.com',
        ]);

        User::factory()->create([
            'name' => 'Abi',
            'email' => 'abi@example.com',
        ]);

        // 2. Buat User Tambahan (Dummy users)
        // Kita buat 5 user acak agar project nanti punya variasi pemilik
        User::factory(5)->create();

        // 3. Buat Categories
        // Kita panggil 3 kali karena di Factory opsinya cuma ada 3 (lomba, bisnis, project)
        // dan menggunakan unique().
        Category::factory(3)->create();

        // 4. Buat Projects
        // Factory Project akan otomatis mengambil User dan Category yang sudah dibuat di langkah 1, 2, & 3
        Project::factory(15)->create();

        // 5. Buat Positions
        // Factory Position akan otomatis mengambil Project yang sudah dibuat di langkah 4
        Position::factory(40)->create();

        $positions = \App\Models\Position::all();
        $users = \App\Models\User::all();

        foreach ($positions as $position) {
            // Ambil 0 sampai 3 user acak untuk melamar ke posisi ini
            $applicants = $users->random(rand(0, 3));

            foreach ($applicants as $applicant) {
                UserAppliedList::factory()->create([
                    'user_id' => $applicant->id,
                    'position_id' => $position->id,
                ]);
            }
        }
    }
}
