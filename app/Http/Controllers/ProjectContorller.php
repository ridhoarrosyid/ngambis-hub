<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ProjectRequest;
use App\Models\Category;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectContorller extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->select(['id', 'name',])
            ->where('user_id', auth()->user()->id)
            ->paginate(10);
        return Inertia::render('User/MyProjects', [
            'projects' => $projects
        ]);
    }

    public function show($id)
    {
        $project = Project::query()
            ->select(['id', 'user_id', 'category_id', 'name', 'description', 'image',])
            ->where('id', $id)
            ->with(['positions', 'category', 'user', 'positions.userAppliedList.user', 'positions.currentApplication'])
            ->first();

        $isMine = $project->user_id === auth()->user()?->id;


        return Inertia::render('User/ShowProject', [
            'project' => $project,
            'isMine' => $isMine
        ]);
    }

    public function create()
    {
        $categories = Category::query()
            ->select(['id', 'name'])
            ->get();
        return Inertia::render('User/CreateProject', ['categories' => $categories]);
    }

    public function store(ProjectRequest $request)
    {
        // Data yang sudah lolos validasi
        $validated = $request->validated();

        // Handle upload file jika ada
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('projects', 'public');
        }

        // Tambahkan user_id dari user yang sedang login
        $validated['user_id'] = auth()->id();

        // Simpan ke database
        Project::create($validated);

        return redirect()->route('my-projects')->with('success', 'Project berhasil dibuat!');
    }

    public function edit($id)
    {
        $project = Project::query()
            ->select(['id', 'user_id', 'category_id', 'name', 'description', 'image',])
            ->where('id', $id)
            ->with(['category'])
            ->first();
        $categories = Category::query()
            ->select(['id', 'name'])
            ->get();

        return Inertia::render('User/EditProject', [
            'project' => $project,
            'categories' => $categories
        ]);
    }

    public function update(ProjectRequest $request, $id)
    {
        // 1. Cari project atau error 404
        $project = Project::findOrFail($id);

        // 2. Cek Kepemilikan (Security)
        if ($project->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah project ini.');
        }

        // 3. Ambil data yang sudah divalidasi dari ProjectRequest
        $validated = $request->validated();

        // 4. Logika Update Gambar
        if ($request->hasFile('image')) {
            // A. Hapus gambar lama jika ada
            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }

            // B. Simpan gambar baru
            $validated['image'] = $request->file('image')->store('projects', 'public');
        } else {
            // C. Jika tidak upload gambar baru, jangan ubah field image (hapus dari array validated)
            unset($validated['image']);
        }

        // 5. Update Database
        $project->update($validated);

        // 6. Redirect
        return redirect()->route('my-projects')->with('success', 'Project berhasil diperbarui!');
    }

    public function destroy($id)
    {
        // 1. Cari project
        $project = Project::findOrFail($id);

        // 2. Cek Kepemilikan
        if ($project->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus project ini.');
        }

        // 3. Hapus Gambar dari Storage (Bersih-bersih)
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }

        // 4. Hapus Record dari Database
        $project->delete();

        // 5. Redirect kembali (biasanya ke halaman list)
        return redirect()->route('my-projects')->with('success', 'Project berhasil dihapus.');
    }
}
