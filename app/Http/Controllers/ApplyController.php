<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\Project;
use App\Models\UserAppliedList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplyController extends Controller
{
    public function index()
    {
        $appliedPositions = UserAppliedList::query()
            ->select(['id', 'position_id',])
            ->with(['position', 'position.project'])
            ->where('user_id', auth()->user()->id)
            ->paginate(10);
        return Inertia::render('User/AppliedProject', [
            'appliedPositions' => $appliedPositions
        ]);
    }
    public function store($id)
    {
        // 1. Cari Posisi beserta data Project-nya
        $position = Position::with('project')->findOrFail($id);

        // 2. Validasi: Pemilik Project TIDAK BOLEH melamar di project sendiri
        if ($position->project->user_id === Auth::id()) {
            return back()->with('error', 'Anda tidak bisa melamar di project sendiri.');
        }

        // 3. Validasi: Cek Double Apply (Mencegah user melamar 2x di posisi yang sama)
        $hasApplied = UserAppliedList::where('user_id', Auth::id())
            ->where('position_id', $id)
            ->exists();

        if ($hasApplied) {
            return back()->with('error', 'Anda sudah melamar posisi ini sebelumnya.');
        }

        // 4. Simpan Lamaran (Tanpa kolom message)
        UserAppliedList::create([
            'user_id' => Auth::id(),
            'position_id' => $position->id,
            'status' => 'applied',
        ]);

        return back()->with('success', 'Berhasil melamar posisi ini!');
    }
    public function destroy($id)
    {
        $application = UserAppliedList::findOrFail($id);

        // Pastikan yang menghapus adalah pelamar itu sendiri
        if ($application->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Hanya boleh batal jika status masih 'applied' (belum direspon owner)
        if ($application->status !== 'applied') {
            return back()->with('error', 'Lamaran yang sudah diproses tidak bisa dibatalkan.');
        }

        $application->delete();

        return back()->with('success', 'Lamaran berhasil dibatalkan.');
    }


    public function approve($id)
    {
        // 1. Cari Data Lamaran
        $application = UserAppliedList::with('position.project')->findOrFail($id);

        // 2. Authorization: Pastikan user login adalah PEMILIK PROJECT
        if ($application->position->project->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk menyetujui pelamar ini.');
        }

        // 3. Update Status jadi 'accepted'
        $application->update(['status' => 'accepted']);

        return back()->with('success', 'Pelamar berhasil diterima.');
    }

    /**
     * Menolak Pelamar (Hanya Owner Project)
     * Route: PUT /reject/{id}
     * Parameter $id di sini adalah ID LAMARAN (user_applied_lists->id)
     */
    public function reject($id)
    {
        // 1. Cari Data Lamaran
        $application = UserAppliedList::with('position.project')->findOrFail($id);

        // 2. Authorization: Pastikan user login adalah PEMILIK PROJECT
        if ($application->position->project->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki izin untuk menolak pelamar ini.');
        }

        // 3. Update Status jadi 'rejected'
        $application->update(['status' => 'rejected']);

        return back()->with('success', 'Pelamar ditolak.');
    }
}
