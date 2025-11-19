<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Kategori Spesifik (Penting: Gunakan firstOrCreate agar tidak duplikat)
        $categories = [
            'lomba',
            'bisnis',
            'volunteering',
            'kategori lainnya'
        ];

        foreach ($categories as $catName) {
            Category::firstOrCreate(
                ['name' => $catName], // Cek berdasarkan nama
                ['name' => $catName]  // Data yang dibuat jika belum ada
            );
        }

        // 2. Data Dummy Lainnya (Opsional, bisa dikomentari jika di Production)
        // User::factory(10)->create();
    }
}
