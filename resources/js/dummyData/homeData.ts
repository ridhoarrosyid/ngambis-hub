// src/data/homeData.ts (buat file ini)

import type { Testimonial } from '@/types';

export const dummyTestimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Ahmad Zaki',
        message: 'Ngambishub benar-benar mengubah cara saya berkolaborasi. Kualitas proyeknya sangat tinggi!',
        role: 'Frontend Developer',
    },
    {
        id: 2,
        name: 'Maya Sari',
        message: 'Saya menemukan tim yang sempurna untuk ide side project saya di sini. Dukungan komunitasnya luar biasa.',
        role: 'UI/UX Designer',
    },
    {
        id: 3,
        name: 'Bimo Wicaksono',
        message: 'Sebagai pelajar, fitur project display sangat membantu portofolio saya. Highly recommended!',
        role: 'Mahasiswa Informatika',
    },
];
