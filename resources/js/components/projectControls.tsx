// src/components/ProjectControls.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

// Interface untuk state kontrol (opsional, tapi bagus untuk TypeScript)
interface ProjectControlsProps {
    onSearch: (query: string) => void;
    onFilterChange: (tag: string) => void;
    onSortChange: (sortOption: string) => void;
    // Tambahkan prop lain jika kamu ingin mengontrol state dari parent
}

// Data dummy untuk filter dan sort
const availableTags = ['Node.js', 'Laravel', 'React', 'Python', 'Golang', 'Design'];
const sortOptions = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'roles', label: 'Paling Butuh Role' },
];

export default function ProjectControls({ onSearch, onFilterChange, onSortChange }: ProjectControlsProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm md:flex-row">
            {/* 1. Search Bar (Full Width di Mobile, Flex-grow di Desktop) */}
            <div className="relative flex-grow">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                    type="text"
                    placeholder="Cari berdasarkan nama proyek atau kontributor..."
                    className="w-full pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            {/* 2. Filter (Select - Tag) */}
            <Select onValueChange={onFilterChange} defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                    <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter Tag" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Tag</SelectItem>
                    {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                            {tag}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* 3. Sort (Select - Urutan) */}
            <Select onValueChange={onSortChange} defaultValue="latest">
                <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Tombol Reset Filter (Opsi Tambahan) */}
            <Button
                variant="ghost"
                onClick={() => {
                    /* Tambahkan logika reset */
                }}
            >
                Reset
            </Button>
        </div>
    );
}
