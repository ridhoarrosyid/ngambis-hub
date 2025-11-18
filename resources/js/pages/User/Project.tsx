// src/pages/ProjectsPage.tsx

import ProjectCard from '@/components/projectCard';
import ProjectControls from '@/components/projectControls';
import { allProjects } from '@/dummyData/projectData';
import AppLayout from '@/layouts/AppLayout';
import React, { useMemo, useState } from 'react';

export default function Project() {
    // State untuk kontrol
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('latest');

    // Logika Filtering dan Sorting menggunakan useMemo untuk performa
    const filteredAndSortedProjects = useMemo(() => {
        let currentProjects = [...allProjects];

        // 1. FILTERING (Search Bar)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            currentProjects = currentProjects.filter(
                (project) =>
                    project.name.toLowerCase().includes(query) ||
                    project.contributor.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query),
            );
        }

        // 2. FILTERING (Tag)
        if (selectedTag !== 'all') {
            currentProjects = currentProjects.filter((project) => project.tags.includes(selectedTag));
        }

        // 3. SORTING
        currentProjects.sort((a, b) => {
            if (sortOption === 'latest') {
                // Dalam data dummy, kita asumsikan ID yang lebih besar adalah yang terbaru
                return b.id - a.id;
            } else if (sortOption === 'oldest') {
                return a.id - b.id;
            } else if (sortOption === 'roles') {
                // Urutkan berdasarkan jumlah rolesNeeded terbanyak
                return b.rolesNeeded.length - a.rolesNeeded.length;
            }
            return 0;
        });

        return currentProjects;
    }, [searchTerm, selectedTag, sortOption]); // Rerun ketika salah satu state berubah

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="mb-6 text-4xl font-bold">Jelajahi Project</h1>

            {/* Kontrol (Search + Filter + Sort) */}
            <ProjectControls onSearch={setSearchTerm} onFilterChange={setSelectedTag} onSortChange={setSortOption} />

            {/* Projects List */}
            {filteredAndSortedProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                // State jika tidak ada proyek ditemukan
                <div className="rounded-lg bg-gray-50 py-12 text-center">
                    <p className="text-xl text-gray-600">Tidak ada project ditemukan dengan kriteria tersebut.</p>
                    <p className="mt-2 text-sm text-gray-400">Coba ubah kata kunci pencarian atau filter.</p>
                </div>
            )}
        </div>
    );
}
Project.layout = (page: React.ReactNode) => <AppLayout children={page} />;
