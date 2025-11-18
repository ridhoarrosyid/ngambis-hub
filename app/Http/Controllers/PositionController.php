<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\PositionRequest;
use App\Models\Position;
use App\Models\Project;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PositionController extends Controller
{
    public function store(PositionRequest $request)
    {
        // 1. Ambil Project (Cukup ambil user_id-nya saja, tidak perlu relasi user)
        $project = Project::select('id', 'user_id')->findOrFail($request->project_id);

        // 2. Cek Kepemilikan (Langsung bandingkan user_id project dengan user login)
        if ($project->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk menambah posisi di project ini.');
        }

        // 3. Simpan
        Position::create($request->validated());

        return back()->with('success', 'Posisi berhasil ditambahkan.');
    }

    public function update(PositionRequest $request, $id)
    {
        // Menggunakan with('project') untuk Eager Loading mengurangi query berulang saat akses properti project nanti
        $position = Position::with('project')->findOrFail($id);

        // Cek Kepemilikan
        if ($position->project->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit posisi ini.');
        }

        // Update
        $position->update($request->validated());

        return back()->with('success', 'Posisi berhasil diperbarui.');
    }

    // Ubah nama method dari 'delete' ke 'destroy' (Standar Laravel)
    public function destroy($id)
    {
        $position = Position::with('project')->findOrFail($id);

        // Cek Kepemilikan
        if ($position->project->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk menghapus posisi ini.');
        }

        $position->delete();

        return back()->with('success', 'Posisi berhasil dihapus.');
    }
}
