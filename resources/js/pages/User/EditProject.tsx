import AppLayout from '@/layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Save, Upload } from 'lucide-react';
import React, { FormEventHandler, useState } from 'react';

// Komponen UI Shadcn
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { updateProjects } from '@/routes';
import { Project } from '@/types';

// Tipe Data
interface Category {
    id: number;
    name: string;
}

interface CreateProjectProps {
    project: Project;
    categories: Category[];
}

export default function EditProject({ project, categories }: CreateProjectProps) {
    // State untuk preview gambar
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Setup Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        name: project.name ?? '',
        category_id: project.category_id ?? -1,
        description: project.description ?? '',
        image: project.image ?? (null as File | null),
        _method: 'PUT',
    });

    // Handle perubahan input file gambar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            // Buat URL objek untuk preview
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle Submit Form
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Kirim data ke route store (sesuaikan URL jika perlu)
        post(updateProjects(project.id).url, {
            forceFormData: true, // Penting untuk upload file
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Edit Project" />

            <div className="container mx-auto max-w-3xl px-4 py-10">
                {/* Header & Tombol Kembali */}
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        onClick={() => {
                            window.history.back();
                        }}
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Project</h1>
                        <p className="text-sm text-muted-foreground">Isi formulir di bawah untuk edit karyamu.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Project</CardTitle>
                            <CardDescription>Detail lengkap mengenai project yang ingin kamu tampilkan.</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* 1. Input Nama Project */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Project</Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: Aplikasi E-Commerce Berbasis Laravel"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            </div>

                            {/* 2. Dropdown Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select onValueChange={(value) => setData('category_id', parseInt(value))} defaultValue={data.category_id.toString()}>
                                    <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih kategori project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {/* Capitalize huruf pertama */}
                                                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <span className="text-sm text-red-500">{errors.category_id}</span>}
                            </div>

                            {/* 3. Input Image (Upload) */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar Cover</Label>

                                {/* Area Upload Kustom */}
                                <div
                                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}
                                >
                                    {imagePreview ? (
                                        <div className="relative max-h-64 w-full overflow-hidden rounded-md">
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                                onClick={() => {
                                                    setData('image', null);
                                                    setImagePreview(null);
                                                }}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="inline-block rounded-full bg-gray-100 p-3">
                                                <ImageIcon className="h-6 w-6 text-gray-500" />
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <label htmlFor="image-upload" className="cursor-pointer font-semibold text-blue-600 hover:underline">
                                                    Klik untuk upload
                                                </label>{' '}
                                                atau drag and drop
                                            </div>
                                            <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max. 2MB)</p>
                                        </div>
                                    )}

                                    {/* Hidden Input */}
                                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </div>
                                {errors.image && <span className="text-sm text-red-500">{errors.image}</span>}
                            </div>

                            {/* 4. Input Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan detail project, teknologi yang digunakan, dan tujuannya..."
                                    className={`min-h-[150px] ${errors.description ? 'border-red-500' : ''}`}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? (
                                        <>
                                            <Upload className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Simpan Project
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}

// Menerapkan Layout
EditProject.layout = (page: React.ReactNode) => <AppLayout children={page} />;
